import React from 'react'
import Footer from './Footer'
import Header from './Header'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Layout = ({children}:any) => {
  return (
    <div className=''>
    <Header />
    {children}
    <Footer />
    </div>
  )
}

export default Layout