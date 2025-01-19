
import { useState, useEffect, useRef } from 'react';
import './Chat.css'
import EmojiPicker from "emoji-picker-react"
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { chatStore } from '../../lib/chatStore';
import { useStore } from '../../lib/userStore';
import upload from '../../lib/upload';
export default function Chat() {
  const [inputValue, setInputValue] = useState('');
  const [emojiClicked, setEmojiClicked] = useState(false);
  const endRef = useRef(null);
  const [chat, setChat] = useState();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = chatStore();
  const { currentUser } = useStore();
  const [img, setImg] = useState({
    file: null,
    url: ""
  })
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const emojiClickHandler = () => {
    setEmojiClicked(prev => !prev);
  }
  const handleEmoji = (e) => {
    setInputValue(prev => prev + e.emoji);

  }
  useEffect(() => {

    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });
    return () => {
      unSub();
    };
  }, [chatId]);

  const handleSend = async () => {
    console.log(inputValue)
    let imgURL = null;
    try {
      console.log(img.file);
      if (img.file) {
        imgURL = await upload(img.file);
      }
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text: inputValue,
          createdAt: new Date(),
          ...(imgURL && { img: imgURL }),
        })
      });
      const userIDs = [currentUser.id, user.id];
      userIDs.forEach(async (id) => {

        const userChatsRef = doc(db, "userchats", id);

        const userChatsSnapshot = await getDoc(userChatsRef);
        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId);
          console.log("id", chatIndex)
          if (inputValue == "" && imgURL) {
            if (inputValue === "" && imgURL) {
              userChatsData.chats[chatIndex].lastMessage = "📷 Photo";
            }

          }
          else {
            userChatsData.chats[chatIndex].lastMessage = inputValue;
          }
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          })
        }
      })

    }
    catch (err) {
      console.log(err);
    }
    setImg({
      file: null,
      url: ""
    });
    setInputValue("");
  }
  // console.log("these r msgs",chat.messages);
  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({

        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      })

    }
  }
  
  return (
    <div className='chat'>
      <div className="top">
        <div className="user">
          <img src={user?.profilePic || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"} alt="" width={50} height={50} />
          <div className="texts">
            <span>{user?.username || "USER"}</span>
          </div>
        </div>
        <div className="icons">
          <i className="fa-solid fa-phone" style={{ color: "#f0f2f4" }}></i>
          <i className="fa-solid fa-video" style={{ color: "#f1f4f9" }}></i>
          <i className="fa-solid fa-ellipsis-vertical" style={{ color: "#f9fafb" }}></i>
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((msg) => (
          <div className={msg.senderId === currentUser?.id ? "message own" : "message"} key={msg?.createdAt}>
            <div className="texts">
              {msg.img && <img src={msg.img} alt="" />}
              {msg.text && <p>{msg.text}</p>}

            </div>

          </div>)
        )}
        {/*  a box that displays on selecting image box should contain img with send btn */}
        {img.file && (
          <div className="image-preview">
            <button onClick={() => setImg({ file: null, url: "" })} className="remove-image">
              <i className="fa-solid fa-xmark" style={{ color: "#e3e7ed" }}></i>

            </button>
            <img src={img.url} alt="Selected" style={{ maxWidth: '100%', maxHeight: '150px' }} />
            <button className='sendImg' onClick={handleSend}>Send</button>

          </div>
        )}

        <div ref={endRef}></div>
      </div>

      <div className="bottom">
        <div className="icons">
          <div className="emoji">
            <i className="fa-regular fa-face-laugh-beam" style={{ color: " #ffffff;" }} onClick={emojiClickHandler}></i>
            <div className="emojiPicker">
              {!isCurrentUserBlocked && !isReceiverBlocked && emojiClicked && (
                <EmojiPicker onEmojiClick={handleEmoji} />
              )}


            </div>

          </div>
          <i className="fa-solid fa-camera" style={{ color: "#edeff2;" }}></i>
          <label htmlFor="file">
            <i className="fa-regular fa-image" style={{ color: "#f7f9fd;" }}></i>
          </label>
          <input type="file" name="" id="file" style={{ display: "none" }} onChange={handleImg} disabled={isCurrentUserBlocked || isReceiverBlocked} />

        </div>
        <input type="text" name="" id="" placeholder={isCurrentUserBlocked || isReceiverBlocked? 'You cannot send a message': 'Type a message'} value={inputValue}
          onChange={handleInputChange} disabled={isCurrentUserBlocked || isReceiverBlocked} />
        {inputValue ?

          <button className='sendBtn' onClick={handleSend} >
            <i className="fa-regular fa-paper-plane" style={{ color: "#f7f9fd;" }}></i>
          </button>
          :
          (isCurrentUserBlocked || isReceiverBlocked ?
            (<i className="fa-solid fa-microphone-slash" style={{ color: "#eceff3;" }}></i>)
            : (<i className="fa-solid fa-microphone" style={{ color: "#f2f4f8;" }} ></i>)
          )


        }
      </div>
    </div>

  )
}

