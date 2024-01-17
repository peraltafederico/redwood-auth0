import type { DeletePostMutationVariables, FindPostById } from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { checkboxInputTag, timeTag } from 'src/lib/formatters'

import useIsPostOwner from '../../../hooks/useIsPostOwner'

const DELETE_POST_MUTATION = gql`
  mutation DeletePostMutation($id: String!) {
    deletePost(id: $id) {
      id
    }
  }
`

interface Props {
  post: NonNullable<FindPostById['post']>
}

const Post = ({ post }: Props) => {
  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    onCompleted: () => {
      toast.success('Post deleted')
      navigate(routes.posts())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeletePostMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete post ' + id + '?')) {
      deletePost({ variables: { id } })
    }
  }
  const { isFullAccess } = useIsPostOwner()

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Post {post.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{post.id}</td>
            </tr>
            <tr>
              <th>Title</th>
              <td>{post.title}</td>
            </tr>
            <tr>
              <th>Body</th>
              <td>{post.body}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(post.createdAt)}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(post.updatedAt)}</td>
            </tr>
            <tr>
              <th>Published</th>
              <td>{checkboxInputTag(post.published)}</td>
            </tr>
            <tr>
              <th>Author id</th>
              <td>{post.authorId}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        {isFullAccess(post) && (
          <Link
            to={routes.editPost({ id: post.id })}
            className="rw-button rw-button-blue"
          >
            Edit
          </Link>
        )}
        {isFullAccess(post) && (
          <button
            type="button"
            className="rw-button rw-button-red"
            onClick={() => onDeleteClick(post.id)}
          >
            Delete
          </button>
        )}
      </nav>
    </>
  )
}

export default Post
