import '@tybys/vscode-color-picker/lib/vscode-color-picker.css'
import { ColorPicker } from '@tybys/vscode-color-picker'
import VscodeColorPicker from '@tybys/vscode-color-picker/lib/react/index.js'
import React, { useState,useEffect,useImperativeHandle,forwardRef } from 'react'
import ReactDOM from 'react-dom';

const VsColorPicker = forwardRef((props, ref) => {
    const [color, setColor] = useState('#aaaaaa');
    //const [color, setColor] = useState({ hex: "#FFFFFF" });

    const handleColorChange = myColor => {
        console.log("Main Color Change", myColor);
        //setColor(myColor.hex)
    };

    useImperativeHandle(ref, () => ({

        getColor: () => {
            return color;
        }
    }));

    return (
        <div>
            <VscodeColorPicker color={color} onChange={handleColorChange} />
        </div>
    );
});

export default VsColorPicker;