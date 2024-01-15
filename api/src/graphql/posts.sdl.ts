export const schema = gql`
  type Post {
    id: String!
    title: String!
    body: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    published: Boolean!
    authorId: String!
    author: User!
  }

  type Query {
    posts: [Post!]! @requireAuth
    post(id: String!): Post @requireAuth
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
  }

  input UpdatePostInput {
    title: String
    body: String
    published: Boolean
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post! @requireAuth
    updatePost(id: String!, input: UpdatePostInput!): Post! @requireAuth
    deletePost(id: String!): Post! @requireAuth
  }
`
