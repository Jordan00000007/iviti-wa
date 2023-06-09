import React, { useRef, useState, useEffect } from 'react';
import Tooltip from '@mui/joy/Tooltip';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Chip from '@mui/joy/Chip';

const DrawingTooltip = ({ children, title }) => {

    return (
        <Tooltip
            title={
                <Box sx={{ display: 'flex', gap: 1, width: '100%', mt: 0, backgroundColor: 'transparent', height: '28px' }}>

                    <Chip color="var(--base_2)" sx={{ ml: 0, mt: 0, fontSize: '15px', padding: 0, height: '20px', lineHeight: '20px' }}>
                        {title}
                    </Chip>

                    <Box sx={{ backgroundColor: '#979CB5', width: '20px', height: '20px', paddingTop: '3px', paddingLeft: '6px', borderRadius: '4px', mt: '5px', fontSize: '13px' }}>{title.substring(0, 1)}</Box>
                </Box>

            }
            placement="right"  
            slotProps={{
                root: {
                    sx: {
                        backgroundColor: '#16272ECC',
                        padding: '0px 5px 2px 10px',
                        borderRadius: 6,

                    },
                },
            }}
        >
            {children}
        </Tooltip>
    );
};

export default DrawingTooltip;