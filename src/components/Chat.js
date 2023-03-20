//import "../styles/Chat.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faReply } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "./socket";
import { format } from "date-fns";
import { Link } from "react-router-dom";

class Message {
  constructor(author, text, date = new Date()) {
    this.author = author;
    this.text = text;
    this.date = date;
  }
}

function Chat(props) {
  const [chat, setChat] = useState(null);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const socket = useContext(SocketContext);

  const sendMessage = (message, room) => {
    socket.emit("send_message", { message: message, room: room });
  };

  async function fetchChat() {
    try {
      await fetch(`${process.env. REACT_APP_API_URL}/chat/${props.data.chat_id}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setChat(data);
          setMessages(data.messages);
        });
    } catch (error) {
      console.log(error);
    }
  }

  async function postMessage() {
    await fetch(
      `${process.env. REACT_APP_API_URL}/chat/${chat._id}/message?author=${props.user._id}`,
      {
        method: "POST",
        body: JSON.stringify({
          text: text,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )        .then((res) => {
      return res.json();
    })
    .then((data) => {
      sendMessage(data, props.data.chat_id);
    });;
  }

   async function markAsRead(msg_id) {
     await fetch(
      `${process.env. REACT_APP_API_URL}/chat/${props.data.chat_id}/message/${msg_id}/read?user_id=${props.user._id}`,
      {
        method: "PUT",
      }
    )
  } 

  const handleSubmit = (event) => {
    event.target.reset();
    event.preventDefault(); // 👈️ prevent page refresh
    if (text.trim().length !== 0) {
      let message = new Message(props.user._id, text);
      setMessages((current) => [...current, message]);
      postMessage();
    }
    setText("");
    // 👇️ clear all input values in the form
  };

  useEffect(() => {
    fetchChat();

    socket.on("receive_message", (data) => {
     setMessages((current) => [...current, data.message]);
     markAsRead(data.message._id)
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const messageEl = useRef(null);

  useEffect(() => {
    if (messageEl) {
      messageEl.current.addEventListener('DOMNodeInserted', event => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      });
    }
  }, [])

  if (!props.data) return <div />;

  return (
    <div className="Chat">
      <div className="top">
        <div className="user">
          <img className="profile-img" src={props.data.img_url}></img>
          <Link to={process.env.PUBLIC_URL + `/user/${props.data.id}/profile`}> {props.data.name} </Link>
        </div>
        <FontAwesomeIcon
          icon={faXmark}
          onClick={() => {
            props.removeChat(props.data.id);
          }}
        />
      </div>
      <div className="content" ref={messageEl}>
        {messages.map((message, i) => {
          return (
            <div key={i} className="message-container">
              <div
                key={i}
                className={
                  message.author === props.user._id ? "text user" : "text"
                }
              >
                <div>{message.text}</div>
              </div>
             { message.date && <div
                className={
                  message.author === props.user._id ? "date user" : "date"
                }
              >
                {format(new Date(message.date), "dd/m/yyyy ") +
                  " " +
                  format(new Date(message.date), "h:mm a")}
              </div>}
            </div>
          );
        })}
      </div>
      <div className="bottom">
        <form
          className="comment-form"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <input
            autoFocus
            placeholder="Aa"
            name="text"
            onChange={(event) => setText(event.target.value)}
            onClick={()=>{}}
          ></input>
          <button type="submit">
            <FontAwesomeIcon icon={faReply} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
