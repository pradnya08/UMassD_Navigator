import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

const Account = () => {
  const { currentUser } = useAuth();

  return (
    <>
      <main className="w-full h-screen mt-[-96px] mx-auto flex-col flex self-center place-content-center place-items-center">
        <div className="text-white text-2xl font-bold pt-14">
          Hello{" "}
          {currentUser.displayName
            ? currentUser.displayName
            : currentUser.email}
          , you are now logged in.
        </div>
        <button className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black">
          <Link to="/chat">Chat!</Link>
        </button>
      </main>
    </>
  );
};

export default Account;
