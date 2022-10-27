import { authService, db, storage } from 'fbase';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, query, onSnapshot, where, orderBy, getDocs } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export default function Profile({userObj}) {
    const navigate = useNavigate();
    const [tweets, setTweets] = useState([]); 
    const [newDisplayName, setNewDisplayName] = useState("")
    const [tweet, setTweet] = useState(""); 
    const [newphotoURL, setNewPhotoURL] = useState("")

    const onLogOutClick = () => {
        authService.signOut();
        navigate('/'); //홈으로 이동. 리다이렉트 기능.
    }

    const getMyTweets = async () =>{
    const q = query(collection(db, "tweets"),
                    where("createId","==", userObj.uid), //글쓴유저와 같은 아이디가 쓴 트윗만 가져와
                    orderBy("createAt","asc")); //가져올때 오름차순으로 가져와라
    const querySnapshot = await getDocs(q);
    const newArray = [];
    querySnapshot.forEach((doc) => {
      newArray.push({...doc.data(), id:doc.id});
    });
    setTweets(newArray);
    }

    useEffect(()=>{ //실시간 데이터베이스 문서들 가져오기
      // getTweets();
      const q = query(collection(db, "tweets" ));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const newArray = [];
        querySnapshot.forEach((doc) => {
          newArray.push({...doc.data(), id:doc.id});
        })
        console.log(newArray)
        setTweets(newArray)
      })
    },[]);

    useEffect(() => {
      //getMyTweets();
      const q = query(collection(db, "tweets"),
      where("createId", "==", userObj.uid),
      orderBy("createAt", "desc"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const newArray = [];
        querySnapshot.forEach((doc) => {
          newArray.push({…doc.data(), id:doc.id});
        });
        setTweets(newArray);
      });
    },[]);
    
    const onChange = (e) => {
      const {target: {value}} = e;;
      setNewDisplayName(value)
    }
    
    const onSubmit = async (e) => {
      e.preventDefault();
      if(userObj.displayName !== newDisplayName){ //유저의 dp네임이 newDisplayName과 같지 않을경우에만 작동
        await updateProfile(userObj, {
        displayName: newDisplayName});
      }
      let photoURL = "";
      if(userObj.photoURL !== newphotoURL){
        const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`); //로그인한사용자정보(폴더이름을얘로정함)/고유식별자생성기(파일이름을 얘로정함) -> 파일경로가 된다. ref는 경로가 되어주는 파이프역할하는 함수(경로시스템) 
      const response = await uploadString(storageRef, newphotoURL, 'data_url');
      // console.log(response)
      photoURL = await getDownloadURL(ref(storage, response.ref))
      await updateProfile(userObj, {photoURL});
    }

  
      //---------------------------------업로드
      newphotoURL = await getDownloadURL(ref(storage, response.ref))
  
      }
    }
    
    const onFileChange = e => {
        //console.log(e.target.files)
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
      const onClearnewphotoURL = () => setNewPhotoURL("")

  return (
    <>
    <form onSubmit={onSubmit}>
      <input type="text" placeholder='Display name' onChange={onChange} value={newDisplayName}/>
      <input type="submit" value="Update Profile"/>
      <input type="file" accept='image/*' onChange={onFileChange}/>
      {newphotoURL && (
      <div>
        <img src={newphotoURL} width='50' height='50' />
        <button onClick={onClearnewphotoURL}>Clear</button>
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
          newphotoURL
        />
      ))}
    </div>
    </>
  )
}