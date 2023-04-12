import { createRef } from "react";
import { Menu, Tab, Sticky } from "semantic-ui-react";
import {ContentLayout1, ContentLayout2} from './Content';

const panes = [
    { menuItem: 'Tab 1', render: () => <ContentLayout1></ContentLayout1> },
    { menuItem: 'Tab 2', render: () => <ContentLayout2></ContentLayout2> },
    { menuItem: 'Tab 3', render: () => 'Hello world' },
    ]

function NavBar() {
    const contextRef = createRef();
    return (
        <>
        
        <Tab menu={{pointing: true} } panes={panes}/>
        </>
    )
  
}

export default NavBar;
