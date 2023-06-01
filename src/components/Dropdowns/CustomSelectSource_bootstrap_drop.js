import React, { useState } from 'react'
import { extendTheme, CssVarsProvider } from '@mui/joy/styles';
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import log from "../../utils/console";
import LabelButton from '../../components/Buttons/LabelButton';
import SourcePanel from '../../components/Panel/SourcePanel';



function CustomSelectSource(props) {

    const [placeHolder, setPlaceHolder] = useState(props.placeHolder);

    const handleSelectChange = (event, value) => {

        log('select change');

    };

    const handleChange = (event, value) => {

        log(event);

    };

    const handleClick = (event, value) => {

        log(event);

    };

    const handleListBoxOpenChange = (event, value) => {

        log('handle List Box Open Change');
        //event.stopPropagation();
        log(event)

    };

    return (
        <div>
            <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" onMouseDown={(event) => {
                            // don't open the popup when clicking on this button
                            event.stopPropagation();
                            event.preventDefault();
                            log('select mouse down')
                            return false;
                        }}>
                    Dropdown button
                </button>
                <div class="dropdown-menu">
                    <form class="px-4 py-3">
                        <div class="mb-3">
                        <label for="exampleDropdownFormEmail1" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="exampleDropdownFormEmail1" placeholder="email@example.com" />
                        </div>
                        <div class="mb-3">
                        <label for="exampleDropdownFormPassword1" class="form-label">Password</label>
                        <input type="password" class="form-control" id="exampleDropdownFormPassword1" placeholder="Password" />
                        </div>
                        <div class="mb-3">
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="dropdownCheck" />
                            <label class="form-check-label" for="dropdownCheck">
                            Remember me
                            </label>
                        </div>
                        </div>
                        <button type="submit" class="btn btn-primary">Sign in</button>
                    </form>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="#">New around here? Sign up</a>
                    <a class="dropdown-item" href="#">Forgot password?</a>
                    </div>
            </div>
        </div>

    );
}

export default CustomSelectSource;