import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart,faMessage } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid,faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import Comment from "../components/Comment";
import "../styles/Post.css";
import CreateComment from "./CreateComment";
import { Link } from "react-router-dom";

function Post(props) {
  const [comments, setComments] = useState(null);
  const [author, setAuthor] = useState(null);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [update, setUpdate] = useState(0);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  async function fetchComments() {
    await fetch(`${process.env. REACT_APP_API_URL}/post/${props.post._id}/comments`,{
      mode: "cors",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setComments(data);
      });
  }

  async function fetchAuthor() {
    await fetch(`${process.env. REACT_APP_API_URL}/user/${props.post.author_id}/details`,{
      mode: "cors",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setAuthor(data);
      });
  }

  async function likePost() {
    await fetch(
      `${process.env. REACT_APP_API_URL}/post/${props.post._id}/like?user_id=${props.user._id}`,
      {
        method: "PUT",
        mode: "cors",
      }
    );
  }

  async function unlikePost() {
    await fetch(
      `${process.env. REACT_APP_API_URL}/post/${props.post._id}/like-remove?user_id=${props.user._id}`,
      {
        method: "PUT",
        mode: "cors",
      }
    );
  }

  useEffect(() => {
    setIsLiked(props.post.likes.includes(props.user._id));
  }, []);

  useEffect(() => {
    fetchComments();
    fetchAuthor();
    setUpdate(0);
    setLikes(props.post.likes.length);
  }, [update]);

  return (
    <div className="Post">
      <div>
        {author && (
          <Link className="author" to={`/user/${author._id}/profile`} >
            <img className="profile-img" src={author.img_url}></img>
            <div> {author.first_name + " " + author.last_name} </div>
          </Link>
        )}
        <div className="date">
          {props.post.author_id === props.user._id && (
            <FontAwesomeIcon
            icon={faEllipsis}
              onClick={() => {
                props.openModal();
                props.setPost_id(props.post._id);
                props.setPostContent(props.post.content);
              }}
            />
          )}
                    <div>{format(new Date(props.post.date), "MMMM do, yyyy ")}</div>
          <div>{format(new Date(props.post.date), "H:mm")}</div>
        </div>
      </div>
      <div className="content">{props.post.content}</div>
      <div className="details">
        <div className="likes">
          <FontAwesomeIcon icon={faHeart} />
          {" " + likes}
        </div>
        {comments && (
          <div className="comments-count">{comments.length + " Comments"}</div>
        )}
      </div>
      <div className="button-container">
        <div
         className={isLiked?"like solid":"like"}
          onClick={() => {
            if (!isLiked) {
              likePost();
              setLikes(likes + 1);
              setIsLiked(true)
            } else {
              unlikePost();
              setLikes(likes - 1);
              setIsLiked(false)
            }
          }}
        >
          <FontAwesomeIcon
            icon={isLiked ? faHeartSolid : faHeart}
          />
          {" Like"}
        </div>
        <div
         className="comments-button"
          onClick={() => {
            if (!commentsVisible) {
              fetchComments();
              setCommentsVisible(true);
            } else {
              setCommentsVisible(false);
            }
          }}
        >
          <FontAwesomeIcon
            icon={faMessage}
          />
          {" Comments"}
        </div>
      </div>
      {commentsVisible && (
        <div className="comments">
          {comments.map((comment, i) => {
            return <Comment comment={comment} key={i} setUpdate={setUpdate} />;
          })}
                    <CreateComment
            setUpdate={setUpdate}
            user={props.user}
            post_id={props.post._id}
          />
        </div>
      )}
    </div>
  );
}

export default Post;
