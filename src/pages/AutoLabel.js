import SimpleLayout from '../components/Layouts/SimpleLayout';
import CustomButton from '../components/Buttons/CustomButton';
import { Link } from 'react-router-dom';

function AutoLabel() {

    const handleClickAdd = () => {
        console.log('Add Button clicked!');
    };

    return (
        <SimpleLayout>
            <div className="container p-0">
                <div className="my-body">
                    <div className="row p-0 g-0 mb-3 mt-3">
                        <div className="col-12 d-flex justify-content-between">
                            <div className="my-body-title">
                                N/A
                            </div>
                            
                            <Link to="/">
                                <CustomButton onClick={handleClickAdd} disabled={false} name="back" />
                            </Link>
                            
                        </div>
                    </div>
                    <div className="row p-0 g-2">
                        <h1>Page Not Found</h1>
                    </div>
                </div>
            </div>
        </SimpleLayout>
    );
}

export default AutoLabel;
