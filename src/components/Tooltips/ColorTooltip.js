import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import log from "../../utils/console";
import Tooltip from '@mui/joy/Tooltip';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Chip from '@mui/joy/Chip';
import ColorfulPicker from '../../components/ColorPicker/ColorfulPicker';
import { updateLabelColor } from "../../store/areas";
import { PropaneSharp } from '@mui/icons-material';


const ColorTooltip = ({ children, colorItem, onOutSideClick }) => {

    const [open, setOpen] = useState(false);

    const colorPaletteRef = useRef(null);

    const [listening, setListening] = useState(false);

    const dispatch = useDispatch();

    const handleSetColor = (myColor) => {

        const myColorItem = {};
        myColorItem.color = myColor;
        myColorItem.name = colorItem.name;
        myColorItem.key = colorItem.key;
        dispatch(updateLabelColor(myColorItem));


    }

    //useEffect(listenForOutsideClicks(listening, setListening, colorPaletteRef,open, setOpen));

    const outsideClick = (event) => {
        
        const cur = colorPaletteRef.current.getPicker().current.parentElement;
        const node = event.target;
        if (!cur.contains(node)) {
            setOpen(false);
            onOutSideClick();
        }
    }

    useEffect(() => {

        if (open) {
            window.addEventListener(`click`, outsideClick, false);
            return () => window.removeEventListener("click", outsideClick);
        }

    }, [open]);

    useEffect(() => {

        if (colorItem.open === true) {
            setOpen(true);
        } else {
            setOpen(false);
        }

    }, [colorItem]);

   

    return (
        
        <Tooltip
            title={
                <div>
                <div className='mb-2' style={{fontSize:16,color:'var(--on_color_1)'}}>Edit color palette</div>
                <ColorfulPicker defaultColor={colorItem.color} onChange={handleSetColor} ref={colorPaletteRef} />
                </div>
            }
            arrow
            open={open}
            variant="outlined"
            placement="top"
            slotProps={{
                root: {
                    sx: {
                        backgroundColor: 'white',
                        padding: '15px 15px 15px 15px',
                        borderRadius: 6,

                    },
                },
            }}
        >
            {children}
        </Tooltip>
        
    );
};

export default ColorTooltip;