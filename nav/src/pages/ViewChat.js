import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Message from "../components/Message";
import { db } from "../firebase/firebase";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";
import { useAuth } from "../contexts/authContext";

const style = {
  main: `pb-32 pt-5 space-y-5 w-[75%] mx-auto relative`,
};

const ViewChat = () => {
  const [messages, setMessages] = useState([]);
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const cid = searchParams.get("convId");
    if (cid) {
      const q = query(
        collection(db, "messages"),
        where("uid", "==", currentUser.uid),
        where("convId", "==", parseInt(cid)),
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
    }
  }, [currentUser.uid, searchParams]);

  return (
    <div>
      <div className="bg-neutral-800">
        <div className={style.main}>
          {messages.length ? (
            messages.map((message) => (
              <Message key={message.id} message={message} />
            ))
          ) : (
            <h1 className="text-white text-lg">
              No messages to view in this conversation
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewChat;
