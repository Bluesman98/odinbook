import "./styles/App.css";
import { useContext, useEffect, useState } from "react";
import Timeline from "./components/Timeline";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
import SearchResults from "./components/SearchResults";
import HeaderContent from "./components/HeaderContent";
import Chats from "./components/Chats";
import { SocketContext } from "./components/socket";

function App() {
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [updateUser, setUpdateUser] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chatList, setChatList] = useState([]);

  const socket = useContext(SocketContext);

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  async function signIn(username, password) {
    try {
      await fetch("http://localhost:3000/sign-in", {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
        headers: { "content-type": "application/json" },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        });
    } catch (error) {}
  }

  async function facebookLogin(response) {
    try {
      await fetch(`http://localhost:3000/login/facebook`, {
        method: "POST",
        body: JSON.stringify({
          first_name: response.first_name,
          last_name: response.last_name,
          email: response.email,
          img_url: response.picture.data.url,
          id: response.id,
        }),
        headers: { "content-type": "application/json" },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        });
    } catch (error) {
      console.log(error);
    }
  }

  async function updateUserData() {
    try {
      await fetch(`http://localhost:3000/user/${user._id}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        });
    } catch (error) {}
  }

  async function getUserFriends() {
    try {
      await fetch(`http://localhost:3000/user/${user._id}/friends`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setFriends(data);
        });
    } catch (error) {}
  }

  function isInChatList(id) {
    return chatList.some((item) => item.id === id);
  }

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      //Update data
      updateUserData();
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);



  useEffect(() => {
    if (user){ 
     setIsAuthenticated(true)
    getUserFriends();
    if(user._id)socket.emit("join_room", user._id);
    }
    
  }, [user]);

  useEffect(() => {
    updateUserData();
    setUpdateUser(false);
  }, [updateUser]);

  return (
    <div className="App">
      <div className="header">
        <HeaderContent
          isAuthenticated={isAuthenticated}
          setSearchResult={setSearchResult}
          user={user}
          friends={friends}
          setUpdateUser={setUpdateUser}
        />
      </div>
      <Chats setChatList={setChatList} chatList={chatList} user={user} />
      <Routes>
        <Route
          path={process.env.PUBLIC_URL + "/"}
          element={
            isAuthenticated ? (
              <Timeline
                user={user}
                friends={friends}
                setChatList={setChatList}
                isInChatList={isInChatList}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path={process.env.PUBLIC_URL + "/login"}
          element={
            <Login user={user} signIn={signIn} facebookLogin={facebookLogin} />
          }
        />
        <Route
          path={process.env.PUBLIC_URL + "/sign-up"}
          element={<SignUp user={user} signIn={signIn} />}
        />
        <Route
          user={user}
          path={process.env.PUBLIC_URL + "/user/:id/profile"}
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Profile user={user} setUpdateUser={setUpdateUser} />
            </PrivateRoute>
          }
        />
        <Route
          path={process.env.PUBLIC_URL + "/search"}
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <SearchResults users={searchResult} />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
