import React,{useState} from 'react';
import log from "../../utils/console";
import { ReactComponent as Icon_Delete } from '../../assets/Icon_Delete.svg';


const DeleteIcon = (props) => {

    const [isHovered,setIsHovered]= useState(false);

    const handleMouseEnter=()=>{
        setIsHovered(true);
    }

    const handleMouseLeave=()=>{
        setIsHovered(false);
    }

    return (
        <>
            <Icon_Delete onClick={props.onClick} fill={isHovered ? 'var(--on_color_1)' : 'var(--on_color_2)'} onMouseOver={handleMouseEnter} onMouseOut={handleMouseLeave}/> 
        </>
    );

   
};



export default DeleteIcon;