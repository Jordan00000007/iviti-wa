import SimpleLayout from '../components/Layouts/SimpleLayout';
import CustomButton from '../components/Buttons/CustomButton';
import CustomDrawingTest from '../components/Drawing/CustomDrawingTest';
import { Link,useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import log from "../utils/console";
import { deleteTask } from "../store/tasks";

function EditAiTask() {

    const params = useParams();
    const dispatch = useDispatch();
    const myData = useSelector((state) => state.tasks.data);
    const myStatus = useSelector((state) => state.tasks.status);
    const myIndex = myData.findIndex(item => item.task_uid === params.uuid);
    let myItem = myData[myIndex];

    const handleClickAdd = () => {
        console.log('Add Button clicked!');
    };

    const handleSubmit = () => {
        console.log('handle submit');
    };

    const handleDelete = () => {
        log('handle delete');
        log(params.uuid)
        dispatch(deleteTask(params.uuid));
        window.location.href="/";
    };

    return (  
        <SimpleLayout>
            <div className="container p-0">
                <div className="my-body">
                    <div className="row p-0 g-0 mb-3 mt-3">
                        <div className="col-12 d-flex justify-content-between align-items-center my-flex-gap">


                            <div className="my-body-title roboto-h2">
                                Edit
                            </div>

                            <div className='d-flex justify-content-start align-items-center'>
                                <CustomButton name='delete' onClick={handleDelete}></CustomButton>
                            </div>
                        </div>
                    </div>

                    <div className="row py-0">
                        <div className="col-12">
                            <hr className="my-divider" />
                        </div>
                    </div>

                    <div className="row py-3 mt-4">
                        <div className="col-12">
                            <hr className="my-divider" />
                        </div>
                    </div>

                    <div className="row p-0 g-0 mb-3">
                        <div className="col-12 d-flex justify-content-end align-items-center my-flex-gap gap-3">
                            <Link to="/">
                                <CustomButton name='cancel'></CustomButton>
                            </Link>

                            <CustomButton name='save' onClick={handleSubmit}></CustomButton>
                        </div>
                    </div>

                </div>
            </div>
        </SimpleLayout>
    );
}

export default EditAiTask;
