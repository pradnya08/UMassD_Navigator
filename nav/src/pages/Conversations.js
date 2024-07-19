import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import Message from "../components/Message";
import { Link } from "react-router-dom";

const Conversations = () => {
  const [convs, setConvs] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const userRef = doc(db, "users", currentUser.uid);
    const latest_conversation_id = getDoc(userRef).then((doc) => {
      const data = doc.data();
      var list = [];
      for (var i = 1; i <= data["latest_conversation_id"]; i++) {
        var msg = { text: "Conversation: " + i, k: i };
        list.push(msg);
      }
      setConvs(list);
    });
  }, []);
  return (
    <div className="text-white">
      <div className="pb-32 pt-5 space-y-5 w-[75%] mx-auto relative text-white">
        {convs.map((message) => (
          <Link
            key={message.k}
            className="m-5"
            to={"/viewChat?convId=" + message.k}
          >
            <Message key={message.k} message={message} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Conversations;
