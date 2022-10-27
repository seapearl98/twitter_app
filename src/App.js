import { authService } from 'fbase';
import React,{ useEffect, useState } from 'react';
import AppRouter from 'Router'
import { onAuthStateChanged } from "firebase/auth";

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
        {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} /> : "initializing…"}  
    <footer>&copy; {new Date().getFullYear()}twitter app</footer>
    </>

  );
}

export default App;
