import { useEffect, useState } from 'react'

import { useAuth } from '../../auth'
import HomeCell from '../../components/Home/HomeCell'

const HomePage = () => {
  const { isAuthenticated, signUp, getToken, hasRole } = useAuth()
  const [token, setToken] = useState('')

  useEffect(() => {
    const run = async () => {
      setToken(await getToken())
    }

    run()
  }, [getToken])

  const isAdmin = hasRole('admin')
  console.log('token', token)

  return (
    <div>
      <pre>{JSON.stringify({ isAuthenticated, isAdmin }, null, 2)}</pre>
      {isAuthenticated ? (
        <HomeCell />
      ) : (
        <button onClick={() => signUp()}>log in</button>
      )}
    </div>
  )
}

export default HomePage
