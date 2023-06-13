import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import update from 'react-addons-update';
import log from "../utils/console";
import moment from 'moment';

const TASK_SERVER = process.env.REACT_APP_TASK_SERVER;
const STREAM_SERVER = process.env.REACT_APP_STREAM_SERVER;
const TASK_URL = `${TASK_SERVER}`;
const STREAM_URL =  `${STREAM_SERVER}/stream`;
const DEVICE_URL = `${TASK_SERVER}/device`;


export const getAllApplications = createAsyncThunk('applications/getAllApplications', async () => {
    const response = await fetch(`${TASK_URL}/apps/support`);
    return response.json();
});

export const getApplication = createAsyncThunk('applications/getApplication', async (uuid) => {
    log(`--- get app start ---`)
    const response = await fetch(`${TASK_URL}/apps/${uuid}`);
    return response.json();
});


const applicationsSlice = createSlice({
    name: "applications",
    initialState: { status: 'idle', data: [] ,options: [], error: null,areas:[] },
    reducers: {
    },
    extraReducers: (builder) => {

        // ---- get all applications ---
        builder.addCase(
            getAllApplications.fulfilled,
            (state, action) => {
                log('--- get all applications fulfilled ---');
               
                if (action.payload.status_code===200){
                    let myData=[];
                    Object.keys(action.payload.data).map((e, i) => {
                        myData.push([action.payload.data[e].id,action.payload.data[e].uid])
                    })
                    state.options = myData;
                    state.data = action.payload.data;
                    state.status = 'success';
                    
                  
                }else{
                  
                    log('--- other ---')
                }
                
            }
        )
        builder.addCase(
            getAllApplications.pending,
            (state, {meta}) => {
                log('--- get all applications pending ---');
                state.status = 'loading';
                //return updateTaskStatus(state,meta.arg,'set_stream_delete_loading');
            }
        )
        builder.addCase(
            getAllApplications.rejected,
            (state, action ) => {
                log(`--- get all applications rejected ---`);
                state.status = 'rejected';
                // return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
            }
        )

          // ---- get application ---
          builder.addCase(
            getApplication.fulfilled,
            (state, action) => {
                log('--- get application fulfilled ---');
                log(action.payload.data)
               
                if (action.payload.status_code===200){

                    const areas=action.payload.data[0].app_setting.application.areas;
                    state.areas=action.payload.data[0].app_setting.application.areas;
                 
                    state.status = 'success';
                    
                }else{
                    
                    log('--- other ---')
                }
                
            }
        )
        builder.addCase(
            getApplication.pending,
            (state, {meta}) => {
                log('--- get application pending ---');
                state.status = 'loading';
                //return updateTaskStatus(state,meta.arg,'set_stream_delete_loading');
            }
        )
        builder.addCase(
            getApplication.rejected,
            (state, action ) => {
                log(`--- get application rejected ---`);
                state.status = 'rejected';
                // return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
            }
        )

    },



});
export const applicationsActions = applicationsSlice.actions;
export default applicationsSlice.reducer;
