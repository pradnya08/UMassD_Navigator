import Login from "./pages/Login";
import Register from "./pages/Register";

import Navbar from "./components/Navbar";
import Account from "./pages/Account";

import { AuthProvider } from "./contexts/authContext";
import { Route, Routes } from "react-router-dom";
import Protected from "./components/Protected";
import Home from "./pages/Home";
import Chat from "./pages/Chat";

function App() {
  // const routesArray = [
  //   {
  //     path: "*",
  //     element: <Login />,
  //   },
  //   {
  //     path: "/login",
  //     element: <Login />,
  //   },
  //   {
  //     path: "/register",
  //     element: <Register />,
  //   },
  //   {
  //     path: "/home",
  //     element: (
  //       <Protected>
  //         <Home />
  //       </Protected>
  //     ),
  //   },
  // ];
  // let routesElement = useRoutes(routesArray);
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
      </Routes>
      {/* </div> */}
    </AuthProvider>
  );
}

export default App;
