import { useEffect } from 'react';
import Chat from './components/Chat/Chat'
import Login from './components/Login/Login';
import Toasts from './components/Toasts/Toasts';
import UserDetail from './components/UserDetail/UserDetail'
import UserList from './components/UserList/UserList'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import {useStore} from "./lib/userStore"
import { chatStore } from './lib/chatStore';

function App() {
  const {currentUser, isLoading, fetchUserInfo}=useStore();
  const {chatId}=chatStore();
  useEffect(()=>{
    const unSub=onAuthStateChanged(auth,(user)=>{
      // This 'user' parameter is automatically provided by Firebase
      // whenever the auth state changes.
      // Fetch user information based on the UID from Firebase
      //whenever state changes fetch user 
      fetchUserInfo(user?.uid);
    });
    return ()=>{
      // Cleanup: Unsubscribe from the listener when the component unmounts
      unSub();
    }
  },[fetchUserInfo]);
  console.log("welcome home",currentUser);

  // if loading is true show loading
  if(isLoading) return <div className='loading'>Loading...</div>

  return (
    <div className='container'>
      {currentUser? 
      (
        <>
          <UserList/>
          {chatId && <Chat/> }
          {chatId && <UserDetail/>}
        </>

      ): <Login/>}
      <Toasts/>
    </div>
  )
}

export default App
