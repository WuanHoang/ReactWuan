import {Routes, Route} from 'react-router-dom'
import Test from "./ListGroup";
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
        <h1> LIST GROUP </h1>
        <Routes>
          <Route path="/Features" element = {<Test item = {props} heading='test'></Test>}/>
          <Route path="/Pricing" element = {<Test item = {props2} heading='test'></Test>}/>
          <Route path="/Home" element = {<Test item = {props3} heading='test'></Test>}/>
        </Routes>
      </div>
    </>
  )
}

export default App;