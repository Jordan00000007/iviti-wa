import React, { useRef, useState, useEffect } from 'react';
import log from "../../utils/console";
import Tooltip from '@mui/joy/Tooltip';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Chip from '@mui/joy/Chip';
import ColorfulPicker from '../../components/ColorPicker/ColorfulPicker';

const ColorTooltip = ({ children, colorItem }) => {

    const [open, setOpen] = useState(false);

    

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
                <ColorfulPicker defaultColor={colorItem.color} />
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