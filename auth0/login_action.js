/**
 * This action add roles to the payload of the token. This is used by our ifra to check the authorization of the user.
 */

const SCOPE = ''
const USER_SERVICE_BASE_URL = ''

/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const axios = require('axios')

  if (event.authorization) {
    api.accessToken.setCustomClaim(`${SCOPE}/roles`, event.authorization.roles)
  }

  const isNewUser = !event.user.app_metadata.userId

  if (isNewUser) {
    try {
      const { data: user } = await axios.post(
        `${USER_SERVICE_BASE_URL}/webhook/auth0/users`,
        {
          auth0Id: event.user.user_id,
          token: 'token',
        }
      )

      event.user.app_metadata = {
        ...event.user.app_metadata,
        userId: user.id,
      }
      api.user.setAppMetadata('userId', user.id)
    } catch (error) {
      api.access.deny('Could not create user in the database')
    }
  }

  api.accessToken.setCustomClaim(
    `${SCOPE}/app_metadata`,
    event.user.app_metadata
  )
  api.idToken.setCustomClaim(`${SCOPE}/app_metadata`, event.user.app_metadata)
}

/**
 * Handler that will be invoked when this action is resuming after an external redirect. If your
 * onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
// exports.onContinuePostLogin = async (event, api) => {
// };
