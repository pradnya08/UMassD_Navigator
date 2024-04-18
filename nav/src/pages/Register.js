import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { doCreateUserWithEmailAndPassword } from "../firebase/auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { userLoggedIn } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Password and Confirm Password do not match, try again!");
      return;
    }
    if (!isRegistering) {
      setIsRegistering(true);
      doCreateUserWithEmailAndPassword(email, password).catch((err) => {
        if (err.code === "auth/invalid-email") {
          setErrorMessage(
            "The email entered was incorrect, please try again with a valid email"
          );
        } else if (err.code === "auth/weak-password") {
          setErrorMessage(
            "Password is very weak\nPassword requirements:\nMinimum 6 characters"
          );
        } else if (err.code === "auth/email-already-in-use") {
          setErrorMessage("There was an error registering, so try again");
        }
        setIsRegistering(false);
        setEmail("");
        setPassword("");
        setconfirmPassword("");
      });
    }
  };

  return userLoggedIn ? (
    <Navigate to="/account" />
  ) : (
    <>
      <main className="w-full h-screen mt-[-96px] mx-auto flex-col flex self-center place-content-center place-items-center">
        <div className="w-96 text-white space-y-5 p-4 shadow-xl border rounded-xl">
          <div className="text-center mb-6">
            <div className="mt-2">
              <h3 className="text-white text-xl font-semibold sm:text-2xl">
                Create a New Account
              </h3>
            </div>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-white font-bold">Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="w-full mt-2 px-3 py-2 text-white bg-transparent outline-none border focus:border-[#00df9a] shadow-sm rounded-lg transition duration-300"
              />
            </div>

            <div>
              <label className="text-sm text-white font-bold">Password</label>
              <input
                disabled={isRegistering}
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="w-full mt-2 px-3 py-2 text-white bg-transparent outline-none border focus:border-[#00df9a] shadow-sm rounded-lg transition duration-300"
              />
            </div>

            <div>
              <label className="text-sm text-white font-bold">
                Confirm Password
              </label>
              <input
                disabled={isRegistering}
                type="password"
                autoComplete="off"
                required
                value={confirmPassword}
                onChange={(e) => {
                  setconfirmPassword(e.target.value);
                }}
                className="w-full mt-2 px-3 py-2 text-white bg-transparent outline-none border focus:border-[#00df9a] shadow-sm rounded-lg transition duration-300"
              />
            </div>

            {errorMessage && (
              <span className="text-red-600 font-bold whitespace-pre-wrap">
                {errorMessage}
              </span>
            )}

            <button
              type="submit"
              disabled={isRegistering}
              className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                isRegistering
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#00df9a] hover:bg-[#3b9c7d] hover:shadow-xl transition duration-300"
              }`}
            >
              {isRegistering ? "Signing Up..." : "Sign Up"}
            </button>
            <div className="text-sm text-center">
              Already have an account? {"   "}
              <Link
                to={"/login"}
                className="text-center text-sm hover:underline font-bold text-[#00df9a]"
              >
                Continue
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Register;
