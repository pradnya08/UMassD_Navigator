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
  main: `pb-32 pt-5 space-y-5 w-[75%] mx-auto relative`,
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
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

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView(), [messages]);
    return <div ref={elementRef} />;
  };

  return (
    <div className=" bg-neutral-800">
      <div className={style.main}>
        {messages &&
          messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
      </div>
      <div
        className={
          enableChat
            ? "hidden"
            : "" +
              "flex w-full self-center place-content-center place-items-center"
        }
      >
        <button
          className="bg-[#00df9a] w-[200px] rounded-md font-medium my-10 mx-auto py-3 text-black"
          onClick={start_conversation}
        >
          Start Conversation
        </button>
      </div>
      {/* Send Message Compoenent */}
      <AlwaysScrollToBottom />
      <div className={enableChat ? "" : "hidden"}>
        <SendMessage convId={convId} />
      </div>
    </div>
  );
};

export default Chat;
