import React from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
const Message = ({ message, time, username }) => {
  const [user] = useAuthState(auth);

  const justifyMessages =
    message.uid === auth.currentUser.uid ? "chat chat-end " : "chat chat-start";

  const showImage =
    message.uid === auth.currentUser.uid ? "hidden" : "chat-image avatar";

  const showName =
    message.uid === auth.currentUser.uid ? "hidden" : `chat-header`;

  return (
    <div className={`${justifyMessages} p-2 `}>
      <div className={showImage}>
        <div className="w-10 rounded-full">
          <img
            src={
              message.avatar
                ? message.avatar
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
            }
            className={`${showImage}`}
            alt="user avatar"
          />
        </div>
      </div>
      <div className="chat-header">
        <span className={message.uid === auth.currentUser.uid ? "hidden" : ""}>
          {message.name ? message.name : username}
        </span>
        <time className="text-xs opacity-50">{time}</time>
      </div>
      <div className="chat-bubble">{message.text}</div>
      <div className="chat-footer opacity-50">Delivered</div>

    </div>
  );
};
export default Message;
