import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {signInWithPopup, signOut} from "firebase/auth"
import { Button } from "semantic-ui-react";
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
        navigate('/Username');
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
                <Button color="red" onClick={HandleLogin}>Log In With Google</Button>
            </>
        )
    }else{
        return( 
        <>
            <Button color="blue" onClick={HandleChat}>Start Chatting</Button>
            <Button color="red" onClick={SignOut}>Sign Out</Button>
        </>
        )
    }
}
