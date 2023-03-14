import "../styles/Contacts.css";
import ContactItem from "./ContactItem";

function Contacts(props) {
  return (
    <div className="Contacts">
      <div>Contacts</div>
      {props.friends &&
        props.friends.map((item, i) => {
          return (
            <ContactItem
              key={i}
              item={item}
              isInChatList={props.isInChatList}
              user={props.user}
              setChatList={props.setChatList}
            />
          );
        })}
    </div>
  );
}

export default Contacts;
