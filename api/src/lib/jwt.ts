import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

import { logger } from './logger'

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
})

export const verify = async (token: string) => {
  return new Promise<jwt.JwtPayload>((resolve, reject) => {
    jwt.verify(
      token,
      (header, callback) => {
        client.getSigningKey(header.kid, function (err, key: any) {
          if (err) {
            reject(err)
            logger.error('Error getting signing key', err)
            return
          }

          const signingKey = key.publicKey || key.rsaPublicKey
          callback(null, signingKey)
        })
      },
      (err, decoded) => {
        if (err) {
          reject(err)
          logger.error('Error verifying token', err)

          return
        }
        resolve(decoded as jwt.JwtPayload)
      }
    )
  })
}
