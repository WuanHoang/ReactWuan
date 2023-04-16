import React, { useEffect, useState } from "react";
import { Input, Button, Header, Segment, Comment, Form } from "semantic-ui-react";
import {addDoc, collection, serverTimestamp, onSnapshot, query, doc} from "firebase/firestore";
import { auth, db } from "./FireBase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Chat: React.FC = () => {
  const navigate = useNavigate();

  const date = serverTimestamp();

  const [value, setValue] = useState("")
  const [messages, setMessages] = useState<any[]>([]);

  const messageRef = collection(db, "messages");

  useEffect(() =>{
    const queryMessage = query(messageRef)
    onSnapshot(queryMessage, (snapshot) =>{
      let message: any[] = [];
      snapshot.forEach((doc)=>{
        message.push({...doc.data(), id: doc.id})
      })
      setMessages(message);
    })
  },[])

  const handleSendMessage = async (e : React.ChangeEvent<any>) => {
    e.preventDefault();

    if( value === "") return;

    await addDoc(messageRef,{
      message: value,
      timeStamp: date,
      UID: auth.currentUser?.uid
    })
    setValue("")
  };

  
  const SignOut = async () =>{
    try{
        await signOut(auth);
        localStorage.removeItem("UID");
        navigate('/')
    }catch(err){
        console.log(err);
    }
  }
  
  if(!auth.currentUser){
    return <h1>please login first</h1>
  }
  return (
    <Comment.Group>
      <Header as='h3' dividing>
        Chat
      </Header>
      {messages.map((message, index) => (
        <Comment key={index}>
          <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
          <Comment.Content>
            <Comment.Author as='a'>Anonymous</Comment.Author>
            <Comment.Metadata>
              <div>{message.message}</div>
            </Comment.Metadata>
            <Comment.Text>{message.message}</Comment.Text>
          </Comment.Content>
        </Comment>
      ))}

      <Form reply>
        <Form.TextArea value={value} onChange={(e) => setValue(e.target.value)} />
        <Button content='Send Message' labelPosition='left' icon='edit' primary onClick={handleSendMessage} />
        <Button content='Sign Out'labelPosition="right" icon='delete' primary onClick={SignOut} />
      </Form>
        
    </Comment.Group>
  );
};

export { Chat };
