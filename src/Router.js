import Navigation from 'components/Navigation';
import React, { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Profiles from 'routes/Profiles';

export default function AppRouter({isLoggedIn,userObj}) {
    // const [isLoggedIn, setIsLoggedIn] = useState(true);
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      {isLoggedIn && <Navigation userObj={userObj}/>}
        <Routes>
        {isLoggedIn ? (
          <>
            <Route path='/' element={<Home userObj={userObj}/>}/>
            <Route path='/profile' element={<Profiles userObj={userObj}/>}/>
          </>
        ) :(
        <Route path='/' element={<Auth/>}/> 
        )}
        </Routes>
    </BrowserRouter>
  )
}
