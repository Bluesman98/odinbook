import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faHouse,
  faMagnifyingGlass,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import Modal from "react-modal";
import "../styles/HeaderContent.css";
import { SocketContext } from "./socket";

const customStyles = {
  content: {
    top: "0%",
    left: "auto",
    right: "3rem",
    bottom: "auto",
    boxShadow:
      "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
    borderRadius: "0 0 3px 3px",
  },
  overlay: {
    position: "fixed",
    top: "5rem",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "none",
  },
};

function HeaderContent(props) {
  const [query, setQuery] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);

  const navigate = useNavigate();

  const socket = useContext(SocketContext);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsOpen(false);
  }

  async function search(query) {
    try {
      await fetch(`${process.env. REACT_APP_API_URL}/search?query=${query}`,{
        mode: "cors",
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          props.setSearchResult(data);
        });
    } catch (error) {
    }
  }

  async function getUserFriendRequests() {
    try {
      await fetch(
        `${process.env. REACT_APP_API_URL}/user/${props.user._id}/friend-requests`,{
          mode: "cors",
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setFriendRequests(data);
        });
    } catch (error) {
    }
  }

  async function resolveFriendRequest(id, accept) {
    await fetch(
      `${process.env. REACT_APP_API_URL}/user/${props.user._id}/friend-request/resolve?user_id=${id}&accept=${accept}`,
      {
        method: "PUT",
        mode: "cors",
      }
    );
    props.setUpdateUser(true);
    getUserFriendRequests();
  }

  const handleSubmit = async (event) => {
    event.target.reset();
    event.preventDefault(); // 👈️ prevent page refresh
   await search(query);
    navigate(`/search?query=${query}`);
    setQuery("");
    // 👇️ clear all input values in the form
  };

  useEffect(() => {
    getUserFriendRequests();
  }, [props.user]);

  useEffect(() => {
    socket.on("receive_notification", (data) => {
      getUserFriendRequests();
    });

    return () => {
      socket.off("receive_notification");
    };
  }, []);

  return (
    <div className="HeaderContent">
      {!props.isAuthenticated && (
        <div className="title">
          <img className="odin-icon" src="valknut.svg"></img>
          <h1>OdinBook</h1>
        </div>
      )}
      {props.isAuthenticated && (
        <div>
          <div className="header-left">
            <form onSubmit={handleSubmit} autoComplete="off">
              <button>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
              <input
                placeholder="Search"
                required
                onChange={(event) => setQuery(event.target.value)}
              ></input>
            </form>
            <FontAwesomeIcon
              icon={faHouse}
              onClick={() => {
                navigate("/");
              }}
            />
          </div>
          <div className="header-right">
            <div className="notification">
              {friendRequests.length && (
                <div className="notification-number">
                  <div>{friendRequests.length}</div>
                </div>
              )}
              <FontAwesomeIcon
                className={friendRequests.length ? "alert" : ""}
                icon={faBell}
                onClick={openModal}
              />
            </div>
            <div
              className="profile"
              onClick={() => {
                navigate(
                  `/user/${props.user._id}/profile`
                );
              }}
            >
              <img src={props.user.img_url}></img>
              <div className={"sign-out-container"}>
                <div>{props.user.first_name + " " + props.user.last_name}</div>
                <div
                  className="sign-out"
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload(false);
                  }}
                >
                  Sign out <FontAwesomeIcon icon={faArrowRightFromBracket} />
                </div>
              </div>
            </div>
          </div>
          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
            ariaHideApp={false}
          >
            {friendRequests && (
              <div className="friend-requests">
                {friendRequests.map((item, i) => {
                  return (
                    <div key={i} className="request">
                      <img
                        src={item.img_url}
                        onClick={() => {
                          navigate(
                            `/user/${item._id}/profile`
                          );
                        }}
                      ></img>
                      <div>
                        <div>
                          <b
                            onClick={() => {
                              navigate(
                                process.env.PUBLIC_URL +
                                  `/user/${item._id}/profile`
                              );
                            }}
                          >
                            {item.first_name + " " + item.last_name + " "}
                          </b>
                          sent you a friend request.
                        </div>
                        <div className="button-container">
                          <button
                            onClick={() => {
                              resolveFriendRequest(item._id, true);
                            }}
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => {
                              resolveFriendRequest(item._id, false);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {!friendRequests.length && <div>No notifications</div>}
              </div>
            )}
          </Modal>
        </div>
      )}
    </div>
  );
}

export default HeaderContent;
