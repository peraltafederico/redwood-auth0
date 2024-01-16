import { UserQuery } from '../../../../types/graphql'
import HomeActions from '../HomeActions/HomeActions'
import HomePages from '../HomePages/HomePages'

interface Props {
  user: NonNullable<UserQuery['user']>
}

const Home = ({ user }: Props) => {
  return (
    <>
      <pre>{JSON.stringify({ ...user }, null, 2)}</pre>
      <HomeActions />
      <HomePages />
    </>
  )
}

export default Home
