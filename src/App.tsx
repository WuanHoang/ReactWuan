import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { useState } from 'react';
import { Chat } from './Chat'
import { Auth } from './Auth';

function App(){
  return(
    <>
        <Routes>
            <Route path="/" Component={Auth}/>
            <Route path="/Chat" Component={Chat}/>
        </Routes>
    </>
  )
}

export default App;