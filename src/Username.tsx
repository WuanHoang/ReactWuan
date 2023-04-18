import { useState} from "react"
import { Input, Button, Header, Segment, Form, Radio } from "semantic-ui-react"
import { auth, db } from "./FireBase";
import { collection, setDoc, doc} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export function Username() {
    const [username, setUsername] = useState('');
    const [gender, setGender] = useState(3);
    const usernameRef = collection(db, 'usernames')
    const navigate = useNavigate();
    const HandleUsername = async (e : React.ChangeEvent<any>) =>{
        e.preventDefault();
        if(username === "") return;

        await setDoc(doc(usernameRef, auth.currentUser?.uid),{
            gender: gender,
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
    const handleChange = (e : React.FormEvent<HTMLInputElement>, value: any) => {
        setGender(value.value);}
    return (
        <>
        <Segment textAlign="center" color="blue">
            <Header>Please type in username</Header>
            <Input value = {username} onChange={(e) => {setUsername(e.target.value)}} placeholder = 'username' onKeyPress = {handlePress}/>
            <Header>Please choose gender</Header>
            <Form>
                <Form.Field>
                    <Radio label="Male" name='radioGroup' value = {1} checked={gender === 1} onChange = {handleChange}></Radio>
                </Form.Field>
                <Form.Field>
                    <Radio label="Female" name='radioGroup' value = {0} checked={gender === 0} onChange = {handleChange}></Radio>
                </Form.Field>
            </Form>
            <Button onClick={HandleUsername}>Go</Button>
        </Segment>
        </>
    )
}
