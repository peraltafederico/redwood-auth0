import { FindPosts } from '../../types/graphql'
import { useAuth } from '../auth'

const useIsPostOwner = () => {
  const { currentUser, hasRole } = useAuth()

  const isOwner = (post: FindPosts['posts'][0]) => {
    return post.authorId === currentUser?.userId
  }

  const isFullAccess = (post: FindPosts['posts'][0]) => {
    return hasRole('admin') || isOwner(post)
  }

  return {
    isOwner,
    isFullAccess,
  }
}

export default useIsPostOwner
