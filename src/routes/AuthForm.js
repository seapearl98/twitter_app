import { authService } from 'fbase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'

 function AuthForm() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState()
  

    const onChange = e => {
        // console.log(e.target.name);
        // name을 사용해서 내가 지금 작성한 input이 누구인지 확인.(사용한 input이 여러개이기때문에 확인해야함!)
        const {target:{name, value}} = e;
        // eㄹ르 받은 타겟속성안에 name, value를 가져와라.
        if(name === 'email'){
         setEmail(value);
        }else if(name === "password"){
         setPassword(value);
         
        }
        //내가 입력한 곳의 name이 emali이니? > 맞다면 setemali의 값(내가 작성한 값)을 value에 넣어줘라.
       }
       const onSubmit = async (e) => {
         e.preventDefault();
         try {
           let data;
           if(newAccount){
               //create newAccount
               data = await createUserWithEmailAndPassword(authService, email, password)
           }else{
               //login
               data = await signInWithEmailAndPassword(authService, email, password)
           }
           //console.log(data);//회원가입을 마친 사용자 정보
         } catch (error) {
           // console.log(error);
           setError(error.message)
         }
       }
     
       const  toggleAccount = () => setNewAccount( (prev) => !prev );

  return (
    <>   
    <form onSubmit={onSubmit}> 
        <input type="email" placeholder='Email' required
        name='email' value={email} onChange={onChange}/>
        <input type="password" placeholder='Password' required
        name='password' value={password} onChange={onChange}/>
        <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
        {error}
    </form>
    <span onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account"}</span>
    </>
  )
}
export default AuthForm