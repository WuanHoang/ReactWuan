import React, { useEffect, useState, useRef } from "react";
import { Button, Header, Segment, Comment, Form} from "semantic-ui-react";
import {addDoc, collection, serverTimestamp, onSnapshot, query,where, doc, orderBy, limit, getDoc} from "firebase/firestore";
import { auth, db } from "./FireBase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Room = () => {
  const navigate = useNavigate();
  const date = serverTimestamp();
  const dateScreen = new Date();
  const dateScreening = dateScreen.getHours() + ":" + dateScreen.getMinutes();
  const avatars = ['https://img.freepik.com/premium-vector/girl-s-face-with-beautiful-smile-female-avatar-website-social-network_499739-527.jpg?w=2000','https://img.freepik.com/premium-vector/portrait-young-man-with-beard-hair-style-male-avatar-vector-illustration_266660-423.jpg?w=2000']
  const [room, setRoom] = useState(localStorage.getItem('room'));
  const roomInputRef = useRef<any>(null);
  const [value, setValue] = useState<string>(""); // explicitly specify the type of value
  const [messages, setMessages] = useState<any[]>([]);
  const [username, setUsername] = useState('');
  const [avatarId,setAvatarId] = useState(3);
  const UID : string = localStorage.getItem("UID") || "null"
  const usernameRef = doc(db, "usernames", UID)

  const HandleUsername = async () =>{
    try {
      const docSnap = await getDoc(usernameRef);
      setUsername(docSnap.data()?.username);
      setAvatarId(docSnap.data()?.gender);
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
            Chatting in room {room} With Username:   "{username}"
          </Header>
        </Segment>
      <div style={{overflow: 'auto', height: 400 }}>
      {messages.map((message, index) => (
        <Comment key={index}>
          <Comment.Avatar src={avatars[message.avatarId]} />
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
        <Form.TextArea placeholder="Write your message here" style={{ maxHeight: 50 }} value={value} onChange={(e) => setValue(e.target.value)} onKeyPress = {handlePress} />
        <Button content='Sign Out'labelPosition="right" icon='sign-out' color="red" onClick={SignOut} />
        <Button content='Chat'labelPosition="right" icon='reply' color="green" onClick={()=> navigate('/chat')} />
        <Button content='Send' labelPosition='left' icon='send' primary onClick={handleSendMessage} />
        <Segment compact>
          <input ref = {roomInputRef} placeholder="Enter room"></input>
          
          <Button onClick={HandleRoomInput}>Join Room</Button>
        </Segment>
      </Form>
        
    </Comment.Group>
  );
};

export { Room };