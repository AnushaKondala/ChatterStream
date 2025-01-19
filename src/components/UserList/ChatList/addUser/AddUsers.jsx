import "./addUser.css"
import { db } from "../../../../lib/firebase";
import {arrayUnion, collection,doc,getDocs,query,serverTimestamp,setDoc,updateDoc,where } from "firebase/firestore";
import { useState } from "react";
import { useStore } from "../../../../lib/userStore";
export default function AddUsers() {
  const [user, setUser]=useState(null);
  const {currentUser}=useStore();
  const handleSearch=async(e)=>{
    
    e.preventDefault();
    //console.log("HI");
    const formData=new FormData(e.target);
    const username=formData.get("username");
    //console.log(username);
    try{
      const userRef=collection(db,"users");
      const q=query(userRef,where("username","==",username));
      const querySnapShot= await getDocs(q);
      if(!querySnapShot.empty){
      //console.log("hllo wlcm", querySnapShot.docs[0]);
        setUser(querySnapShot.docs[0].data());
      }
    }
    catch(err){
      console.log(err);
    }
  }
  const handleAddUser=async()=>{
   
    const chatRef=collection(db,"chats");
    const userChatsRef=collection(db,"userchats");
    try{
      const newChatRef=doc(chatRef);
      console.log("welcm")
      await setDoc(newChatRef,{
        createdAt:serverTimestamp(),
        messages:[],
      });
      await updateDoc(doc(userChatsRef,user.id),{
        chats:arrayUnion({
          chatId:newChatRef.id,
          lastMessage:"",
          receiverId:currentUser.id,
          updatedAt:Date.now(),//serverTimestamp will not work with arrayUnion together

        })
      })
      await updateDoc(doc(userChatsRef,currentUser.id),{
        chats:arrayUnion({
          chatId:newChatRef.id,
          lastMessage:"",
          receiverId:user.id,
          updatedAt:Date.now(),//serverTimestamp will not work with arrayUnion together

        })
      })
      console.log("this is me")
      console.log(newChatRef.id);
      
    }
    catch(err){
      console.log(err);
    }

  }
  return (
    <div className='addUser'>
        <form action="" onSubmit={handleSearch}>
            <input type="text" name="username" id="" placeholder='Search for User name' />
            <button>Search</button>
        </form>
        {user &&  <div className="user">
         <div className="detail">
            <img src={user.profilePic} alt="" />
            <span>{user.username}</span>
         </div>
         <button onClick={handleAddUser}>Add User</button>
        </div>}
    </div>
  )
}

