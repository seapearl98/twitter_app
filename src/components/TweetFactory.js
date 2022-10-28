import React, { useEffect, useState } from 'react';
import {db, storage} from "fbase";
import { collection, addDoc, query, getDoc, onSnapshot, orderBy, } from "firebase/firestore";
import Tweet from 'components/Tweet';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "styles/tweetFactory.scss"

function TweetFactory({userObj}) {

const [tweet, setTweet] = useState(""); 
const [newPhoto, setNewPhoto] = useState("");

const onChange = e => {
    //console.log(e.target.value);
    const {target: {value}} = e;
    setTweet(value);
  }
  const onSubmit = async(e) => {
    e.preventDefault();
    let photoURL = "";
    if(newPhoto !== ""){
      const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(storageRef, newPhoto, 'data_url');
      console.log(response)
      photoURL = await getDownloadURL(ref(storage, response.ref))
    }

await addDoc(collection(db, "tweets"), {//트윗이라는 문서를 폴더에 추가하겠다
    text: tweet,
    createAt: Date.now(),
    createId: userObj.uid,
    photoURL //키와 밸류값이 같으면 하나만 써줘도 됨.
  });
  setTweet("");
  setNewPhoto("")
}

const onFileChange = e => {
    //console.log(e.target.files)
    const {target: {files}} = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      console.log(finishedEvent);
      const {currentTarget: {result}} = finishedEvent;
      setNewPhoto(result);
    }
    reader.readAsDataURL(theFile)
  }
  const onClearnewPhoto = () => setNewPhoto("")

  return (
    <form onSubmit={onSubmit} className="factoryForm">
    <div className='factoryInput__container'>
        <input type="text" placeholder="What's on your mind" value={tweet} onChange={onChange} maxLength={120}
        className="factoryInput__input"/>
        <input type="submit" value="&rarr;" 
        className='factoryInput__arrow'/>
    </div>
    <label htmlFor="attach-file" className='factoryInput__label'>
      <span>Add photos</span>
      <FontAwesomeIcon icon="fa-solid fa-plus" />
    </label>
    <input type="file" accept='image/*' onChange={onFileChange}
      id="attach-file" style={{opacity:0}}/>
        {/* accept='image/*' :image만 올릴수있게 해주는거
            multiple : 이미지 여러장 올리기 가능
        */}
    {newPhoto && (
    <div className='factoryForm__attachment'>
      <img src={newPhoto} style={{backgroundImage:newPhoto,}}/>
      <div className='factoryForm__clear' onClick={onClearnewPhoto}>
        <span>Remove</span>
        <FontAwesomeIcon icon="fa-solid fa-xmark" />
      </div>
    </div>
    )}
  </form>
  )
}

export default TweetFactory
