import SimpleLayout from '../components/Layouts/SimpleLayout';
import CustomButton from '../components/Buttons/CustomButton';
import ColorPicker from '../components/ColorPicker/ColorPicker';
import NginxSetting from '../components/Panel/NginxSetting';
import FullScreen from '../components/Test/FullScreen';
import { Link } from 'react-router-dom';
const TASK_SERVER = process.env.REACT_APP_TASK_SERVER;
const STREAM_SERVER = process.env.REACT_APP_STREAM_SERVER;

function Admin() {

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
                                Admin Info Page
                            </div>

                            <Link to="/">
                                <CustomButton onClick={handleClickAdd} disabled={false} name="back" />
                            </Link>

                        </div>
                    </div>
                    <div className="row p-0 g-2">
                        <div className="card border-0">
                            <div className="card-body my-card-l p-3">
                                <div className="row p-1 gy-0">
                                    <div className="col-4 roboto-h4 mb-2 ">
                                        Task Server
                                    </div>
                                    <div className="col-8 roboto-h4 mb-2 ">
                                        <div className="input-group mb-3">
                                            <input type="text" className="form-control" value={TASK_SERVER} disabled={true} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row p-1 gy-0">
                                    <div className="col-4 roboto-h4 mb-2 ">
                                        Stream Server
                                    </div>
                                    <div className="col-8 roboto-h4 mb-2 ">
                                        <div className="input-group mb-3">
                                            <input type="text" className="form-control" value={STREAM_SERVER} disabled={true} />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="row p-1 gy-0">
                        <div className="col-8 roboto-h4 mb-2 ">
                            <NginxSetting />
                        </div>
                    </div>

                    <div className="row p-1 gy-0">
                        <div className="col-8 roboto-h4 mb-2 ">
                            <FullScreen />
                        </div>
                    </div>

                </div>
            </div>
        </SimpleLayout>
    );
}

export default Admin;
