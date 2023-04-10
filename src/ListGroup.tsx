import { useState } from "react";

interface Prop {
    item: string[];
    heading: string;
}



// const items = ["Mars", 'Earth', 'Venus', 'Apollo'];


function listPrint(item: string, count: number) {
    
    
}


function Test(prop: Prop) {
    const [countNumber, setCountNumber] = useState(-1);
    return (
        <>
            <ul className="list-group">
                {prop.item.map((item, count) => (
                    <li className={countNumber === count ? 'list-group-item active' : 'list-group-item'} key={item} onClick={()=> setCountNumber(count)}>{item}</li>
                ))}
            </ul>
            
        </>
    );
}

export default Test;