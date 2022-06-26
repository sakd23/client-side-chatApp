import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host } from "../utils/APIRoutes";
import axios from "axios";
import Contacts from "../Components/Contacts";
import Welcome from "../Components/Welcome";
import ChatContainer from "../Components/ChatContainer";
import { io } from "socket.io-client";

function Chat() {
  // const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchCurrUser = async () => {
      if (!localStorage.getItem('chat-app-user')) {
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse( localStorage.getItem('chat-app-user')));
        setIsLoading(true);
      }
    };

    fetchCurrUser();
  }, []);
  // useEffect(() => {
  //   if (currentUser) {
  //     socket.current = io(host);
  //     socket.current.emit("add-user", currentUser._id);
  //   }
  // }, [currentUser]);

  useEffect(() => {
    const fetchIsAvatarSet = async () => {
      if (currentUser) {
        if (!currentUser.isAvatarImageSet) {
          navigate("/setavatar");
        } else {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);

          setContacts(data.data);
        }
      }
    };
    fetchIsAvatarSet();
  }, [currentUser]);

  const changeChat = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <Container>
      <div className="container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={changeChat}
        ></Contacts>

        {isLoading && currentChat === undefined ? (
          <Welcome currentUser={currentUser}></Welcome>
        ) : (
          <ChatContainer
            currentChat={currentChat}
            currentUser={currentUser}
            // socket={socket}
          ></ChatContainer>
        )}
      </div>
    </Container>
  );
}
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
   
  }
`;
export default Chat;
