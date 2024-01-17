import { useEffect, useState } from 'react'

import { Auth0Client } from '@auth0/auth0-spa-js'
import hljs from 'highlight.js'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { UserQuery } from '../../../../types/graphql'
import { useAuth } from '../../../auth'
import { truncate } from '../../../lib/formatters'
import { QUERY } from '../HomeCell'

import 'highlight.js/styles/github-dark.css'

interface Props {
  user: NonNullable<UserQuery['user']>
}

const LINK_USER_MUTATION = gql`
  mutation LinkUserMutation($input: LinkUserInput!) {
    linkUser(input: $input) {
      id
    }
  }
`

const UNLINK_USER_MUTATION = gql`
  mutation UnlinkUserMutation($input: UnlinkUserInput!) {
    unlinkUser(input: $input) {
      id
    }
  }
`

const Home = ({ user }: Props) => {
  const [_, currentAuth0UserId] = user.auth0Id.split('|')
  const { hasRole, currentUser, getToken } = useAuth()
  const codeRef = React.useRef<HTMLPreElement>(null)
  const [token, setToken] = useState('')

  useEffect(() => {
    const run = async () => {
      setToken(await getToken())
    }

    run()
  }, [getToken])

  const isAdmin = hasRole('admin')

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.removeAttribute('data-highlighted')
    }
    hljs.highlightAll()
  }, [user, token])

  const refetchQueries = [
    {
      query: QUERY,
      variables: {
        id: currentUser.userId,
      },
    },
  ]

  const [linkUser, { loading: linking }] = useMutation(LINK_USER_MUTATION, {
    refetchQueries,
  })
  const [unlinkUser, { loading: unlinking }] = useMutation(
    UNLINK_USER_MUTATION,
    {
      refetchQueries,
    }
  )

  const authenticateUser = async () => {
    const auth0 = new Auth0Client({
      domain: process.env.AUTH0_DOMAIN || '',
      clientId: process.env.AUTH0_CLIENT_ID || '',
    })
    await auth0.loginWithPopup({
      authorizationParams: {
        max_age: 0,
        scope: 'openid',
      },
    })
    return auth0.getIdTokenClaims()
  }

  const link = async () => {
    try {
      const { __raw: targetUserIdToken } = await authenticateUser()
      await linkUser({
        variables: {
          input: {
            linkWith: targetUserIdToken,
          },
        },
      })
      toast.success('Account linked')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const identities = user.auth0User.identities.filter(
    (identity) => identity.user_id !== currentAuth0UserId
  )

  const { __typename, identities: _rawIdentities, ...raw } = user.auth0User
  const isVerified = user.auth0User.email_verified

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-start sm:mb-10  sm:flex-row sm:items-center">
        <div className="mb-2 flex h-[95px] w-[95px] sm:mb-0">
          <img
            alt="user"
            src={user.photoUrl}
            className="w-full rounded-full"
          ></img>
        </div>
        <div className="sm:ml-10">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-lg text-gray-500">{`${user.email} (${user.auth0Id})`}</p>
          <p className="text-md text-gray-500">{`${
            isAdmin ? 'Admin User' : 'Regular User (Ask for admin access!)'
          }`}</p>
        </div>
      </div>
      <div className="mb-4">
        <pre className="overflow-x-auto">
          <code ref={codeRef}>
            {JSON.stringify(
              {
                ...raw,
                token: token
                  ? JSON.parse(
                      Buffer.from(token.split('.')[1], 'base64').toString()
                    )
                  : undefined,
              },
              null,
              2
            )}
          </code>
        </pre>
      </div>
      {identities.length > 0 && (
        <div className="rw-segment rw-table-wrapper-responsive">
          <table className="rw-table">
            <thead>
              <tr>
                <th>Connection</th>
                <th>Is Social</th>
                <th>Provider</th>
                <th>User Id</th>
                <th>Profile Data</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {identities.map((identity) => {
                const { __typename, ...data } = identity.profileData
                return (
                  <tr key={identity.user_id}>
                    <td>{truncate(identity.connection)}</td>
                    <td>{identity.isSocial ? 'true' : 'false'}</td>
                    <td>{truncate(identity.provider)}</td>
                    <td>{truncate(identity.user_id)}</td>
                    <td>{truncate(JSON.stringify(data || {}))}</td>
                    <td>
                      <nav className="rw-table-actions">
                        <button
                          type="button"
                          title={'Unlik ' + identity.provider}
                          className="rw-button rw-button-small rw-button-red"
                          onClick={async () => {
                            await unlinkUser({
                              variables: {
                                input: {
                                  userId: identity.user_id,
                                  provider: identity.provider,
                                },
                              },
                            })

                            toast.success('Account unlinked')
                          }}
                        >
                          {unlinking ? 'Unlinking' : 'Unlink'}
                        </button>
                      </nav>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center gap-2">
        <button
          className="rw-button rw-button-blue mt-4 max-w-max px-10 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={link}
          disabled={linking || !isVerified}
        >
          {linking ? 'Linking' : 'Link account'}
        </button>
        {!isVerified && (
          <p className="mt-4 text-red-500">
            You need to verify your email before linking accounts.
          </p>
        )}
      </div>
    </div>
  )
}

export default Home
