import React, { useState } from 'react';
import { ChromePicker } from 'react-color';

function ColorPicker() {
  const [color, setColor] = useState('#ffffff');

  const handleChange = (selectedColor) => {
    setColor(selectedColor.hex);
  };

  return (
    <div>
      <ChromePicker color={color} onChange={handleChange} />
      <p>Selected Color: {color}</p>
    </div>
  );
}

export default ColorPicker;