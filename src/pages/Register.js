import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link,useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {registerRoute} from "../utils/APIRoutes";
function Register() {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate=useNavigate()

  useEffect(()=>{
    if(localStorage.getItem('chat-app-user'))
    {
      navigate('/')
    }
  },[])
  const submitHandler = async (e) => {
    e.preventDefault();
    if (validationHandler()) {
      console.log("in vlaid", registerRoute);
      const { password, confirmPassword, username, email } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
        
      });
      if(data.status===false)
      {
        toast.error(data.msg,toaster)
      }
      if(data.status===true)
      {
       localStorage.setItem('chat-app-user',JSON.stringify(data.user))
       navigate('/')
      }

    }
  };

  const handleChange = (e) => {
    setValues((curr) => {
      return { ...curr, [e.target.name]: e.target.value };
    });
  };
  const toaster = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    theme: "dark",
  };
  const validationHandler = () => {
    const { password, confirmPassword, username, email } = values;

    if (password !== confirmPassword) {
      toast.error("Password and confirm password should match", toaster);
      return false;
    } else if (username.trim().length < 3) {
      toast.error("Username should have 3 or more character", toaster);
      return false;
    } else if (email.trim().length < 3) {
      toast.error("email is not valid", toaster);
      return false;
    } else if (password.trim().length < 8) {
      toast.error("Password should have 8 or more character", toaster);
      return false;
    }
    return true;
  };
  return (
    <>
      <FormContainer>
        <form onSubmit={submitHandler}>
          <div className="brand">
            <img src={Logo} alt=""></img>
            <h1>ChatBot</h1>
          </div>
          <input
            type="text"
            onChange={(e) => handleChange(e)}
            placeholder="Username"
            name="username"
          />

          <input
            type="email"
            onChange={(e) => handleChange(e)}
            placeholder="Email"
            name="email"
          />
          <input
            type="password"
            onChange={(e) => handleChange(e)}
            placeholder="Password"
            name="password"
          />

          <input
            type="password"
            onChange={(e) => handleChange(e)}
            placeholder="Confirm Password"
            name="confirmPassword"
          />
          <button type="submit">create user</button>
          <span>
            Already have a account? <Link to="/login">Login</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;

    input {
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid #4e0eff;
      border-radius: 0.4rem;
      color: white;
      width: 100%;
      font-size: 1rem;
      &:focus {
        border: 0.1rem solid #997af0;
        outline: none;
      }
    }
    button {
      background-color: #997af0;
      color: white;
      padding: 1rem 2rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      text-transform: uppercase;
      transition: 0.5s ease-in-out;
      &:hover {
        background-color: #4e0eff;
      }
    }

    span {
      color: white;
      text-transform: uppercase;
      a {
        color: #4e0eff;
        text-decoration: none;
        font-weight: bold;
      }
    }
  }
`;
export default Register;
