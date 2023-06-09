import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { useState } from 'react';
import { Chat } from './Chat'
import { Auth } from './Auth';
import { Room } from './Room';
import { Username } from './Username';

function App(){
  return(
    <>
        <Routes>
            <Route path="/" Component={Auth}/>
            <Route path="/Chat" Component={Chat}/>
            <Route path="/Room" Component={Room}/>
            <Route path="/Username" Component={Username}/>
        </Routes>
    </>
  )
}

export default App;