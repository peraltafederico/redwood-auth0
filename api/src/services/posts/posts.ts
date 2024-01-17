import type {
  QueryResolvers,
  MutationResolvers,
  PostRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

import { requireAuth } from '../../lib/auth'

export const posts: QueryResolvers['posts'] = () => {
  return db.post.findMany()
}

export const post: QueryResolvers['post'] = ({ id }) => {
  return db.post.findUnique({
    where: { id },
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

export const updatePost: MutationResolvers['updatePost'] = async ({
  id,
  input,
}) => {
  const { isOwner, post } = await getOwnerPost(id)

  const update = async () => {
    return db.post.update({
      // Keep the authorId the same
      data: { ...input, authorId: post.authorId },
      where: { id },
    })
  }
  if (isOwner) {
    return update()
  }

  requireAuth({ roles: ['admin'] })

  return update()
}

export const deletePost: MutationResolvers['deletePost'] = async ({ id }) => {
  const { isOwner } = await getOwnerPost(id)

  const remove = () => {
    return db.post.delete({
      where: { id },
    })
  }

  if (isOwner) {
    return remove()
  }

  requireAuth({ roles: ['admin'] })

  return remove()
}

const getOwnerPost = async (id: string) => {
  const post = await db.post.findUnique({ where: { id } })
  return {
    post,
    isOwner: context.currentUser.userId === post.authorId,
  }
}

export const Post: PostRelationResolvers = {
  author: (_obj, { root }) => {
    return db.post.findUnique({ where: { id: root?.id } }).author()
  },
}
