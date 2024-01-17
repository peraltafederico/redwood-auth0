import { useAuth } from '../../auth'
import HomeCell from '../../components/Home/HomeCell'

const HomePage = () => {
  const { isAuthenticated } = useAuth()

  return <div>{isAuthenticated && <HomeCell />}</div>
}

export default HomePage
