import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {signInWithPopup, signOut} from "firebase/auth"
import { Button, Segment } from "semantic-ui-react";
import { auth, provider } from "./FireBase";

export function Auth() {
    const UID = localStorage.getItem("UID")
    const navigate = useNavigate();
    const HandleLogin = async () =>{
        try{
            const result = await signInWithPopup(auth, provider);
            localStorage.setItem("UID", result.user.uid);
            navigate('/Username');
        }catch(err){
            console.log(err);
        }
    }
    const HandleChat = () =>{
        navigate('/Chat');
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
        return(
            <> 
                <Segment textAlign="center" vertical placeholder color="blue">
                    <Button color="red" onClick={HandleLogin}>Log In With Google</Button>
                </Segment>
            </>
        )
    }else{
        return( 
        <>
            <Segment >
                <Button color="blue" onClick={HandleChat}>Start Chatting</Button>
                <Button color="red" onClick={SignOut}>Sign Out</Button>
            </Segment>
        </>
        )
    }
}
