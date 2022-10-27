import React, { useEffect, useState } from 'react';
import {db, storage} from "fbase";
import { collection, addDoc, query, getDoc, onSnapshot, orderBy, } from "firebase/firestore";
import Tweet from 'components/Tweet';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadString } from "firebase/storage";

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
    <form onSubmit={onSubmit}>
    <input type="text" placeholder="What's on your mind" value={tweet} onChange={onChange} maxLength={120}/>
    <input type="file" accept='image/*' onChange={onFileChange}/>
    {/* accept='image/*' :image만 올릴수있게 해주는거
        multiple : 이미지 여러장 올리기 가능
    */}
    <input type="submit" value="Tweet" />
    {newPhoto && (
    <div>
      <img src={newPhoto} width='50' height='50' />
      <button onClick={onClearnewPhoto}>Clear</button>
    </div>
    )}
  </form>
  )
}

export default TweetFactory
