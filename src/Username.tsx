import { useState} from "react"
import { Input, Button, Header, Segment } from "semantic-ui-react"
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
        setTimeout(() => navigate('/Chat'),1000) 
    }
    const handlePress = async (e : React.KeyboardEvent<any>) =>{
        if (username === "") return;
        if(e.key == 'Enter'){
            await setDoc(doc(usernameRef, auth.currentUser?.uid),{
                username: username
            })
            setTimeout(() => navigate('/Chat'),1000) 
        }
        
    } 
    return (
        <>
        <Segment textAlign="center" vertical placeholder color="blue">
            <Header>Please type in username</Header>
            <Input value = {username} onChange={(e) => {setUsername(e.target.value)}} placeholder = 'username' onKeyPress = {handlePress}/>
            <Button onClick={HandleUsername}>Go</Button>
        </Segment>
        </>
    )
}
