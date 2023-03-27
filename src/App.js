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
      await fetch(`${process.env. REACT_APP_API_URL}/sign-in`, {
        method: "POST",
        mode: "cors",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        });
    } catch (error) {
      console.log(error)
    }
  }

  async function facebookLogin(response) {
    try {
      await fetch(`${process.env. REACT_APP_API_URL}/login/facebook`, {
        method: "POST",
        mode: "cors",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          first_name: response.first_name,
          last_name: response.last_name,
          email: response.email,
          img_url: response.picture.data.url,
          id: response.id,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        });
    } catch (error) {
    }
  }

  async function updateUserData() {
    try {
      await fetch(`${process.env. REACT_APP_API_URL}/user/${user._id}`,{
        mode: "cors",
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        });
    } catch (error) {
    }
  }

  async function getUserFriends() {
    try {
      await fetch(`${process.env. REACT_APP_API_URL}/user/${user._id}/friends`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setFriends(data);
        });
    } catch (error) {
    }
  }

  function isInChatList(id) {
    return chatList.some((item) => item.id === id);
  }

  useEffect(() => {
    console.log(process.env. REACT_APP_API_URL)
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
          path={"/"}
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
          path={"/login"}
          element={
            <Login user={user} signIn={signIn} facebookLogin={facebookLogin} />
          }
        />
        <Route
          path={"/sign-up"}
          element={<SignUp user={user} signIn={signIn} />}
        />
        <Route
          user={user}
          path={"/user/:id/profile"}
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Profile user={user} setUpdateUser={setUpdateUser} />
            </PrivateRoute>
          }
        />
        <Route
          path={"/search"}
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
