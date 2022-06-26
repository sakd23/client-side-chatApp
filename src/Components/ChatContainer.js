import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import ChatInput from './ChatInput'
import Logout from './Logout'
import Messages from './Messages'
import Pusher from 'pusher-js';

import { getAllMessagesRoute, sendMessageRoute } from '../utils/APIRoutes'
import {v4 as uuidv4} from 'uuid'
function ChatContainer({currentChat,currentUser,socket}) {
 
    const [messages,setMessages]=useState([])
    // const [arrivalMsg,setArrivalMsg]=useState(null)
    const scrollRef=useRef()

    const fetchMsgs= async()=>{
      const response=await axios.post(getAllMessagesRoute,{
          from:currentUser._id,
          to:currentChat._id,
      })
      // console.log(response.data)
      setMessages(response.data)
  }


  
    useEffect(()=>{
        
        if(currentChat){
            fetchMsgs()
        }
        
        }
    ,[currentChat])

    useEffect(()=>{
      fetchMsgs();
        },[])

        useEffect(()=>{

          const pusher = new Pusher('ec7b966a1c5d54153ecd', {
            cluster: 'ap2'
          });
        
          const channel = pusher.subscribe('messages');
          channel.bind('inserted', (newMessage)=> {
            // alert(JSON.stringify(newMessage));
            const newmsg={
              message:newMessage.message,
              fromSelf:newMessage.sender===currentUser._id,
            }
            setMessages([...messages,newmsg])
          });
        
          return ()=>{
        channel.unbind_all();
        channel.unsubscribe();
          }
        },[messages])

    const handleSendMsg=async (msg)=>{
        await axios.post(sendMessageRoute,{
            to:currentChat._id,
            from:currentUser._id,
            message:msg,
        })
      }
       
        // socket.current.emit("send-msg",{
        //     to:currentChat._id,
        //     from:currentUser._id,
        //     message:msg,
        // })
        // const msgs=[...messages]
        // msgs.push({fromSelf:true,message:msg})
        // setMessages(msgs)
    

    // useEffect(()=>{
    //     if(socket.current){
    //         socket.current.on("msg-recieve",(msg)=>{
    //          setArrivalMsg({fromSelf:false,message:msg})   
    //         })
    //     }
    // },[])

    // useEffect(()=>{
    //     arrivalMsg && setMessages((prev)=>[...prev,arrivalMsg])
    // },[arrivalMsg])

    useEffect(()=>{
       scrollRef.current?.scrollIntoView({behaviour:"smooth"}) 
    },[messages])
  return (
   <>
    {
        currentChat && (
            <Container>
      <div className='chat-header'>
        <div className='user-details'>
            <div className='avatar'>
            <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                    alt="avatar"></img>
            </div>
            <div className='username'>
                <h3>{currentChat.username}</h3>
            </div>
        </div>
        <Logout></Logout>
      </div>
       <div className='chat-messages'>

        {
            messages.map((msg)=>{
                return(
                    <div key={uuidv4()} ref={scrollRef} >
                        <div className={`message  ${msg.fromSelf?'sended':'recieved'}`}>
                            <div className='content'>
                                <p >
                                    {msg.message}
                                </p>
                            </div>
                        </div>
                    </div>
                )
            })
        }
       </div>
     <ChatInput handleSendMsg={handleSendMsg}/>
    </Container>
        )
    }
   </>
  )
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
export default ChatContainer
