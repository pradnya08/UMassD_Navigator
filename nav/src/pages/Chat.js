import React, { useState, useEffect, useRef } from "react";
import Message from "../components/Message";
import SendMessage from "../components/SendMessage";
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
import SubmitFeedback from "../components/SubmitFeedback";

const style = {
  main: `pb-32 pt-5 space-y-5 w-[75%] mx-auto relative`,
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [enableChat, setEnableChat] = useState(false);
  const [enableFeedback, setEnableFeedback] = useState(false);
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
  }, [convId, currentUser.uid]);

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

  const give_feedback = () => {
    setEnableChat(!enableChat);
    setEnableFeedback(!enableFeedback);
  };

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    // eslint-disable-next-line
    useEffect(() => elementRef.current.scrollIntoView(), [messages]);
    return <div ref={elementRef} />;
  };

  return (
    <div>
      <div className={enableFeedback ? "hidden" : "" + "bg-[#003764]"}>
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
        <div className={!enableChat ? "hidden" : ""}>
          <button
            className="bg-[#00df9a] w-[150px] rounded-md font-medium my-6 mx-6 py-3 text-black"
            onClick={give_feedback}
          >
            Give Feedback
          </button>
        </div>
        <AlwaysScrollToBottom />
        <div className={enableChat ? "" : "hidden"}>
          <SendMessage convId={convId} />
        </div>
      </div>
      <div className={!enableFeedback ? "hidden" : "" + "bg-neutral-800"}>
        <SubmitFeedback convId={convId} feedbackEnabler={setEnableFeedback} />
      </div>
    </div>
  );
};

export default Chat;
