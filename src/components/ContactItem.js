import { useEffect, useState, useContext } from "react";
import { SocketContext } from "./socket";

function ContactItem(props) {
  const socket = useContext(SocketContext);

  const item = props.item;

  const [chat, setChat] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

  async function fetchChat(item) {
    try {
      await fetch(
        `http://localhost:3000/chat/find?users=${props.user._id}&users=${item._id}`
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setChat(data);
          if (data.messages.length) {
            setUnreadMessages(
              data.messages.filter(
                (item) => !item.read_by.includes(props.user._id)
              ).length
            );
          }
        });
    } catch (error) {}
  }

 async function markAllAsRead() {
    await fetch(
      `http://localhost:3000/chat/${chat._id}/read-all?user_id=${props.user._id}`,
      {
        method: "PUT",
      }
    );
  }

  useEffect(() => {
    if (item) fetchChat(item);

    socket.on("receive_message", (data) => {
      if (!props.isInChatList(item._id)) fetchChat(item);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  return (
    <div
      className="ContactItem"
      onClick={() => {
        if (!props.isInChatList(item._id)) {
          markAllAsRead();
          setUnreadMessages(0);
          props.setChatList((current) => [
            ...current,
            {
              id: item._id,
              name: item.first_name + " " + item.last_name,
              img_url: item.img_url,
              chat_id: chat._id,
            },
          ]);
        }
      }}
    >
      <div className="user">
        <img src={item.img_url}></img>
        <div>{item.first_name + " " + item.last_name} </div>
        {unreadMessages > 0 && <div className="alert">{unreadMessages} </div>}
      </div>
    </div>
  );
}

export default ContactItem;
