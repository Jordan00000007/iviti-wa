import React,{useState} from 'react';
import log from "../../utils/console";
import CustomHeader from '../Header/CustomHeader';

const SimpleLayout = ({ children }) => {

    const [innerHeight, setInnerHeight] = useState(window.innerHeight-56)

    const handleResize=(event)=>{
       
        setInnerHeight(window.innerHeight-56)
    }


    window.addEventListener('resize', handleResize)

    return (
        <div>
            <div style={{background:'var(--highlight_1)'}}>
                <div className="container p-0" >
                    <CustomHeader />
                </div>
            </div>
            <div style={{background:'var(--base_1)',overflowY: 'scroll',height:innerHeight}}  data-bs-spy="scroll">
                <div className="container p-0">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default SimpleLayout;