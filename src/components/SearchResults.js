import { useNavigate } from "react-router-dom";
import "../styles/SearchResults.css";

function SearchResults(props) {
  const navigate = useNavigate();
  return (
    <div className="SearchResults">
            {(! props.users || !props.users.length) && <div>No results</div>}
      {props.users &&
        props.users.map((user, i) => {
          return (
            <div
              onClick={() => {
                navigate(`/user/${user._id}/profile`);
              }}
            >
              <img src={user.img_url}></img>
              <span key={i}>{user.first_name + " " + user.last_name}</span>
            </div>
          );
        })}
    </div>
  );
}

export default SearchResults;
