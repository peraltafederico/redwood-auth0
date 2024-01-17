import type { UserQueryVariables, UserQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import { useAuth } from '../../../auth'
import Home from '../Home/Home'

export const QUERY = gql`
  query UserQuery($id: String!) {
    user(id: $id) {
      id
      photoUrl
      auth0Id
      name
      email
      auth0User {
        user_id
        name
        nickname
        email
        email_verified
        logins_count
        last_ip
        last_login
        identities {
          access_token
          connection
          user_id
          provider
          isSocial
          profileData {
            email
            email_verified
          }
        }
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps<UserQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  user,
}: { token: string } & CellSuccessProps<UserQuery, UserQueryVariables>) => {
  return <Home user={user} />
}

export const beforeQuery = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { currentUser } = useAuth()

  return {
    variables: { id: currentUser.userId },
  }
}
