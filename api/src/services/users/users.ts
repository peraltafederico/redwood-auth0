import { ManagementClient, PostIdentitiesRequestProviderEnum } from 'auth0'
import type {
  QueryResolvers,
  MutationResolvers,
  UserRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

import { verify } from '../../lib/jwt'

const managementClient = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
  clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
})

export const users: QueryResolvers['users'] = () => {
  return db.user.findMany()
}

export const user: QueryResolvers['user'] = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  })
}

export const createUser: MutationResolvers['createUser'] = ({ input }) => {
  return db.user.create({
    data: input,
  })
}

export const updateUser: MutationResolvers['updateUser'] = ({ id, input }) => {
  return db.user.update({
    data: input,
    where: { id },
  })
}

export const deleteUser: MutationResolvers['deleteUser'] = ({ id }) => {
  return db.user.delete({
    where: { id },
  })
}

export const linkUser: MutationResolvers['linkUser'] = async ({ input }) => {
  const decodedLinkwith = await verify(input.linkWith)
  const linkWithUserId = decodedLinkwith[
    process.env.AUTH0_AUDIENCE + '/app_metadata'
  ]?.userId as string

  await db.$transaction(async (_db) => {
    console.log('linkWithUserId', decodedLinkwith, linkWithUserId)

    await _db.post.updateMany({
      data: {
        authorId: context.currentUser.userId,
      },
      where: {
        authorId: linkWithUserId,
      },
    })

    await _db.user.delete({
      where: {
        id: linkWithUserId,
      },
    })

    await managementClient.users.link(
      {
        id: context.currentUser.sub,
      },
      {
        user_id: decodedLinkwith.sub,
        provider: decodedLinkwith.sub.split(
          '|'
        )[0] as PostIdentitiesRequestProviderEnum,
      }
    )
  })

  return db.user.findUnique({
    where: { id: context.currentUser.userId },
  })
}

export const User: UserRelationResolvers = {
  posts: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).posts()
  },
  auth0User: async (_obj, { root }) => {
    const { data } = await managementClient.users.get({ id: root.auth0Id })
    console.log('data', JSON.stringify(data))
    return data
  },
}
