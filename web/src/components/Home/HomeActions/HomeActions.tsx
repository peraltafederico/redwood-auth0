import { Auth0Client } from '@auth0/auth0-spa-js'

import { useMutation } from '@redwoodjs/web'

import { useAuth } from '../../../auth'

const LINK_USER_MUTATION = gql`
  mutation LinkUserMutation($input: LinkUserInput!) {
    linkUser(input: $input) {
      id
    }
  }
`

const HomeActions = () => {
  const { logOut } = useAuth()
  const [linkUser, { loading }] = useMutation(LINK_USER_MUTATION)

  const authenticateUser = async () => {
    const auth0 = new Auth0Client({
      domain: process.env.AUTH0_DOMAIN || '',
      clientId: process.env.AUTH0_CLIENT_ID || '',
    })
    console.log('process.env.AUTH0_AUDIENCE', process.env.AUTH0_AUDIENCE)
    await auth0.loginWithPopup({
      authorizationParams: {
        max_age: 0,
        scope: 'openid',
      },
    })
    return auth0.getIdTokenClaims()
  }

  const link = async () => {
    const { __raw: targetUserIdToken } = await authenticateUser()

    return linkUser({
      variables: {
        input: {
          linkWith: targetUserIdToken,
        },
      },
    })
  }

  return (
    <div>
      <button onClick={() => link()}>
        {loading ? 'linking' : 'link account'}
      </button>
      <button
        onClick={() =>
          logOut({
            logoutParams: {
              returnTo: window.location.origin,
            },
          })
        }
      >
        log out
      </button>
    </div>
  )
}

export default HomeActions
