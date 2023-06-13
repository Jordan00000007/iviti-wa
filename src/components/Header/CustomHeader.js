import {ReactComponent as Logo} from '../../assets/logo.svg';

function CustomHeader() {

    const handleClick = (event) => {
        console.log('Head Button clicked!');
        //location.href="./inference"
        if (event.detail === 2) {
            console.log('double click');
          }
    };

    return (
        <div className="my-header">

            <div className="row p-0 g-0">
                <div className="col-12 p-0" onClick={handleClick}>
                    <Logo />
                </div>
            </div>

        </div>
    )

}

export default CustomHeader;