import "./Login.css"
import { useState } from "react"
import {  toast } from 'react-toastify';
import { createUserWithEmailAndPassword , signInWithEmailAndPassword } from 'firebase/auth';
import { auth,db } from '../../lib/firebase';
import { doc, setDoc } from "firebase/firestore"; 
import upload from "../../lib/upload";
export default function Login() {
    const [profilePic, setProfilePic]=useState({
        file:null,
        url:""
    })
    const [loading,setLoading]=useState(false);
    const handleProfilePic=(e)=>{
        if(e.target.files[0]){
        setProfilePic({
           
                file:e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            }
        )}
    }
    const handleLoginSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true);
        try{
          const formData=new FormData(e.target);
          const {email, password}=Object.fromEntries(formData);
          await signInWithEmailAndPassword(auth,email,password);
          toast.success("Successfully LoggedIn");          
        }
        catch(error){
          toast.error(error.message);
        }finally{
          setLoading(false);
        }
        
    }
    const handleSignUp= async(e)=>{
      e.preventDefault();
      setLoading(true);
      const formData=new FormData(e.target);
      const {username, email, password}=Object.fromEntries(formData);
      console.log(username, email, password);
      try{
        const res=await createUserWithEmailAndPassword(auth,email, password);
        //on creating user, automatically user and userchats gets created
        const imgURL=await upload(profilePic.file)
        await setDoc(doc(db, "users", res.user.uid), {
          username,
          email,
          profilePic:imgURL,
          id:res.user.uid,
          blocked:[]
        });
       
        await setDoc(doc(db, "userchats", res.user.uid), {
          chats:[]
        });
        toast.success("Account created successfully!!")
      }
      catch(error){
        console.log(error);
        toast.error(error.message);
      }
      finally{
        setLoading(false);
      }
    }
  return (
    <div className="loginContainer">
      <div className="item">
        <h2>Login</h2>
        <form onSubmit={handleLoginSubmit}>
            <input type="email" name="email" id="" placeholder="Email"/>
            <input type="password" name="password" id="" placeholder="password"/>
            <button disabled={loading}>{loading?"Loading":"Login"}</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
      <h2>Create an Account</h2>
        <form action="" onSubmit={handleSignUp}>
           
            <label htmlFor="file"> <img src={profilePic.url || ""}alt="" /> Upload an image</label>
             
            <input type="file" name="" id="file" style={{display:"none"}} onChange={handleProfilePic}/>
            <input type="text" name="username" id="" placeholder="Enter name" />
            <input type="email" name="email" id="" placeholder="Email"/>
            <input type="password" name="password" id="" placeholder="password"/>
           
            <button disabled={loading}>{loading?"Loading":"Sign Up"}</button>
        </form>
      </div>
    </div>
  )
}
