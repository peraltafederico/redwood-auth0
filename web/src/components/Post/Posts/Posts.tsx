import type { DeletePostMutationVariables, FindPosts } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Post/PostsCell'
import { checkboxInputTag, timeTag, truncate } from 'src/lib/formatters'

import useIsPostOwner from '../../../hooks/useIsPostOwner'

const DELETE_POST_MUTATION = gql`
  mutation DeletePostMutation($id: String!) {
    deletePost(id: $id) {
      id
    }
  }
`

const PostsList = ({ posts }: FindPosts) => {
  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    onCompleted: () => {
      toast.success('Post deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeletePostMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete post ' + id + '?')) {
      deletePost({ variables: { id } })
    }
  }

  const { isFullAccess } = useIsPostOwner()

  return (
    <div className="flex flex-col">
      <Link
        to={routes.newPost()}
        className="rw-button rw-button-blue mb-4 mr-auto"
      >
        Create Post
      </Link>
      <div className="rw-segment rw-table-wrapper-responsive">
        <table className="rw-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Title</th>
              <th>Body</th>
              <th>Created at</th>
              <th>Updated at</th>
              <th>Published</th>
              <th>Author id</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => {
              return (
                <tr key={post.id}>
                  <td>{truncate(post.id)}</td>
                  <td>{truncate(post.title)}</td>
                  <td>{truncate(post.body)}</td>
                  <td>{timeTag(post.createdAt)}</td>
                  <td>{timeTag(post.updatedAt)}</td>
                  <td>{checkboxInputTag(post.published)}</td>
                  <td>{truncate(post.authorId)}</td>
                  <td>
                    <nav className="rw-table-actions">
                      <Link
                        to={routes.post({ id: post.id })}
                        title={'Show post ' + post.id + ' detail'}
                        className="rw-button rw-button-small"
                      >
                        Show
                      </Link>
                      {isFullAccess(post) && (
                        <Link
                          to={routes.editPost({ id: post.id })}
                          title={'Edit post ' + post.id}
                          className="rw-button rw-button-small rw-button-blue"
                        >
                          Edit
                        </Link>
                      )}
                      {isFullAccess(post) && (
                        <button
                          type="button"
                          title={'Delete post ' + post.id}
                          className="rw-button rw-button-small rw-button-red"
                          onClick={() => onDeleteClick(post.id)}
                        >
                          Delete
                        </button>
                      )}
                    </nav>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PostsList
