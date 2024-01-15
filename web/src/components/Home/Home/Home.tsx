import { useEffect, useState } from 'react'

import { useAuth } from '../../../auth'
import HomeActions from '../HomeActions/HomeActions'
import HomePages from '../HomePages/HomePages'

const Home = () => {
  const { isAuthenticated, signUp, getToken, hasRole } = useAuth()
  const [token, setToken] = useState('')

  useEffect(() => {
    const run = async () => {
      setToken(await getToken())
    }

    run()
  }, [getToken])

  const isAdmin = hasRole('admin')

  return (
    <div>
      <p>{JSON.stringify({ isAuthenticated, isAdmin }, null, 2)}</p>
      <p>{token}</p>
      {isAuthenticated ? (
        <>
          <HomeActions />
          <HomePages />
        </>
      ) : (
        <button onClick={() => signUp()}>log in</button>
      )}
    </div>
  )
}

export default Home
