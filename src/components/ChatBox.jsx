import React, { useEffect, useRef, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import Message from "./Message";
import { db, auth } from "../firebase";
import SendMessage from "./SendMessage";
import { useAuthState } from "react-firebase-hooks/auth";

const ChatBox = () => {
  const scroll = useRef();
  const [messages, setMessages] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const q = query(collection(db, "message"), orderBy("createdAt"), limit());
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let messages = [];
      QuerySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });
    return () => unsubscribe;
  }, []);

  const style = {
    main: `flex flex-col bg-base-100 overflow-scroll  h-[195%]   `,
  };

  return (
    <>
      {user && (
        <main className={`${style.main} chatbox`}>
          <div className="messages-wrapper">
            {messages?.map((message) => (
              <Message
                key={message.id}
                message={message}
                username={user.displayName}
                time={
                  message.createdAt
                    ? message.createdAt.toDate().toString().slice(15, 21)
                    : ""
                }
              />
            ))}
          </div>
          <SendMessage scroll={scroll} />
          <span ref={scroll}></span>
        </main>
      )}
    </>
  );
};
export default ChatBox;
