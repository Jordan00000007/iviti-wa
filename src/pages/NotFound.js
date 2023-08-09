import SimpleLayout from '../components/Layouts/SimpleLayout';
import CustomButton from '../components/Buttons/CustomButton';
import WarnningPanel from '../components/Panel/WarnningPanel';
import { Link } from 'react-router-dom';


function NotFound() {

    const handleClickAdd = () => {
        console.log('Add Button clicked!');
    };

    
    return (
        <SimpleLayout>
            <div className="container p-0">
                <div className="my-body">
                    
                    <WarnningPanel message="Page not found."/>
                </div>
            </div>
        </SimpleLayout>
    );
}

export default NotFound;
