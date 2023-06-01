import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsersViewfinder, faArrowsToEye, faCarSide, faLandmark, faQuestion } from '@fortawesome/free-solid-svg-icons';

function ItemsDropdown() {


    const handleCheckboxChange = (event) => {

        console.log(`Toggle Button Changed :` + event.target.checked);

    };

    return (
        <select class="form-select custom-select" aria-label="Default select example">
            <option value="1">Area A</option>
            <option value="2">Area B</option>
            <option value="3">Area C</option>
        </select>
    );
}

export default ItemsDropdown;
