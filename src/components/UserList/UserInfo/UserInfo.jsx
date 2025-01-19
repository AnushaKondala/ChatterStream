import "./UserInfo.css"
import { useStore } from "../../../lib/userStore";
export default function UserInfo() {
  const {currentUser}=useStore();
  return (
    <div className='userInfo'>
      <div className="user">
        <img src={currentUser.profilePic} alt="" width={50} height={50}/>
        <h3>{currentUser.username}</h3>
      </div>
    
      <div className="icons">
        <i className="icon-item fa-solid fa-ellipsis" style={{color: "#f2f2f2"}}></i>
        <i className="icon-item fa-solid fa-video" style={{color: "#f4f6fb"}}></i>
        <i className="icon-item fa-regular fa-pen-to-square" style={{color:"#f7f7f7"}}></i>
      </div>
     
    </div>
  )
}
