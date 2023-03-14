import Post from "./Post";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import React from "react";
import Modal from "react-modal";
import CreatePost from "./CreatePost";
import EditPost from "./EditPost";
import "../styles/Timeline.css";
import Contacts from "./Contacts";

const customStyles = {
  content: {
    top: "30%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "fit-content",
    padding: "1rem .5rem",
  },
};

function Timeline(props) {
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [post_id, setPost_id] = useState(null);
  const [modalType, setModalType] = useState("edit");
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const navigate = useNavigate();
  const params = useParams();

  async function fetchPosts() {
    await fetch(`http://localhost:3000/user/${props.user._id}/timeline-posts`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPosts(data)
      });
  }

  useEffect(() => {
    fetchPosts();
    // Sort
    let posts_sorted = [...posts];
    posts_sorted.sort((a,b) => a.date - b.date ? -1 : 1);
    setPosts(posts_sorted)
  }, [] );

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setModalType("edit");
    setIsOpen(false);
  }

  if (props.user === null)
    return <Navigate to={process.env.PUBLIC_URL + "/login"} />;

  return (
    <div className="Timeline">
      <div className="posts">
        <div className="new-post"
          onClick={() => {
            setModalType("create");
            openModal();
          }}
        >
         <img className="profile-img" src={props.user.img_url}/>
         <div>What's on your mind, {props.user.first_name} ?</div>
        </div>
        {posts !== null &&<div >{
          posts.map((data, i) => {
            return (
              <Post
                user={props.user}
                post={data}
                key={i}
                openModal={openModal}
                setPostContent={setPostContent}
                setPost_id={setPost_id}
              />
            );
          })}</div>}
      </div>
      <Contacts user={props.user} friends={props.friends} setChatList={props.setChatList} isInChatList = {props.isInChatList}/>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <div className="post-modal-content">
          {modalType === "edit" && (
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
        </div>
      </Modal>
    </div>
  );
}

export default React.memo(Timeline);
