import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { AiOutlineSend } from "react-icons/ai";

import send from "../assets/send.mp3";
import alert from "../assets/alert.mp3";
import SendImage from "./SendImage";

const SendMessage = ({ scroll }) => {
  const [message, setMessage] = useState("");
  const [emptyMessage, setEmptyMessage] = useState(false);

  useEffect(() => {
    playSound();
  }, [emptyMessage]);

  const playSound = () => {
    if (emptyMessage) {
      new Audio(alert).play();
      setEmptyMessage(false);
    } else {
      new Audio(send).play();
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === "") {
      setEmptyMessage(true);
      toast.error("Please enter a valid message", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }
    const { uid, displayName, photoURL } = auth.currentUser;
    await addDoc(collection(db, "message"), {
      text: message,
      name: displayName,
      avatar: photoURL,
      createdAt: serverTimestamp(),
      uid,
    });
    setMessage("");
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <form
      className="max-w-[728px] w-full flex text-xl fixed bottom-0 "
      onSubmit={(e) => {
        sendMessage(e);
      }}
    >
      <label htmlFor="messageInput" hidden>
        Enter Message
      </label>

      {/* Text Input */}
      <input
        type="text"
        id="messageInput"
        className="input bg-slate-700 w-full text-white focus:outline-none border-none text-xl rounded-none "
        name="messageInput"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="type message..."
      />
      {/* Upload Image Button */}

      <SendImage/>
      

      {/* Send Button */}
      <button
        onClick={playSound}
        type="submit"
        className="btn border-none bg-slate-600 gap-2 w-[25%] h-full rounded-none hover:scale-105"
      >
        <span className="flex text-md justify-between items-center gap-3 ">
          Send
          <AiOutlineSend size={20} />
        </span>
      </button>
    </form>
  );
};
export default SendMessage;
