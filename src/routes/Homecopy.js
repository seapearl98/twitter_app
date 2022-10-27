import React, { useEffect, useState } from 'react';
import {db, storage} from "fbase";
import { collection, addDoc, query, getDoc, onSnapshot, } from "firebase/firestore";
import Tweet from 'components/Tweet';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadString } from "firebase/storage";

function Homecopy({userObj}) {
  console.log(userObj)
  const [tweet, setTweet] = useState(""); 
  const [tweets, setTweets] = useState([]); 
  const [newphotoURL, setNewPhotoURL] = useState("");

  // const  getTweets = async() => {
  //   const q = query(collection(db, "tweets"));
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     // console.log(doc.id, " => ", doc.data());
  //     // querySnapshot : firebase에서 컬렉션을 마치 사진찍듯이 찍어서 보여준다.
  //     // setTweets(prev => [doc.data(), ...prev])
  //     const tweetObject = {...doc.data(), id:doc.id} //id추가
  //     setTweets(prev => [tweetObject, ...prev]);
  //   });
  // }

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

  // console.log(tweets)

  const onChange = e => {
    //console.log(e.target.value);
    const {target: {value}} = e;
    setTweet(value);
  }
  const onSubmit = async(e) => {
    e.preventDefault();
    let newphotoURLUrl ="";
    if(newphotoURLUrl !== ""){
      const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`); //로그인한사용자정보(폴더이름을얘로정함)/고유식별자생성기(파일이름을 얘로정함) -> 파일경로가 된다. ref는 경로가 되어주는 파이프역할하는 함수(경로시스템) 
    // const message4 = 'data:text/plain;base64,5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB'; //newphotoURL랑 똑같으므로 필요없음.
    const response = await uploadString(storageRef, newphotoURL, 'data_url');
    // console.log(response)

    //---------------------------------업로드
    newphotoURLUrl = await getDownloadURL(ref(storage, response.ref))

    }
    
    await addDoc(collection(db, "tweets"), {//트윗이라는 문서를 폴더에 추가하겠다
      text: tweet,
      createAt: Date.now(),
      createId: userObj.uid,
      newphotoURLUrl //키와 밸류값이 같으면 하나만 써줘도 됨.
    });
    setTweet("");
    setNewPhotoURL("")
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
      <input type="text" placeholder="What's on your mind" value={tweet} onChange={onChange} maxLength={120}/>
      <input type="file" accept='image/*' onChange={onFileChange}/>
      {/* accept='image/*' :image만 올릴수있게 해주는거
          multiple : 이미지 여러장 올리기 가능
      */}
      <input type="submit" value="Tweet" />
      {newphotoURL && (
      <div>
        <img src={newphotoURL} width='50' height='50' />
        <button onClick={onClearnewphotoURL}>Clear</button>
      </div>
      )}
    </form>
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

export default Homecopy
