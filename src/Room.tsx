import React, { useEffect, useState, useRef } from "react";
import { Input, Button, Header, Segment, Comment, Form } from "semantic-ui-react";
import {addDoc, collection, serverTimestamp, onSnapshot, query,where, doc, orderBy, limit, getDoc} from "firebase/firestore";
import { auth, db } from "./FireBase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Room = () => {
  const navigate = useNavigate();
  const date = serverTimestamp();
  const dateScreen = new Date();
  const dateScreening = dateScreen.getHours() + ":" + dateScreen.getMinutes();
  const [room, setRoom] = useState(localStorage.getItem('room'));
  const roomInputRef = useRef<any>(null);
  const [value, setValue] = useState<string>(""); // explicitly specify the type of value
  const [messages, setMessages] = useState<any[]>([]);
  const [username, setUsername] = useState('');
  const UID : string = localStorage.getItem("UID") || "null"
  const usernameRef = doc(db, "usernames", UID)

  const HandleUsername = async () =>{
    try {
      const docSnap = await getDoc(usernameRef);
      setUsername(docSnap.data()?.username);
    }catch(err){
      console.log(err);
    }
  }
  HandleUsername();
  const messageRef = collection(db, "messages");

  useEffect(() =>{
    const queryMessage = query(messageRef, where("room", "==", room) , orderBy("timeStamp",'desc'), limit(25))
    const unsubcribe = onSnapshot(queryMessage, (snapshot) =>{
      let message: any[] = [];
      snapshot.forEach((doc)=>{
        message.push({...doc.data(), id: doc.id})
      })
      message.reverse();
      setMessages(message);
    });
    return () => unsubcribe();

  },[])
  
   //handle scroll to bottom of screen
   const divRef = useRef<HTMLDivElement>(null);
   useEffect(() => {
     divRef.current?.scrollIntoView({ behavior: 'smooth' , block: "end", inline: "nearest"});
   });

  const handleSendMessage = async (e : React.ChangeEvent<any>) => {
    e.preventDefault();
    console.log(room);
    if( value === "") return;

    await addDoc(messageRef,{
      message: value,
      username: username,
      date: dateScreening,
      room: room,
      timeStamp: date,
      UID: UID
    })
    setValue("")
  };

  const HandleRoomInput = () =>{
    localStorage.setItem("room", roomInputRef.current.value);
    navigate(0);
  }

  const handlePress = async  (e: React.KeyboardEvent<any>)=>{
    if(e.key === 'Enter'){
      if( value === "") return;
      await addDoc(messageRef,{
        message: value,
        username: username,
        date: dateScreening,
        room: room,
        timeStamp: date,
        UID: UID
      })
      setValue("")
    }
  }

  const SignOut = async () =>{
    try{
        await signOut(auth);
        localStorage.removeItem("UID");
        navigate('/')
    }catch(err){
        console.log(err);
    }
  }
  
  if(!UID){
    return <h1>please login first</h1>
  }
  return (
    <Comment.Group>
      <Segment>
          <Header textAlign="center" color="blue">
            Chatting in {room} With Username:   "{username}"
          </Header>
        </Segment>
      <div style={{overflow: 'auto', height: 400 }}>
      {messages.map((message, index) => (
        <Comment key={index}>
          <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
          <Comment.Content>
            <Comment.Author as='a'>{message.username}</Comment.Author>
            <Comment.Metadata>
              <div>{message.date}</div>
            </Comment.Metadata>
            <Comment.Text>{message.message}</Comment.Text>
          </Comment.Content>
        </Comment>
      ))}
      <div  ref={divRef}></div>
      </div>

      <Form reply>
        <Form.TextArea  value={value} onChange={(e) => setValue(e.target.value)} onKeyPress = {handlePress} />
        <Button content='Send Message' labelPosition='left' icon='edit' primary onClick={handleSendMessage} />
        <Button content='Sign Out'labelPosition="right" icon='delete' color="red" onClick={SignOut} />
        <Button content='Chat'labelPosition="right" icon='check' color="green" onClick={()=> navigate('/chat')} />
        <Segment>
          <input ref = {roomInputRef}></input>
          <Button onClick={HandleRoomInput}>Join</Button>
        </Segment>
      </Form>
        
    </Comment.Group>
  );
};

export { Room };