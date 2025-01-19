import { useState,useEffect } from "react";
import "./ChatList.css"
import AddUsers from './addUser/AddUsers';
import { useStore } from '../../../lib/userStore';
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from '../../../lib/firebase';
import { chatStore } from "../../../lib/chatStore";

export default function ChatList() {
    const [addMode, setAddMode] = useState(false);
    const [chats,setChats]=useState([]);
    const handleClick = () => {
        setAddMode(prev => !prev)
    }
    const {currentUser}=useStore();
    const {changeChat}=chatStore();
    const [inputValue,setInputValue]=useState("");
    
    useEffect(()=>{
      const unsub =  onSnapshot(doc(db, "userchats", currentUser.id), async(res) => {
        const items=res.data().chats;
        const promises=items.map(async(item)=>{
            const userDocRef=doc(db,"users",item.receiverId);
            const userDocSnap=await getDoc(userDocRef);
            const user=userDocSnap.data();
            return {...item, user};
        })
        const chatData=await Promise.all(promises);
        setChats(chatData.sort((a,b)=> b.updatedAt-a.updatedAt));
        });
        

      //cleanup functionality
      return ()=>{
        unsub();
      }
    },[currentUser.id]);
    //  console.log(chats);
    const handleSelect= async(chat)=>{
        console.log("hello")
        const userChats=chats.map((item)=>{
            const {user,...rest}=item;
            return rest;
        })
        const chatIndex=userChats.findIndex(item => item.chatId === chat.chatId)
        userChats[chatIndex].isSeen=true;
        const userChatRef=doc(db,"userchats",currentUser.id);
        try{
            await updateDoc(userChatRef,{
                chats:userChats
            })
        }
        catch(err){
            console.log(err);
        }
        changeChat(chat.chatId, chat.user);

    }
    const filteredChats= chats.filter(c => c.user.username.toLowerCase().includes( inputValue.toLowerCase()));
    
    // The reason a user is still being displayed even when you haven't 
    // entered anything in the input value is due to how the filter function works in JavaScript
    // Initial State of inputValue: When the component first renders, the inputValue state is an empty string (""), 
    // because that's how it's initialized in your useState call.
    // Filtering Logic: The filter function checks if each user's username includes the inputValue. In JavaScript, 
    // when you call includes on a string with an empty string ("") as the argument, it always returns true. 
    // This is because an empty string is technically "included" in every string (it's present at every position in the string).

    return (
        <div className='chatList'>
            <div className="search">
                <div className="searchBar">
                    <i className="fa-solid fa-magnifying-glass" style={{ color: "#eff1f5" }}></i>
                    <input type="search" name="" id="" placeholder='Search' value={inputValue} onChange={(e)=> setInputValue(e.target.value)}/>
                </div>
                {addMode ?
                    <i className="add fa-solid fa-minus" onClick={handleClick}></i>
                    :
                    <i className="add fa-solid fa-plus" onClick={handleClick}></i>
                }

            </div>
            {filteredChats.map((chat)=>(
                
                <div className="item" key={chat.chatId} onClick={()=>handleSelect(chat)}
                style={{backgroundColor : chat.isSeen? "transparent":"#5183fe"}}>
                   
                    <img src={chat.user.blocked.includes(currentUser.id) ? "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" : chat.user.profilePic} alt="" width={50} height={50} />
                    <div className="texts"   >
                        <span>{chat.user.blocked.includes(currentUser.id) ? "USER": chat.user.username}</span>
                        <p>{chat.lastMessage}</p>
                    </div>
                </div>
           
            ))}
            {addMode && <AddUsers/>}
        </div>
    )
}
