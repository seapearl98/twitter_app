import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Link } from 'react-router-dom'

export default function Navigation({userObj}) {



  return (
<nav>
      <ul style={{display: 'flex',justifyContent:'center', marginTop: 50}}>
        <li>
          <Link to={"/"} style={{marginRight: 10}}>
            <FontAwesomeIcon icon="fa-brands fa-twitter" color={'#04aaff'} size='2x'/>
          </Link> 
        </li>
        <li>
          <Link to={"/profile"} style={{display: 'flex',flexDirection: 'column',alignItems:"center", marginLeft:10, fontSize:12}}>
          {userObj.photoURL && (
            <img src={userObj.photoURL} width='50' height='50' style={{borderRadius:50}}/>
          )}
          <span style={{marginTop:10}}>
            {userObj.displayName ? `${userObj.displayName}의 Profile` : "Profile"}
          </span>
          </Link>        
        </li>
      </ul>
    </nav>
  )
}
