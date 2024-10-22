import React, { useState } from 'react'
import logo from '../img/welcomecut.jfif'
import '../css/Navbar.css'
import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export default function Navbar({ login }) {
  const [show, setShow] = useState(false)
  const token = localStorage.getItem("token");
  const navigate = useNavigate()
  const location = useLocation()

  const logoutfun = () => {
    localStorage.clear();
    navigate('/signin')
  }

  const togglemenu = () => {
      if (show) {
        setShow(false)
      } else {
        setShow(true)
      }
  }
  const loginStatus = () => {

    if (token || login) {

      return [
        <>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/createpost">Upload</Link></li>
          <li><Link to="/followingpost">FollowingPost</Link></li>

          <button className='logout' onClick={() => { logoutfun() }}>Log out</button>
        </>
      ]
    }
    else {
      return [
        <>
          <li><Link to="/signin">SignIn</Link></li>
          <li><Link to="/signup">SignUp</Link></li>
        </>
      ]
    }
  }

  const loginStatusMobile = () => {
    const token = localStorage.getItem("token");
    if (token || login) {
        return [
          <>
            <div className={`menu-bar ${show ? 'active' : ''}`}>
              <li onClick={togglemenu}><Link to="/">Home</Link></li>
              <li onClick={togglemenu}><Link to="/profile">Profile</Link></li>
              <li onClick={togglemenu}><Link to="/createpost">Upload</Link></li>
              <li onClick={togglemenu}><Link to="/followingpost">FollowingPost</Link></li>
              <button className='logout' onClick={() => { logoutfun() }}>Log out</button>
            </div>
          </>
        ]
      } 
  }


  return (
    <div className='navbar'>
      <div className='logo'>
        <h1 className='logoname'>BooksExChange</h1>
      </div>
      <ul className='nav-menu'>
        {loginStatus()}
      </ul>
      <ul className={'nav-mobile'}>
      {location.pathname !== '/signup' && location.pathname !== '/signin' ? (
    <span class="material-symbols-outlined menu" onClick={togglemenu}>menu</span>
  ) : null}
        {loginStatusMobile()}
      </ul>
    </div>
  )
}
