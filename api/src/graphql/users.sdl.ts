export const schema = gql`
  type User {
    id: String!
    username: String
    name: String
    email: String!
    emailVerified: Boolean
    photoUrl: String
    createTime: DateTime!
    updateTime: DateTime!
    posts: [Post]!
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

  type Mutation {
    linkUser(input: LinkUserInput!): User! @requireAuth
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: String!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: String!): User! @requireAuth
  }
`
