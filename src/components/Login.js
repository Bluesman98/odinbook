import React from "react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSquareFacebook } from '@fortawesome/free-brands-svg-icons' 

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const responseFacebook = (response) => {
    console.log(response.id);
    props.facebookLogin(response)
  };

  const handleSubmit = (event) => {
    event.target.reset();
    event.preventDefault();
    props.signIn(email, password);
  };

  if (props.user) return <Navigate to={process.env.PUBLIC_URL + "/"} />;

  return (
    <div className="Login">
      <form className="login-form" onSubmit={handleSubmit}>
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
        <button className="login" type="submit">Login</button>
        <FacebookLogin
          appId="737024604411265"
          fields="first_name,last_name,email,picture.type(large)"
          callback={responseFacebook}
          render={(renderProps) => (
            <button onClick={renderProps.onClick}><FontAwesomeIcon icon={faSquareFacebook}/> Login With Facebook</button>
          )}
        />
                <button className="example" onClick={() => { props.signIn("mithrandir@mage.com", "flyyoufools");}}>
          Login As Example User
        </button>
        <button className="sign-up" onClick={() => {navigate(process.env.PUBLIC_URL + "/sign-up")}}>
          Create New Account
        </button>
      </form>
    </div>
  );
}

export default Login;
