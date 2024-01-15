import { Metadata } from '@redwoodjs/web'

import Home from '../../components/Home/Home/Home'

const HomePage = () => {
  return (
    <>
      <Metadata title="Home" description="Home page" />
      <Home />
    </>
  )
}

export default HomePage
