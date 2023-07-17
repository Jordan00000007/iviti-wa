import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import log from "../../utils/console";
import { HexColorPicker } from "react-colorful";


const ColorfulPicker = forwardRef((props, ref) => {
    //const [color, setColor] = useState('#ffffff');
    const [color, setColor] = useState("#b32aa9");

    const valueToHex = (c) => {
        const hex = c.toString(16);
        return hex
    }

    const rgbToHex = (myColor) => {

        const rgb = myColor.substring(4, myColor.length-1)
                .replace(/ /g, '')
                .split(',');

        return '#'+(valueToHex(parseInt(rgb[0])) + valueToHex(parseInt(rgb[1])) + valueToHex(parseInt(rgb[2])));
    }

    const onColorPickerInfoChange = myColor => {
        console.log("Main Color Change", myColor.hex);
        setColor(myColor.hex)
    };

    useEffect(() => {

        log('default color')
      
        if (props.defaultColor!==null){
            setColor(rgbToHex(props.defaultColor));
            //log(rgbToHex(props.defaultColor))
        }


    }, [props.defaultColor]);

    useImperativeHandle(ref, () => ({

        getColor: () => {
            return color;
        }
    }));

    return (
        <div className="App">
            <HexColorPicker color={color} onChange={setColor} />
        </div>
    );
});

export default ColorfulPicker;