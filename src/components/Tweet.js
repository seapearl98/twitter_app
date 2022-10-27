import React, { useEffect, useState } from 'react'
import {db, storage} from '../fbase'
import { doc, deleteDoc,updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";


function Tweet({tweetObj,isOwner,newPhoto}) {

  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text); 
  const [nowDate, setNoeDate] = useState(tweetObj.createAt);

  const onDeleteClick = async() => {
    const ok = window.confirm('삭제하시겠습니까?');
    //confirm : 삭제 메세지 보여주기
    if(ok){
    //console.log(tweetObj.id);
    //const data = await db.doc(`tweets/${tweetObj.id}`)
    const data = await deleteDoc(doc(db, "tweets", `/${tweetObj.id}`));
    //console.log(data);
    }
    if(tweetObj.photoURL !== ""){
      const desertRef = ref(storage, newPhoto);
      await deleteObject(desertRef);
    }
  }

  const toggleEditng = () => {
    setEditing((prev) => !prev);
  }

  const onNewTweet = e => {
    const {target: {value}} = e;
    setNewTweet(value);
  }

  const onSubmit = async(e) => {
    e.preventDefault();
   //console.log(tweetObj.id, newTweet)
    const newTweetRef = doc(db, "tweets", `/${tweetObj.id}`);
    await updateDoc(newTweetRef, {
        text: newTweet,
        createAt: Date.now()
    });
    setEditing(false);
  }
  useEffect(()=>{
    let timeStamp = tweetObj.createAt;
    const now = new Date(timeStamp);
    setNoeDate(now.toUTCString())
  },[])

  return (
    <div>
        {editing ? (//수정화면
          <>
          <form onSubmit={onSubmit}>
            <input onChange={onNewTweet} value={newTweet} required />
            <input type="submit" value="update Tweet"/>
          </form>
          <button onClick={toggleEditng}>Cancle</button>
          </>
        ) : ( //기본화면
          <>
            <h4>{tweetObj.text}</h4>
            {tweetObj.photoURL && (
              <img src={tweetObj.photoURL} width="50" height="50"/>
            )}
            <span>{nowDate}</span>
            {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Tweet</button>
              <button onClick={toggleEditng}>Edit Tweet</button>
            </>   
            )} 
          </>
        )}
    </div>
  )
}

export default Tweet
