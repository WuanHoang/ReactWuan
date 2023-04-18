import React, { useEffect, useState, useRef } from "react";
import { Button, Header, Segment, Comment, Form } from "semantic-ui-react";
import {addDoc, getDoc , collection, serverTimestamp, onSnapshot, query,where, doc, orderBy, limit, getDocs} from "firebase/firestore";
import { auth, db } from "./FireBase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";


const Chat: React.FC = () => {
  const UID : string = localStorage.getItem("UID") || "null"
  const navigate = useNavigate();
  const date = serverTimestamp();
  const avatars = ['https://img.freepik.com/premium-vector/girl-s-face-with-beautiful-smile-female-avatar-website-social-network_499739-527.jpg?w=2000','https://img.freepik.com/premium-vector/portrait-young-man-with-beard-hair-style-male-avatar-vector-illustration_266660-423.jpg?w=2000']
  const dateScreen = new Date();
  const dateScreening = dateScreen.getHours() + ":" + dateScreen.getMinutes();
  const room = 0;
  const [value, setValue] = useState("")
  const [messages, setMessages] = useState<any[]>([]);
  const [username, setUsername] = useState('');
  const [avatarId,setAvatarId] = useState(3);
  const messageRef = collection(db, "messages");
  const usernameRef = doc(db, "usernames", UID)

  const HandleUsername = async () =>{
    try {
      const docSnap = await getDoc(usernameRef);
      setUsername(docSnap.data()?.username)
      setAvatarId(docSnap.data()?.gender);
    }catch(err){
      console.log(err);
    }
  }
  HandleUsername();
  useEffect(() =>{
    let queryMessage = query(messageRef, where("room", "==", room) , orderBy("timeStamp",'desc'))
    const unsubscribe = onSnapshot(queryMessage, (snapshot) =>{
      let message: any[] = [];
      snapshot.forEach((doc)=>{
        message.push({...doc.data(), id: doc.id})
      })
      message.reverse();
      setMessages(message);
    });

    return () => unsubscribe();

  },[])

  const handleSendMessage = async (e : React.ChangeEvent<any>) => {
    e.preventDefault();

    if( value === "") return;

    await addDoc(messageRef,{
      message: value,
      username: username,
      avatarId: avatarId,
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
      divRef.current?.scrollIntoView({ behavior: 'smooth' , block: "start", inline: "nearest"});
    }, [messages])


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
        <div style={{overflow: 'auto', height: 300 }}>
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
        <Form.TextArea value={value} onChange={(e) => setValue(e.target.value)} onKeyPress={handlePress} />
        <Button content='Send Message' labelPosition='left' icon='edit' primary onClick={handleSendMessage} />
        <Button content='Sign Out'labelPosition="right" icon='delete' color="red" onClick={SignOut} />
        <Button content='Room'labelPosition="right" icon='check' color="green" onClick={ChangeRoom} />
        
      </Form>
        
    </Comment.Group>
  );
};

export { Chat };
