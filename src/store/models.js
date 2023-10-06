import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import update from 'react-addons-update';
import log from "../utils/console";
import moment from 'moment';

const TASK_SERVER = process.env.REACT_APP_TASK_SERVER;
const STREAM_SERVER = process.env.REACT_APP_STREAM_SERVER;
const TASK_URL = `${TASK_SERVER}`;
const STREAM_URL =  `${STREAM_SERVER}/stream`;
const DEVICE_URL = `${TASK_SERVER}/device`;

export const importModel = createAsyncThunk('models/importModel', async (myFormData) => {
    const response = await fetch(`${TASK_URL}/models`, {
        method: 'POST',
        body: myFormData,
    });
    return response.json();
});

export const deleteModel = createAsyncThunk('models/deleteModel', async (uid) => {
    const myData={};
    myData.uids=[uid];
    const response = await fetch(`${TASK_URL}/models`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(myData),
    });
    return response.json();
});

export const deleteProcess = createAsyncThunk('models/deleteProcess', async (uid) => {
   
    const response = await fetch(`${TASK_URL}/process/${uid}`, {
        method: 'DELETE'
    });
    return response.json();
});


export const getAllModels = createAsyncThunk('models/getAllModels', async () => {
    const response = await fetch(`${TASK_URL}/models`);
    return response.json();
});


const modelsSlice = createSlice({
    name: "models",
    initialState: { status: 'idle', data: [], options: [], error: null, importStatus:'idel', importMessage:'', importUid:'', deleteStatus:'idel',deleteMessage:'' },
    reducers: {
        resetProcessStatus(state) {
        
            state.importUid = '';
            state.importMessage='';
            state.importStatus='idel';
        },
    },
    extraReducers: (builder) => {

        // ---- get all models ---
        builder.addCase(
            getAllModels.fulfilled,
            (state, action) => {
                log('--- get all models success ---');
                log(action.payload)
                if (action.payload.status_code===200){
                    let myData=[];
                  
                    Object.keys(action.payload.data).map((e, i) => {
                        myData.push([action.payload.data[e].uid,action.payload.data[e].name,action.payload.data[e].default_model]);
                        
                    })
                    
                    state.data = action.payload.data;
                    state.options = myData;
                    state.status = 'success';
                    
                }else{
                    //return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
                    log('--- models other ---')
                }
                
            }
        )
        builder.addCase(
            getAllModels.pending,
            (state, {meta}) => {
                log('--- get all models pending ---');
                state.status = 'loading';
                //return updateTaskStatus(state,meta.arg,'set_stream_delete_loading');
            }
        )
        builder.addCase(
            getAllModels.rejected,
            (state, action ) => {
                log(`--- get all models rejected ---`);
                state.status = 'rejected';
                // return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
            }
        )

        // ---- import model ---
        builder.addCase(
            importModel.fulfilled,
            (state, action) => {

                log('--- import model success ---');

                if (action.payload.status_code===200){
                    // let myData=[];
                  
                    // Object.keys(action.payload.data).map((e, i) => {
                    //     myData.push([action.payload.data[e].uid,action.payload.data[e].name]);
                        
                    // })
                    
                    log('response data')
                    log(action.payload)
                    log(action.payload.data.uid)

                    state.importUid=action.payload.data.uid;
                    state.importMessage = 'Import model success';
                    state.importStatus = 'success';

                }else if (action.payload.status_code===500){
                    
                    log('error')
                    log(action.payload.message)

                    state.importMessage = action.payload.message;
                    state.importStatus = 'error';


                }else{
                    //return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
                    log('--- import model other ---')
                    state.importStatus = 'error';
                }
                
            }
        )
        builder.addCase(
            importModel.pending,
            (state, {meta}) => {
                log('--- import model pending ---');
                state.importStatus = 'loading';
               
            }
        )
        builder.addCase(
            importModel.rejected,
            (state, action ) => {
                log(`--- import model rejected ---`);
                state.importStatus = 'rejected';
                
            }
        )

        
        // ---- delete model ---
        builder.addCase(
            deleteModel.fulfilled,
            (state, action) => {

                log('--- delete model success ---');

                if (action.payload.status_code===200){
                    
                    log('response data')
                    log(action.payload.message)

                    state.deleteMessage = 'Delete model success';
                    state.deleteStatus = 'success';

                }else if (action.payload.status_code===500){
                    
                    log('error')
                    log(action.payload.message)

                    state.deleteMessage = action.payload.message;
                    state.deleteStatus = 'error';


                }else{
                    //return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
                    log('--- delete model other ---')
                    state.deleteStatus = 'error';
                }
                
            }
        )
        builder.addCase(
            deleteModel.pending,
            (state, {meta}) => {
                log('--- delete model pending ---');
                state.deleteStatus = 'loading';
               
            }
        )
        builder.addCase(
            deleteModel.rejected,
            (state, action ) => {
                log(`--- delete model rejected ---`);
                state.deleteStatus = 'rejected';
                
            }
        )

        // ---- delete process ---
        builder.addCase(
            deleteProcess.fulfilled,
            (state, action) => {


                if (action.payload.status_code===200){
                    
                    log('--- delete process success ---')
                    log(action.payload.message)

                }else if (action.payload.status_code===500){
                    
                    log('--- delete process other error ---')
                    log(action.payload.message)

                    
                }else{
                    //return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
                    log('--- delete process other error ---')
                    
                }
                
            }
        )
        builder.addCase(
            deleteProcess.pending,
            (state, {meta}) => {
                log('--- delete process pending ---');
               
               
            }
        )
        builder.addCase(
            deleteProcess.rejected,
            (state, action ) => {
                log(`--- delete process rejected ---`);
               
                
            }
        )

    },



});
export const modelsActions = modelsSlice.actions;
export const { resetProcessStatus } = modelsSlice.actions;
export default modelsSlice.reducer;
