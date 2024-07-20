import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { doSignOut } from "../firebase/auth";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import umassd_logo from "../assets/umassd_logo.png";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
const Navbar = () => {
  const [nav, setNav] = useState(false);
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (userLoggedIn) {
      const userRef = doc(db, "users", currentUser.uid);
      getDoc(userRef)
        .then((doc) => {
          const data = doc.data();
          return "is_admin" in data ? data["is_admin"] : false;
        })
        .then((is_admin) => {
          setIsAdmin(is_admin);
        });
    }
    setIsAdmin(false);
  }, [userLoggedIn]);

  const handleNav = () => {
    setNav(!nav);
  };
  return (
    <div className="flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white">
      <img src={umassd_logo} />
      <h1 className="text-3xl w-fit font-bold text-[#FEC24D]">
        <Link to="/">UmassD Navigator</Link>
      </h1>
      <ul className="hidden md:flex">
        <li className="p-4">
          <Link className="text-white" to={"/"}>
            Home
          </Link>
        </li>
        <li className="p-4">
          {userLoggedIn ? (
            <>
              <Link className="text-white" to={"/account"}>
                Account
              </Link>
            </>
          ) : (
            <></>
          )}
        </li>
        <li className="p-4">
          {isAdmin && (
            <Link className="text-white" to={"/dashboard"}>
              Dashboard
            </Link>
          )}
        </li>
        <li className="p-4">
          {userLoggedIn ? (
            <>
              <button
                onClick={() => {
                  doSignOut().then(() => {
                    navigate("/login");
                  });
                }}
                className="text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="text-white" to={"/login"}>
                Login
              </Link>
            </>
          )}
        </li>
      </ul>
      <div onClick={handleNav} className="block md:hidden hover:cursor-pointer">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>
      <ul
        className={
          nav
            ? "fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#003564] ease-in-out duration-500"
            : "ease-in-out duration-500 fixed left-[-100%]"
        }
      >
        <h1 className="w-full text-3xl font-bold text-[#FEC24D] m-4">
          UmassD Navigator
        </h1>
        <li
          onClick={() => {
            setNav(!nav);
          }}
          className="p-4"
        >
          <Link className="text-white" to={"/"}>
            Home
          </Link>
        </li>
        <li
          onClick={() => {
            setNav(!nav);
          }}
          className="p-4"
        >
          {userLoggedIn ? (
            <>
              <Link className="text-white" to={"/account"}>
                Account
              </Link>
            </>
          ) : (
            <></>
          )}
        </li>
        <li
          onClick={() => {
            setNav(!nav);
          }}
          className="p-4"
        >
          {isAdmin && (
            <Link className="text-white" to={"/dashboard"}>
              Dashboard
            </Link>
          )}
        </li>
        <li
          onClick={() => {
            setNav(!nav);
          }}
          className="p-4"
        >
          {userLoggedIn ? (
            <>
              <button
                onClick={() => {
                  doSignOut().then(() => {
                    navigate("/login");
                  });
                }}
                className="text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="text-white" to={"/login"}>
                Login
              </Link>
            </>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
