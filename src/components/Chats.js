import Chat from "./Chat";
import "../styles/Chats.css";
import { SocketContext } from "./socket";
import { useContext, useEffect } from "react";

function Chats(props) {
  const socket = useContext(SocketContext);

  const joinRoom = (room) => {
    socket.emit("join_room", room);
  };

  async function joinRooms() {
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL}/user/${props.user._id}/chats`,
        {
          mode: "cors",
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          data.map((item) => {
            joinRoom(item._id);
          });
        });
    } catch (error) {
      console.log(error);
    }
  }

  function removeChat(id) {
    props.setChatList(
      props.chatList.filter(function (chat) {
        return chat.id !== id;
      })
    );
  }

  useEffect(() => {
    if (props.user) joinRooms();
  }, [props.user]);

  return (
    <div className="Chats">
      {props.chatList &&
        props.chatList
          .map((item, i) => {
            return (
              <Chat
                key={i}
                data={item}
                removeChat={removeChat}
                user={props.user}
              />
            );
          })
          .slice(-3)
          .reverse()}
    </div>
  );
}

export default Chats;
