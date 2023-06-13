import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus,faHouse } from '@fortawesome/free-solid-svg-icons';
import {ReactComponent as Icon_Add} from '../../assets/Icon_Add.svg';
import {ReactComponent as Icon_Back} from '../../assets/Icon_Back.svg';


const CustomButton = (props) => {

   // const {name}=props;

        if (props.name==="edit"){
            return (
                <button onClick={props.onClick} className="my-button-edit" >
                    Edit
                </button>
            )
        }

        if (props.name==="view"){
            return (
                <button onClick={props.onClick} className="my-button-view roboto-b1" style={(props.status!=='running')?{width:'115px'}:{width:'240px'}} disabled={props.disabled}>
                    View
                </button>
            )
        }

        if (props.name==="add"){
            return (
                <button onClick={props.onClick} className="p-0 border-0">
                    <Icon_Add className="my-button-add p-0" fill="var(--base_2)"/>
                </button>
            )
        }

        if (props.name==="back"){
            return (
                <button onClick={props.onClick} className="p-0 border-0">
                    <Icon_Back className="my-button-back p-0"  fill="var(--on_color_1)"/>
                </button>
            )
        }

        if (props.name==="cancel"){
            return (
                <button onClick={props.onClick} className="my-button-cancel p-0 border-0">
                    Cancel
                </button>
            )
        }

        if (props.name==="submit"){

            if (props.disabled){
                return (
                    <button className="my-button-disable p-0 border-0">
                        Add
                    </button>
                )
            }else{
                return (
                    <button onClick={props.onClick} className="my-button-submit p-0 border-0">
                        Add
                    </button>
                )
            }
            
        }

        if (props.name==="save"){
            return (
                <button onClick={props.onClick} className="my-button-submit p-0 border-0">
                    Save
                </button>
            )
        }

        if (props.name==="delete"){
            return (
                <button onClick={props.onClick} className="my-button-submit p-0 border-0">
                    Delete
                </button>
            )
        }


        return (
            <button onClick={props.onClick} className={props.className}>
            </button>
        );

       
    
};

CustomButton.propTypes = {
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
}

export default CustomButton;