import { GetUsers200ResponseOneOfInner, ManagementClient } from 'auth0'
import type { APIGatewayEvent, Context } from 'aws-lambda'

import { logger } from 'src/lib/logger'

import { db } from '../lib/db'

/**
 * The handler function is your code that processes http request events.
 * You can use return and throw to send a response or error, respectively.
 *
 * Important: When deployed, a custom serverless function is an open API endpoint and
 * is your responsibility to secure appropriately.
 *
 * @see {@link https://redwoodjs.com/docs/serverless-functions#security-considerations|Serverless Function Considerations}
 * in the RedwoodJS documentation for more information.
 *
 * @typedef { import('aws-lambda').APIGatewayEvent } APIGatewayEvent
 * @typedef { import('aws-lambda').Context } Context
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param { Context } context - contains information about the invocation,
 * function, and execution environment.
 */
export const handler = async (event: APIGatewayEvent, _context: Context) => {
  console.log('event.httpMethod', event.httpMethod)
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 404,
      }
    }

    console.log('body', event.body)

    const body = JSON.parse(event.body || '{}') as {
      token: string
      auth0Id: string
    }

    console.log(
      'process.env.AUTH0_WEBHOOK_TOKEN',
      process.env.AUTH0_WEBHOOK_TOKEN
    )

    logger.info('test')

    if (body.token !== process.env.AUTH0_WEBHOOK_TOKEN) {
      return {
        statusCode: 401,
      }
    }

    logger.info('management', process.env.AUTH0_DOMAIN)

    const management = new ManagementClient({
      domain: process.env.AUTH0_DOMAIN || '',
      clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID || '',
      clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET || '',
      audience: process.env.AUTH0_MANAGEMENT_AUDIENCE || '',
    })

    logger.info('auth0User', process.env.AUTH0_DOMAIN)

    let auth0User: GetUsers200ResponseOneOfInner

    let newUser = await db.user.findFirst({
      where: {
        auth0Id: body?.auth0Id || '',
      },
    })

    if (newUser) {
      logger.info('Found user in db', { user: newUser })
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: newUser,
        }),
      }
    }

    try {
      auth0User = (await management.users.get({ id: body?.auth0Id || '' })).data
      logger.info('Found user in auth0', { user: auth0User })
    } catch (error) {
      logger.error('Error fetching user from auth0', { error })
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: error.message,
        }),
      }
    }

    try {
      newUser = await db.user.create({
        data: {
          email: auth0User.email,
          name: auth0User.name,
          photoUrl: auth0User.picture,
          username: auth0User.nickname,
          auth0Id: auth0User.user_id,
          emailVerified: true,
        },
      })
    } catch (error) {
      logger.error('Error creating new user', { error })
      throw error
    }

    logger.info('Created new user', { user: newUser })

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...newUser,
      }),
    }
  } catch (error) {
    console.log('There was an error running the function', error)

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'There was an error running the function',
      }),
    }
  }
}
