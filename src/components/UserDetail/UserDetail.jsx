import "./UserDetail.css"
import { auth, db } from "../../lib/firebase"
import { chatStore } from "../../lib/chatStore"
import { useStore } from "../../lib/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
export default function UserDetail() {
  const { user, isCurrentUserBlocked, isReceiverBlocked, changeBlock}=chatStore();
  const {currentUser}=useStore();
  const handleBlock=async()=>{
    if(!user) return;
    const userDocRef=doc(db,"users",currentUser.id);
    try{
      await updateDoc(userDocRef,{
        blocked: isReceiverBlocked? arrayRemove(user.id) : arrayUnion(user.id),
      })
      changeBlock();
    }
    catch(err){
      console.log(err);
    }
  }
  return (
    <div className="detail">
      <div className="user">
        <img src={user?.profilePic || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"} alt="" width={20} height={20} />
        <h2>{user?.username || "USER"}</h2>
       
      </div>
      <div className="info">
        {/* <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            
            <i className="fa-solid fa-angle-up" style={{ color: "#ffffff;" }}></i>
          </div>
        </div> */}
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <i className="fa-solid fa-angle-down" style={{ color: "#edeff2;" }}></i>
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://plus.unsplash.com/premium_photo-1667126445804-79202e10a28a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJhbCUyMHNjZW5lcnl8ZW58MHx8MHx8fDA%3D" alt="" />
                <span>photo_2024</span>
                <i className="fa-solid fa-download downloadIcon" style={{ color: "#f4f6fb;" }}></i>
              </div>
              <div className="photoDetail">
                <img src="https://plus.unsplash.com/premium_photo-1667126445804-79202e10a28a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJhbCUyMHNjZW5lcnl8ZW58MHx8MHx8fDA%3D" alt="" />
                <span>photo_2024</span>
                <i className="fa-solid fa-download downloadIcon" style={{ color: "#f4f6fb;" }}></i>
              </div>
              <div className="photoDetail">
                <img src="https://plus.unsplash.com/premium_photo-1667126445804-79202e10a28a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJhbCUyMHNjZW5lcnl8ZW58MHx8MHx8fDA%3D" alt="" />
                <span>photo_2024</span>
                <i className="fa-solid fa-download downloadIcon" style={{ color: "#f4f6fb;" }}></i>
              </div>
            </div>

          </div>

        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <i className="fa-solid fa-angle-up" style={{ color: "#ffffff;" }}></i>
          </div>
        </div>
        <button onClick={handleBlock}>
          {isCurrentUserBlocked?"You are blocked":isReceiverBlocked?"User Blocked": "Block User"}
        </button>
        <button className="logout" onClick={()=> auth.signOut()}>Logout</button>
      </div>
    </div>
  )
}
