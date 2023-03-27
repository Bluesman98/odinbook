import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "../styles/SignUp.css"

function SignUp(props) {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [firstName,setFirstName] = useState('')
    const [lastName,setLastName] = useState('')

    const navigate = useNavigate()

    async function signUp(){
      try{await fetch(
        '${process.env. REACT_APP_API_URL}/sign-up',
        {
          method: "POST", 
          mode: "cors",
          body:  JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password
          }),
          headers: { 'Content-type': 'application/json' }
        }
      )
      .then(() => {
        props.signIn(email,password)
      })
      navigate("/")
    }
      catch(error){
      }
    }

    const handleSubmit = (event) => {
        event.target.reset();
        event.preventDefault();
        signUp()
      };
    
    if(props.user) return <Navigate to={"/"}/>

     return (
      <div className="SignUp">
         <form className="sign-up-form" onSubmit={handleSubmit}  autoComplete="off">
         <input
          placeholder="First Name"
          name="first_name"
          required
          onChange={(event) => setFirstName(event.target.value)}
        ></input>
                 <input
          placeholder="Last Name"
          name="last_name"
          required
          onChange={(event) => setLastName(event.target.value)}
        ></input>
        <input
        type={"email"}
          placeholder="Email"
          name="email"
          required
          onChange={(event) => setEmail(event.target.value)}
        ></input>
        <input
        type={"password"}
          placeholder="Password"
          name="password"
          required
          onChange={(event) => setPassword(event.target.value)}
        ></input>
        <button type="submit">Sign Up</button>
      </form>
      </div>
    );
  }
  
  export default SignUp;