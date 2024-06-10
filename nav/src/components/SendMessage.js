import React, { useState } from "react";
import { db } from "../firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/authContext";

const style = {
  form: `h-14 w-full max-w-[728px]  flex text-xl absolute bottom-0`,
  input: `w-full text-xl p-3 bg-gray-900 text-white outline-none border-none`,
  button: `w-[20%] bg-green-500`,
};

const SendMessage = ({ scroll, convId }) => {
  const [input, setInput] = useState("");
  const { currentUser } = useAuth();

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input === "") {
      alert("Please enter a valid message");
      return;
    }

    const msgRef = collection(db, "messages");
    await addDoc(msgRef, {
      text: input,
      name: currentUser.displayName,
      convId,
      uid: currentUser.uid,
      isBot: false,
      timestamp: serverTimestamp(),
    });

    const msg = { input };

    const response = await fetch("/ask", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(msg),
    });
    if (response.ok) {
      const body = await response.json();

      const bot_response = body["reply"];

      await addDoc(msgRef, {
        text: bot_response,
        name: "UmassD Navigator",
        convId,
        uid: currentUser.uid,
        isBot: true,
        timestamp: serverTimestamp(),
      });
    } else {
      alert("Server is down");
    }
    setInput("");
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <form onSubmit={sendMessage} className={style.form}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={style.input}
        type="text"
        placeholder="Message"
      />
      <button className={style.button} type="submit">
        Send
      </button>
    </form>
  );
};

export default SendMessage;
