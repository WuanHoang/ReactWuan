import { useState, useEffect, useRef } from "react"
import { Input, Button, Form, Header } from "semantic-ui-react"
import { auth, db } from "./FireBase";
import { collection, setDoc, doc} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export function Username() {
    const [username, setUsername] = useState('');
    const usernameRef = collection(db, 'usernames')
    const navigate = useNavigate();
    const HandleUsername = async (e : React.ChangeEvent<any>) =>{
        e.preventDefault();
        if(username === "") return;

        await setDoc(doc(usernameRef, auth.currentUser?.uid),{
            username: username
        })
        navigate('/Chat')
    }
    return (
        <>
            <Header>Please type in username</Header>
            <Input onChange={(e) => {setUsername(e.target.value)}}></Input>
            <Button onClick={HandleUsername}>Ok</Button>
        </>
    )
}
