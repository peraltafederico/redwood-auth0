import type {
  QueryResolvers,
  MutationResolvers,
  PostRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

import { requireAuth } from '../../lib/auth'

export const posts: QueryResolvers['posts'] = () => {
  return db.post.findMany({
    where: {
      authorId: context.currentUser.userId,
    },
  })
}

export const post: QueryResolvers['post'] = ({ id }) => {
  return db.post.findUnique({
    where: { id, authorId: context.currentUser.userId },
  })
}

export const createPost: MutationResolvers['createPost'] = ({ input }) => {
  return db.post.create({
    data: {
      ...input,
      authorId: context.currentUser.userId,
    },
  })
}

export const updatePost: MutationResolvers['updatePost'] = ({ id, input }) => {
  return db.post.update({
    data: input,
    where: { id, authorId: context.currentUser.userId },
  })
}

export const deletePost: MutationResolvers['deletePost'] = ({ id }) => {
  requireAuth({ roles: ['admin'] })

  return db.post.delete({
    where: { id, authorId: context.currentUser.userId },
  })
}

export const Post: PostRelationResolvers = {
  author: (_obj, { root }) => {
    return db.post.findUnique({ where: { id: root?.id } }).author()
  },
}
