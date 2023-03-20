import "../styles/Comment.css"
import { format } from "date-fns";
import { useEffect, useState } from "react";

function Comment(props) {
  const [author, setAuthor] = useState(null);
  async function fetchAuthor() {
    await fetch(
      `${process.env. REACT_APP_API_URL}/user/${props.comment.author_id}/details`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setAuthor(data);
      });
  }

  useEffect(()=>{
    fetchAuthor()
  },[])

  return (
    <div className="Comment">
         <div>
            {author && <div className="author"><img className="profile-img" src={author.img_url}/>{author.first_name + " " + author.last_name}</div>}
                     <div className="date">
                         <div>{format(new Date(props.comment.date), 'H:mm' )}</div>
                         <div>{format(new Date(props.comment.date), 'MM/dd/yy' )}</div>
                     </div>
         </div>
        <div className="content">{props.comment.content}</div>
    </div>
  );
}

export default Comment;