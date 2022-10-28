import { authService } from 'fbase';
import React,{ useEffect, useState } from 'react';
import AppRouter from 'Router'
import { onAuthStateChanged } from "firebase/auth";
// 폰트어썸관련import
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons'
library.add(fas, faTwitter, faGoogle, faGithub )

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null)


  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      console.log(user);
      if (user) {
        //User is signed in
        setIsLoggedIn(user);
        setUserObj(user);
        // const uid = user.uid;

      } else {
        //User is signed out
        setIsLoggedIn(false);
      }
      setInit(true);
    });   
  }, [])
  console.log(authService.currentUser);

  return (
    <>
        {init ? (
        <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} /> ): "initializing…"}  
    <footer>&copy; {new Date().getFullYear()}twitter app</footer>
    </>

  );
}

export default App;
