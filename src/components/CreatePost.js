import { useState } from "react";

function CreatePost(props) {
  const [content, setContent] = useState("");

  async function postBlogPost() {
    try {
      await fetch(`${process.env. REACT_APP_API_URL}/post/create?user=${props.user._id}`, {
        method: "POST",
        body: JSON.stringify({
          content: content,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          //add the new post to posts state
          props.closeModal();
          window.location.reload(false);
        });
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = (event) => {
    event.target.reset();
    event.preventDefault(); // 👈️ prevent page refresh
    postBlogPost();
    setContent("");
    // 👇️ clear all input values in the form
  };

  return (
    <div className="CreatePost">
      <div>
        <img className="profile-img" src={props.user.img_url} />
        <div>What's on your mind, {props.user.first_name} ?</div>
      </div>
      <form className="post-form" onSubmit={handleSubmit}  autoComplete="off">
        <label htmlFor="content"></label>
        <textarea
          placeholder="Write something..."
          name="content"
          required
          onChange={(event) => setContent(event.target.value)}
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CreatePost;
