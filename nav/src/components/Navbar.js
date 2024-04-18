// import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { doSignOut } from "../firebase/auth";

// const Header = () => {
//   const navigate = useNavigate();
//   const { userLoggedIn } = useAuth();
//   return (
//     <nav className="flex justify-between bg-gray-200 w-full p-4">
//       {userLoggedIn ? (
//         <>
//           <button
//             onClick={() => {
//               doSignOut().then(() => {
//                 navigate("/login");
//               });
//             }}
//             className="text-sm text-blue-600 underline"
//           >
//             Logout
//           </button>
//         </>
//       ) : (
//         <>
//           <Link className="text-sm text-blue-600 underline" to={"/login"}>
//             Login
//           </Link>
//           <Link className="text-sm text-blue-600 underline" to={"/register"}>
//             Register New Account
//           </Link>
//         </>
//       )}
//     </nav>
//   );
// };

// export default Header;

import React, { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <div className="flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white">
      <h1 className="text-3xl w-fit font-bold text-[#00df9a]">
        <Link to="/">UmassD Navigator</Link>
      </h1>
      <ul className="hidden md:flex">
        <li className="p-4">
          <Link className="text-white" to={"/"}>
            Home
          </Link>
        </li>
        <li className="p-4">Company</li>
        <li className="p-4">Resources</li>
        <li className="p-4">About</li>
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
      <div onClick={handleNav} className="block md:hidden">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>
      <ul
        className={
          nav
            ? "fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500"
            : "ease-in-out duration-500 fixed left-[-100%]"
        }
      >
        <h1 className="w-full text-3xl font-bold text-[#00df9a] m-4">
          UmassD Navigator
        </h1>
        <li className="p-4 border-b border-gray-600">Home</li>
        <li className="p-4 border-b border-gray-600">Company</li>
        <li className="p-4 border-b border-gray-600">Resources</li>
        <li className="p-4 border-b border-gray-600">About</li>
        <li className="p-4">Contact</li>
      </ul>
    </div>
  );
};

export default Navbar;
