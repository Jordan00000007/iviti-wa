import React, { useState } from 'react';

function ToggleButton({ onChange, status}) {
  const [isChecked, setIsChecked] = useState(status==="running"?true:false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
    {onChange(event)};
  };

  return (
    <label className="my-toggle-switch">
        <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
        <span className="my-toggle-slider round"></span>
    </label>
  );
}

export default ToggleButton;
