import React, { useState } from "react";
import { db } from "../firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/authContext";

const style = {
  form: `p-5 fixed bottom-0 left-0 w-[75%] mx-auto right-0 bg-neutral-800`,
  button: `absolute bg-teal-500 p-2 rounded-lg right-0 mr-5`,
};

const SendMessage = ({ convId }) => {
  const [uiInput, setUiInput] = useState("");
  const { currentUser } = useAuth();

  const sendMessage = async (e) => {
    e.preventDefault();
    const input = uiInput;
    setUiInput("");
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
  };

  return (
    <form onSubmit={sendMessage} className={style.form}>
      <div className="relative flex items-center">
        <input
          tabIndex={0}
          required
          rows={1}
          value={uiInput}
          onChange={(e) => setUiInput(e.target.value)}
          autoFocus
          placeholder="Chat..."
          spellCheck={false}
          className="w-full focus:outline-none shadow-teal-700 shadow-xl placeholder:text-gray-200 text-sm text-white p-5 pr-16 rounded-xl bg-neutral-600"
        />
        <button className={style.button} type="submit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5 text-white"
          >
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SendMessage;
