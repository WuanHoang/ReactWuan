import React, { useEffect, useState, useRef } from "react";
import { Button, Header, Segment, Comment, Form } from "semantic-ui-react";
import {addDoc, getDoc , collection, serverTimestamp, onSnapshot, query,where, doc, orderBy, limit, getDocs} from "firebase/firestore";
import { auth, db } from "./FireBase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const UID : string = localStorage.getItem("UID") || "null"
const usernameRef = doc(db, "usernames", UID)

var username = '';
const HandleUsername = async () =>{
  try {
    const docSnap = await getDoc(usernameRef);
    username = docSnap.data()?.username;
    console.log(username)
  }catch(err){
    console.log(err);
  }
}

const Chat: React.FC = () => {
  HandleUsername();
  const navigate = useNavigate();
  const date = serverTimestamp();
  const dateScreen = new Date();
  const dateScreening = dateScreen.getHours() + ":" + dateScreen.getMinutes();
  const room = 0;
  const [value, setValue] = useState("")
  const [messages, setMessages] = useState<any[]>([]);
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

  const handleSendMessage = async (e : React.ChangeEvent<any>) => {
    e.preventDefault();

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
  //handle scroll to bottom of screen
    const divRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      divRef.current?.scrollIntoView({ behavior: 'smooth' , block: "end", inline: "nearest"});
    });


  const SignOut = async () =>{
    try{
        await signOut(auth);
        localStorage.removeItem("UID");
        navigate('/')
    }catch(err){
        console.log(err);
    }
  }

  const ChangeRoom = () => {
    navigate('/Room');
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
  
  if(!UID){
    return <h1>please login first</h1>
  }
  return (
    <Comment.Group>
        <Segment>
          <Header textAlign="center" color="blue">
            Chatting With Username:   "{username}"
          </Header>
        </Segment>
      <div style={{overflow: 'auto', height: 400 }}>
      {messages.map((message, index) => (
        <Comment key={index}>
          <Comment.Avatar src='https://i.bloganchoi.com/bloganchoi.com/wp-content/uploads/2022/02/avatar-trang-y-nghia.jpeg?fit=512%2C20000&quality=95&ssl=1' />
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
        <Form.TextArea value={value} onChange={(e) => setValue(e.target.value)} onKeyPress={handlePress} />
        <Button content='Send Message' labelPosition='left' icon='edit' primary onClick={handleSendMessage} />
        <Button content='Sign Out'labelPosition="right" icon='delete' color="red" onClick={SignOut} />
        <Button content='Room'labelPosition="right" icon='check' color="green" onClick={ChangeRoom} />
        
      </Form>
        
    </Comment.Group>
  );
};

export { Chat };
