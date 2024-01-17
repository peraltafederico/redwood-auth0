export const schema = gql`
  type User {
    id: String!
    auth0Id: String!
    username: String
    name: String
    email: String!
    emailVerified: Boolean
    photoUrl: String
    createTime: DateTime!
    updateTime: DateTime!
    posts: [Post]!
    auth0User: Auth0User
  }
  type ProfileData {
    email: String
    email_verified: Boolean
  }
  type AppMetadata {
    userId: String
  }

  type Identities {
    provider: String
    access_token: String
    expires_in: Int
    user_id: String
    connection: String
    isSocial: Boolean
    profileData: ProfileData
  }

  type Auth0User {
    created_at: String
    email: String
    email_verified: Boolean
    family_name: String
    given_name: String
    locale: String
    name: String
    nickname: String
    picture: String
    updated_at: String
    user_id: String
    last_ip: String
    last_login: String
    logins_count: Int
    app_metadata: AppMetadata
    identities: [Identities]
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: String!): User @requireAuth
  }

  input CreateUserInput {
    username: String
    name: String
    email: String!
    emailVerified: Boolean
    photoUrl: String
    createTime: DateTime!
    updateTime: DateTime!
  }

  input UpdateUserInput {
    username: String
    name: String
    email: String
    emailVerified: Boolean
    photoUrl: String
    createTime: DateTime
    updateTime: DateTime
  }

  input LinkUserInput {
    linkWith: String!
  }

  input UnlinkUserInput {
    userId: String!
    provider: String!
  }

  type Mutation {
    linkUser(input: LinkUserInput!): User! @requireAuth
    unlinkUser(input: UnlinkUserInput!): User! @requireAuth
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: String!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: String!): User! @requireAuth
  }
`
