import React,{useState} from 'react';
import log from "../../utils/console";
import { ReactComponent as Icon_Edit } from '../../assets/Icon_Edit.svg';


const EditIcon = (props) => {

    const [isHovered,setIsHovered]= useState(false);

    const handleMouseEnter=()=>{
        setIsHovered(true);
    }

    const handleMouseLeave=()=>{
        setIsHovered(false);
    }

    return (
        <>
            <Icon_Edit onClick={props.onClick} fill={isHovered ? 'var(--on_color_1)' : 'var(--on_color_2)'} onMouseOver={handleMouseEnter} onMouseOut={handleMouseLeave}/> 
        </>
    );

   
};



export default EditIcon;