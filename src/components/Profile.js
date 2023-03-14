import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import MyProfile from "./MyProfile";
import "../styles/Profile.css" 
import Post from "./Post";
import { SocketContext } from "./socket";

function Profile(props) {
  const [user, setUser] = useState(null);
  const [friend ,setFriend] = useState(false)
  const [requestPending ,setRequestPending] = useState(false)
  const [requestIncoming ,setRequestIncoming] = useState(false)
  const [posts,setPosts] = useState([])

  const params = useParams();

  const socket = useContext(SocketContext);

  async function fetchPosts(user_id) {
    await fetch(`http://localhost:3000/user/${user_id}/posts`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPosts(data);
      });
  }

  useEffect(() => {
    async function fetchUser() {
      await fetch(`http://localhost:3000/user/${params.id}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setUser(data);
          isPending(data,props.user._id)
        });
    }
    setPosts([])
    fetchUser();
    isFriend(params.id)
    isIncoming(params.id)
    fetchPosts(params.id)
  }, [params]);

  function isFriend(id){
    props.user.friend_list.map((item)=>{
        if(item === id) setFriend(true)
    })
  }

  function isPending(user,id){
   user.friend_requests.map((item)=>{
      if(item === id) setRequestPending(true)
  })
  }

  function isIncoming(id){
    props.user.friend_requests.map((item)=>{
      if(item === id) setRequestIncoming(true)
  })
  }

  async function sendFriendRequest(){
    await fetch(
      `http://localhost:3000/user/${params.id}/friend-request?user_id=${props.user._id}`,
      {
        method: "PUT",
      }
    );
    setRequestPending(true)
    socket.emit("send_notification", params.id);
  }

  async function resolveFriendRequest(accept){
    await fetch(
      `http://localhost:3000/user/${props.user._id}/friend-request/resolve?user_id=${params.id}&accept=${accept}`,
      {
        method: "PUT",
      }
    );
    setRequestPending(false)
    setRequestIncoming(false)
    accept? setFriend(true) : setFriend(false)
    props.setUpdateUser(true)
  }

  if(props.user._id === params.id) return <MyProfile user={props.user} setUpdateUser={props.setUpdateUser}/>
  
  return (
    <div className="Profile">
      {user && (
        <div>
          <div className="avatar">
            <img src={user.img_url}></img>
            <h1>{user.first_name + " " + user.last_name}</h1>
          </div>
          <h2>{user.email}</h2>
          { !(friend || requestPending || requestIncoming) && <button onClick={sendFriendRequest}>Add Friend</button>}
          { requestPending  && <h2>Friend Request Sent</h2>}
          { requestIncoming && <div className="request-resolve">
            <h2>{user.first_name + " sent you a friend request"}</h2>
            <button onClick={()=>{resolveFriendRequest(true)}} >Accept Request</button>
            <button onClick={()=>{resolveFriendRequest(false)}} >Remove Request</button>
          </div>}
          {friend && <div>Friends &#10003;</div>}
        </div>

      )}
           {posts !== null &&<div className="posts">{
        posts.map((post, i) => {
          return (
            <Post
              user={props.user}
              post={post}
              key={i}
            />
          );
        })}</div>}
    </div>
  );
}

export default Profile;
