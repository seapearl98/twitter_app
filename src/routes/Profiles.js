import React, { useEffect,useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { authService,db,storage } from '../fbase';
import Tweet from '../components/Tweet';
import { async } from '@firebase/util'
import { collection, addDoc, query, onSnapshot,getDocs,where,orderBy } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadString, getDownloadURL } from "firebase/storage";


function Profiles({userObj}) {
  const [tweets, setTweets] = useState([]); 
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [newPhotoURL,setNewPhotoURL] = useState(userObj.photoURL);
 
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/"); // 홈으로 이동
  }

  const getMyTweets = async() => {
    const q = query(collection(db, "tweets"),
                    where("createId", "==", userObj.uid), 
                    orderBy("createAt", "desc")) //asc : 오름차순
    const querySnapshot = await getDocs(q);
    const newArray = [];
    querySnapshot.forEach((doc) => {
        // querySnapshot : firebase에서 컬렉션을 마치 사진찍듯이 찍어서 보여준다.
        newArray.push({...doc.data(), id:doc.id}) //id추가
        setTweets(newArray);
      });
  }

  const onFileChange = (e) => {
    const {target: {files}} = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      console.log(finishedEvent);
      const {currentTarget: {result}} = finishedEvent;
      setNewPhotoURL(result);
    }
    reader.readAsDataURL(theFile)
  }

  const onChange = (e) => {
    const {target: {value}} = e;
    setNewDisplayName(value);
  }
  // const onSubmit = async(e) => {
  //   e.preventDefault();
  //   let photoURL = "";
  //   if(userObj.photoURL != newPhotoURL){
  //     const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
  //     const response = await uploadString(storageRef, newPhotoURL, 'data_url');
  //     console.log(response)
  //     photoURL = await getDownloadURL(ref(storage, response.ref))
  //     await updateProfile(userObj, {photoURL: newPhotoURL});
  //   }

  //   if(userObj.displayName != newDisplayName){
  //     await updateProfile(userObj, {displayName: newDisplayName});
  //   }
  // }
  const onSubmit = async(e) => {
    e.preventDefault();
    let photoURL = "";
    if(photoURL != newPhotoURL){
      const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(storageRef, newPhotoURL, 'data_url');
      console.log(response)
      photoURL = await getDownloadURL(ref(storage, response.ref))
    }

    if(userObj.displayName != newDisplayName){
      await updateProfile(userObj, {displayName: newDisplayName,photoURL: newPhotoURL});
    }
  }

  
  const onClearAttachment = () => setNewPhotoURL("")

  useEffect(() => {
     getMyTweets();
  },[]);
  
  return (
    <>
    <form onSubmit={onSubmit}>
      <input type="text" placeholder='Display name' onChange={onChange} value={newDisplayName}/>
      <input type="submit" value="Update Profile" />
      <input type="file" accept='image/*' onChange={onFileChange}/>
      {newPhotoURL && (
      <div>
        <img src={newPhotoURL} width='50' height='50' />
        <button onClick={onClearAttachment}>Clear</button>
      </div>
      )}
    </form>
    <button onClick={onLogOutClick}>Log Out</button>
    <div>
    {tweets.map(tweet => (
      <Tweet 
      key={tweet.id}
      tweetObj={tweet}
      isOwner={tweet.createId === userObj.uid}
      />
    ))}
    </div>
    </>
  )
}

export default Profiles
