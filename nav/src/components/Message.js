import React from "react";

const style = {
  message: `flex items-center shadow-xl m-4 py-2 px-3 rounded-tl-full rounded-tr-full`,
  name: `absolute mt-[-4rem] text-white text-xs`,
  sent: `bg-[#395dff] text-white flex-row-reverse text-end float-right rounded-bl-full`,
  received: `bg-[#e5e5ea] text-black float-left rounded-br-full`,
};

const Message = ({ message }) => {
  const messageClass = message.isBot ? `${style.received}` : `${style.sent}`;

  return (
    <div>
      <div className={`${style.message} ${messageClass}`}>
        <p className={style.name}>
          {message.isBot ? "UmassD Navigator" : "You"}
        </p>
        <p>{message.text}</p>
      </div>
    </div>
  );
};

export default Message;
