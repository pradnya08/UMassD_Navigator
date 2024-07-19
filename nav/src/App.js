import Login from "./pages/Login";
import Register from "./pages/Register";

import Navbar from "./components/Navbar";
import Account from "./pages/Account";

import { AuthProvider } from "./contexts/authContext";
import { Route, Routes } from "react-router-dom";
import Protected from "./components/Protected";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Conversations from "./pages/Conversations";
import ViewChat from "./pages/ViewChat";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      {/* <div className="w-full h-screen flex flex-col"> */}
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/account"
          element={
            <Protected>
              <Account />
            </Protected>
          }
        />
        <Route
          path="/chat"
          element={
            <Protected>
              <Chat />
            </Protected>
          }
        />
        <Route
          path="/conversations"
          element={
            <Protected>
              <Conversations />
            </Protected>
          }
        />
        <Route
          path="/viewChat"
          element={
            <Protected>
              <ViewChat />
            </Protected>
          }
        />
      </Routes>
      {/* </div> */}
    </AuthProvider>
  );
}

export default App;
