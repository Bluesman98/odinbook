import { useState } from "react";
import {useParams } from "react-router-dom";

function EditPost(props) {
  const params = useParams();

  const [content, setContent] = useState(props.postContent);

  async function updatePost(content) {
    await fetch(
      `${process.env. REACT_APP_API_URL}/post/${props.post_id}/update?content=${content}`,
      {
        method: "PUT",
      }
    );
    updatePosts(props.post_id, content);
    props.closeModal();
    window.location.reload(false);
  }

  async function deletePost() {
    await fetch(`${process.env. REACT_APP_API_URL}/post/${props.post_id}/delete`, {
      method: "DELETE",
    });
    removePost(props.post_id);
    props.closeModal();
    window.location.reload(false);
  }

  // Update posts state
  function updatePosts(post_id, content) {
    let temp = [...props.posts];
    temp.map((i) => {
      if (i._id === post_id) {
        i.content = content;
        props.setPosts(temp);
      }
    });
  }

  // remove post from  posts state
  function removePost(post_id) {
    props.setPosts(
      props.posts.filter(function (item) {
        return item._id !== post_id;
      })
    );
  }

  const handleSubmit = (event) => {
    event.target.reset();
    event.preventDefault(); // 👈️ prevent page refresh

    updatePost(content);
  };

  return (
    <div className="EditPost">
      <div>
        <img className="profile-img" src={props.user.img_url} />
        <div>What's on your mind, {props.user.first_name} ?</div>
      </div>
      <form className="post-form" onSubmit={handleSubmit}  autoComplete="off">
        <label htmlFor="content"></label>
        <textarea
          value={content}
          placeholder="Write something..."
          name="content"
          required
          onChange={(event) => setContent(event.target.value)}
        ></textarea>
        <button
          onClick={() => {
            deletePost();
          }}
        >
          Delete
        </button>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default EditPost;
