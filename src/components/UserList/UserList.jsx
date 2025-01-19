import ChatList from "./ChatList/ChatList"
import UserInfo from "./UserInfo/UserInfo"
import "./UserList.css"

export default function UserList() {
  return (
    <div className="list">
      <UserInfo/>
      <ChatList/>
    </div>
  )
}
