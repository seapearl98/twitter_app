import React, { useEffect, useState } from 'react'
import {db, storage} from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

export default function Tweet({tweetObj,isOwner}) {

  const [editing, setEditing] = useState(false)
  const [newTweet, setNewTweet] = useState(tweetObj.text) //트윗오브젝트에 트윗이 저장되어있음
  const [nowDate, setNowDate] = useState(tweetObj.createAt)

  const onDeleteClick = async () => {
    const ok = window.confirm("삭제하시겠습니까?");
    if(ok){
    // const data = await db.doc(`tweets/${tweetObj.id}`)
    const data = await deleteDoc(doc(db, "tweets", `/${tweetObj.id}`));
    // console.log(data)
    if(tweetObj.attachmentUrl !== ""){
      const desertRef = ref(storage, tweetObj.attachmentUrl);
      deleteObject(desertRef)
      }
    }
  }

  const onNewTweet = e => {
    const {target: {value}} = e;
    setNewTweet(value)
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

  useEffect (()=>{
    let timestamp = tweetObj.createAt;
    const now = new Date(timestamp); //한번만 실행할려고 함수로 만듬
    setNowDate(now.toUTCString());
  })

  const toggleEditing = () => {
    setEditing((prev) => !prev) //기존의 false를 true로 바꿔줌
  }

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            
            <input onChange={onNewTweet} value={newTweet} required/>
            <input type="submit" value="update Tweet"/>
          </form>
          <button onClick={toggleEditing}>Cancle</button>
        </>
      ) : (
        <>
          <h4>{tweetObj.text}</h4>
          {nowDate}
          {tweetObj.attachmentUrl && ( //attachmentUrl이 있는경우에만 사진떠라
            <img src={tweetObj.attachmentUrl} width='50' height='50' />
          )}
          {isOwner && ( 
              <>
                  <button onClick={onDeleteClick}>Delete Tweet</button>
                  <button onClick={toggleEditing}>Edit Tweet</button>
              </>
          )}
        </>
      )}
    </div>
  )
}
