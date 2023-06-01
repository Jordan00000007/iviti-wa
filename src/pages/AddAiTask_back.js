import SimpleLayout from '../components/Layouts/SimpleLayout';
import CustomButton from '../components/Buttons/CustomButton';
import LabelButton from '../components/Buttons/LabelButton';
import CustomInput from '../components/Inputs/CustomInput';
import log from "../utils/console";
import { Link } from 'react-router-dom';
import CustomSelect from '../components/Dropdowns/CustomSelect';
import Sample from '../assets/sample.png';
import {ReactComponent as ToolIcon_Point}  from '../assets/Icon_Point.svg';
import {ReactComponent as ToolIcon_Pen} from '../assets/Icon_Pen.svg';
import {ReactComponent as ToolIcon_PenAdd} from '../assets/Icon_PenAdd.svg';
import {ReactComponent as ToolIcon_Line} from '../assets/Icon_Line.svg';
import {ReactComponent as ToolIcon_Delete} from '../assets/Icon_Delete.svg';

function AddAiTask() {

    const dataArr1=['model 1','model 2'];
    const dataArr2=['application 1','application 2'];
    const dataArr3=['CPU','GPU'];
    const dataArr4=['Area 1','Area 2'];

    const handleClickAdd = () => {
        log('Add Button clicked!');
    };

    const handleModelChange = () => {
        log('Model Changed!');
    };

    const handleApplicationChange = () => {
        log('Application Changed!');
    };

    const handleAcceleratorsChange= () => {
        log('Accelerators Changed!');
    };

    const handleSubmit= () => {
        log('Submit Click');
    };

    return (
        <SimpleLayout>
            <div className="container p-0">
                <div className="my-body">
                    <div className="row p-0 g-0 mb-3 mt-3">
                        <div className="col-12 d-flex justify-content-start align-items-center my-flex-gap">
                          

                            <div className="my-body-title roboto-h2">
                                Add AI task
                            </div>

                            <div className='d-flex justify-content-start align-items-center'>

                            </div>
                        </div>
                    </div>
                    
                    <div className="row py-0">
                        <div className="col-12">
                            <hr className="my-divider"/>
                        </div>
                    </div>  


                    <div className="row mb-2 p-2">
                        <div className="col-12 d-flex justify-content-start align-items-center my-flex-gap py-2">
                            <div className="my-sub-title">
                                General
                            </div>
                        </div>

                        <div className="col-12 d-flex justify-content-start align-items-center my-flex-gap gap-3 py-3">
                            <div>
                                <div className='my-input-title roboto-b2 py-1'>
                                    AI task name *
                                </div>
                                <div>
                                    <CustomInput defaultValue="" width="240"></CustomInput>
                                </div>
                            </div>
                            <div>
                                <div className='my-input-title roboto-b2 py-1'>
                                    Source *
                                </div>
                                <div>
                                    <CustomInput defaultValue="" width="240"></CustomInput>
                                </div>
                            </div>
                            <div>
                                <div className='my-input-title roboto-b2 py-1'>
                                    Model *
                                </div>
                                <div>
                                    <CustomSelect areaArr={dataArr1} width="240" height="52" fontSize="16" className="my-dropdown-select" onChange={handleModelChange} ></CustomSelect>
                                </div>
                            </div>
                             <div>
                                <div className='my-input-title roboto-b2 py-1'>
                                    Application *
                                </div>
                                <div>
                                    <CustomSelect areaArr={dataArr2} width="240" height="52" fontSize="16" className="my-dropdown-select" onChange={handleApplicationChange} ></CustomSelect>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 d-flex justify-content-start align-items-center my-flex-gap gap-3">
                            <div>
                                <div className='my-input-title roboto-b2 py-1'>
                                    Confidence *
                                </div>
                                <div>
                                    <CustomInput defaultValue="0.9" width="240"></CustomInput>
                                </div>
                            </div>
                            <div>
                                <div className='my-input-title roboto-b2 py-1'>
                                    Accelerators *
                                </div>
                                <div>
                                    <CustomSelect areaArr={dataArr3} width="240" height="52" fontSize="16" className="my-dropdown-select" onChange={handleAcceleratorsChange} ></CustomSelect>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                   
                    
                  
                    <div className="row py-3 mt-3">
                        <div className="col-12">
                            <hr className="my-divider"/>
                        </div>
                    </div>  
                     

                    <div className="row p-2">
                        <div className="col-12 d-flex justify-content-start align-items-center">
                            <div className="my-sub-title">
                                Application
                            </div>
                        </div>
                    </div>  



                    <div className="row p-2 g-0 my-3 mb-4">
                            <div className="col-12 d-flex justify-content-between my-area-container bdr">

                                <table className='w-100' style={{border:'1px'}}>
                                    <tbody>
                                        <tr>
                                            <td className='my-area-p3-a'>
                                                <div className='w-100 h-100 d-flex flex-column p-0 align-items-center'>
                                                    <ToolIcon_Point className="my-tool-icon p-0 mt-3 mb-1" fill="var(--base_2)"/>

                                                    <ToolIcon_Pen className="my-tool-icon p-0 mt-2 mb-1" fill="var(--base_2)"/>

                                                    <ToolIcon_PenAdd className="my-tool-icon p-0 mt-2 mb-1" fill="var(--base_2)"/>

                                                    <ToolIcon_Line className="my-tool-icon p-0 mt-2 mb-1" fill="var(--base_2)"/>

                                                    <ToolIcon_Delete className="my-tool-icon p-0 mt-2 mb-1" fill="var(--base_2)"/>
                                                </div>
                                            </td>
                                            <td className='my-area-p3-b'>
                                                <div className='w-100 '>
                                                   <img src={Sample}></img>
                                                </div>
                                            </td>
                                            <td className='my-area-p3-c w-100'>
                                                <div className='w-100 h-100 d-flex flex-column p-0 align-items-start'>
                                                    <div className='my-area-p3-c1'>
                                                        <CustomSelect areaArr={dataArr4} width="280" height="48" fontSize="20" className="my-dropdown-select" onChange={handleAcceleratorsChange} ></CustomSelect>
                                                    </div>
                                                    <div className='my-area-p3-c2'>
                                                        C-2
                                                    </div>
                                                    <div className='my-area-p3-c3'>
                                                        <div className='my-area-p3-c3-1'>
                                                            Line Relation
                                                        </div>
                                                        <div className='my-area-p3-c3-1 d-flex flex-row p-2 gap-2'>
                                                            <LabelButton name="Line A"></LabelButton>
                                                            <LabelButton name="Line B"></LabelButton>
                                                            <CustomInput defaultValue="" width="128" height="36"></CustomInput>
                                                        </div>
                                                        <div className='my-area-p3-c3-1 d-flex flex-row p-2 gap-2'>
                                                            <LabelButton name="Line B"></LabelButton>
                                                            <LabelButton name="Line A"></LabelButton>
                                                            <CustomInput defaultValue="" width="128" height="36"></CustomInput>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                    </div>

                    <div className="row py-3 mt-4">
                        <div className="col-12">
                            <hr className="my-divider"/>
                        </div>
                    </div>  

                    <div className="row p-0 g-0 mb-3">
                        <div className="col-12 d-flex justify-content-end align-items-center my-flex-gap gap-3">
                        <Link to="/">
                            <CustomButton name='cancel'></CustomButton>
                        </Link>
                         
                        <CustomButton name='submit' onClick={handleSubmit}></CustomButton>
                        </div>
                    </div>  


                </div>
            </div>
        </SimpleLayout>
    );
}

export default AddAiTask;
