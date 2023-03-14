import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function CreateComment(props) {
  const [content, setContent] = useState("");
  async function postComment() {
    await fetch(
      `http://localhost:3000/post/${props.post_id}/comment/create?author_id=${
        props.user._id
      }&author_name=${props.user.first_name + " " + props.user.last_name}`,
      {
        method: "POST",
        body: JSON.stringify({
          content: content,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    await props.setUpdate(1);
  }

  const handleSubmit = (event) => {
    event.target.reset();
    event.preventDefault(); // 👈️ prevent page refresh
    postComment();
    setContent("");
    // 👇️ clear all input values in the form
  };

  return (
    <div className="Comment">
      <form className="comment-form" onSubmit={handleSubmit} autoComplete="off">
        <input
          placeholder="Write a comment..."
          name="content"
          required
          onChange={(event) => setContent(event.target.value)}
        ></input>
        {content && <button type="submit"><FontAwesomeIcon icon={faPaperPlane}/></button>}
      </form>
    </div>
  );
}

export default CreateComment;
