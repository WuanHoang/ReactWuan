import {Routes, Route} from 'react-router-dom'
import NavBar from "./NavBar";


function App()
{
  const props= ['orange', 'red' , 'green'];
  const props2 = ['blue', 'orange', 'green'];
  const props3 = ['red', 'green', 'white'];
  return (
    <>
      <div>
        <NavBar></NavBar>
      </div>
    </>
  )
}

export default App;