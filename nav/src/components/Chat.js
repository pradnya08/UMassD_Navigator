import React, { useState, useEffect, useRef } from "react";
import Message from "./Message";
import SendMessage from "./SendMessage";
import { db } from "../firebase/firebase";
import {
  doc,
  query,
  collection,
  orderBy,
  onSnapshot,
  getDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useAuth } from "../contexts/authContext";

const style = {
  main: `flex flex-col p-[10px]`,
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const scroll = useRef();
  const [enableChat, setEnableChat] = useState(false);
  const { currentUser } = useAuth();
  const [convId, setConvId] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      where("uid", "==", currentUser.uid),
      where("convId", "==", convId),
      orderBy("timestamp")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });
    return () => unsubscribe();
  }, [convId]);

  const start_conversation = () => {
    const userRef = doc(db, "users", currentUser.uid);
    const current_conversation_id = getDoc(userRef).then((doc) => {
      const data = doc.data();
      return data["latest_conversation_id"] + 1;
    });
    current_conversation_id.then((id) => {
      setConvId(id);
      updateDoc(userRef, { latest_conversation_id: id });
    });
    setEnableChat(!enableChat);
  };

  return (
    <>
      <main className={style.main}>
        {messages &&
          messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
      </main>
      <div
        className={
          enableChat
            ? "hidden"
            : "" +
              "w-full h-screen mt-[-96px] mx-auto flex-col flex self-center place-content-center place-items-center"
        }
      >
        <button
          className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black"
          onClick={start_conversation}
        >
          Start Conversation
        </button>
      </div>
      {/* Send Message Compoenent */}
      <div className={enableChat ? "" : "hidden"}>
        <SendMessage scroll={scroll} convId={convId} />
        <span ref={scroll}></span>
      </div>
    </>
  );
};

export default Chat;
