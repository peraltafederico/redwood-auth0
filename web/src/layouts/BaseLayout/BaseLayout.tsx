type BaseLayoutProps = {
  children?: React.ReactNode
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap">
        <nav className="bg-gray-100 p-4 w-full">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <ul className="flex mr-auto">
                <li className="nav-item">
                  <a
                    href="/"
                    className="nav-link text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="/posts"
                    className="nav-link text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Posts
                  </a>
                </li>
              </ul>
              <ul className="hidden md:flex">
                <li className="nav-item">
                  <button
                    id="qsLoginBtn"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Log in
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
      <div className="flex-auto mt-10">{children}</div>
    </div>
  )
}

export default BaseLayout
