import { useState } from "react";

interface Prop {
    item: string[];
    heading: string;
}



const items = ["Mars", 'Earth', 'Venus', 'Apollo'];


function listPrint(item: string, count: number) {
    
    
}


function Test() {
    const [countNumber, setCountNumber] = useState(-1);
    return (
        <>
        <h1> LIST GROUP </h1>
            <ul className="list-group">
                {items.map((item, count) => (
                    <li className={countNumber === count ? 'list-group-item active' : 'list-group-item'} key={item} onClick={()=> setCountNumber(count)}>{item}</li>
                ))}
            </ul>
            
        </>
    );
}

export default Test;