import { Link } from '@redwoodjs/router'

import { useAuth } from '../../../auth'

const HomePages = () => {
  const { logOut } = useAuth()

  return (
    <div>
      <Link to={'/posts'}>{'Posts'}</Link>
    </div>
  )
}

export default HomePages
