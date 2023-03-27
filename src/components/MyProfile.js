import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import Post from "./Post";
import Modal from "react-modal";
import CreatePost from "./CreatePost";
import EditPost from "./EditPost";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

function MyProfile(props) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [imgUrl, SetImgUrl] = useState("");
  const [post_id, setPost_id] = useState(null);
  const [modalType, setModalType] = useState("");
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const params = useParams();

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setModalType("");
    setIsOpen(false);
  }

  function openPostModal(){
    openModal()
    setModalType('edit')
  }

  async function fetchPosts(user_id) {
    await fetch(`${process.env. REACT_APP_API_URL}/user/${user_id}/posts`,{
      mode: "cors",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPosts(data);
      });
  }

  async function updateProfilePic(user_id){
      await fetch(
        `${process.env. REACT_APP_API_URL}/user/${user_id}/img_url/update?img_url=${imgUrl}`,
        {
          method: "PUT",
          mode: "cors",
        }
      ).then((data) => {
        props.setUpdateUser(true);
        closeModal();
      });
  }

  const handleSubmit = (event) => {
    event.target.reset();
    event.preventDefault(); // 👈️ prevent page refresh
    if(imgUrl)updateProfilePic(params.id)
    SetImgUrl("");    // 👇️ clear all input values in the form
  };

  useEffect(() => {
    async function fetchUser() {
      await fetch(`${process.env. REACT_APP_API_URL}/user/${params.id}`,{
        mode: "cors",
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setUser(data);
        });
    }
    fetchUser();
    fetchPosts(params.id);
  }, []);

  return (
    <div className="MyProfile">
      {user && (
        <div>
          <div className="avatar">
            <div>
              <img src={user.img_url} />
              <FontAwesomeIcon
                icon={faPenToSquare}
                onClick={() => {
                  setModalType("profile");
                  openModal();
                }}
              />
            </div>
            <h1>{user.first_name + " " + user.last_name}</h1>
          </div>
          <h2>{user.email}</h2>
        </div>
      )}
      {posts !== null && (
        <div className="posts">
          {posts.map((post, i) => {
            return (
              <Post
                user={props.user}
                post={post}
                key={i}
                openModal={openPostModal}
                setPostContent={setPostContent}
                setPost_id={setPost_id}
              />
            );
          })}
        </div>
      )}
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
       <div className="post-modal-content"> {modalType === "edit" && (
          <EditPost
          user={props.user}
            postContent={postContent}
            post_id={post_id}
            posts={posts}
            setPosts={setPosts}
            closeModal={closeModal}
          />
        )}
        {modalType === "create" && (
          <CreatePost
            user={props.user}
            setPosts={setPosts}
            closeModal={closeModal}
          />
        )}
        {modalType === "profile" && (
          <form  onSubmit={handleSubmit}  autoComplete="off">
            <label htmlFor="content"></label>
            <input
              placeholder="Paste image url here..."
              name="content"
              required
              onChange={(event) => SetImgUrl(event.target.value)}
            ></input>
            <button type="submit">Submit</button>
          </form>
        )}
        </div>
      </Modal>
    </div>
  );
}

export default MyProfile;
