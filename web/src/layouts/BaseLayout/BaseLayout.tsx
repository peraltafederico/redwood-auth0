import { Link } from '@redwoodjs/router'

import { useAuth } from '../../auth'

type BaseLayoutProps = {
  children?: React.ReactNode
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
  const { isAuthenticated, logIn, logOut, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="pb-10 sm:container sm:mx-auto">
      <div className="flex flex-wrap">
        <nav className="w-full bg-gray-100 p-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <ul className="mr-auto flex">
                <li className="nav-item">
                  <Link
                    to="/"
                    className="nav-link rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:text-gray-600"
                  >
                    Home
                  </Link>
                </li>
                {isAuthenticated && (
                  <li className="nav-item">
                    <Link
                      to="/posts"
                      className="nav-link rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:text-gray-600"
                    >
                      Posts
                    </Link>
                  </li>
                )}
              </ul>
              <ul>
                <li className="nav-item">
                  <button
                    id="qsLoginBtn"
                    className="rw-button rw-button-blue rounded px-4 py-2 font-bold text-white"
                    onClick={() => {
                      if (isAuthenticated) {
                        logOut({
                          logoutParams: {
                            returnTo: `${window.location.origin}`,
                          },
                        })
                      } else {
                        logIn({
                          authorizationParams: {
                            redirect_uri: `${window.location.origin}`,
                          },
                        })
                      }
                    }}
                  >
                    {isAuthenticated ? 'Log Out' : 'Log In'}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
      <div className="mt-10 flex-auto px-4 sm:px-0">
        {isAuthenticated ? (
          children
        ) : (
          <h1 className="text-1xl flex justify-center">Stateful Rocks!</h1>
        )}
      </div>
    </div>
  )
}

export default BaseLayout
