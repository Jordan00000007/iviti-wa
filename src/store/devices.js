import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import update from 'react-addons-update';
import log from "../utils/console";
import moment from 'moment';

const TASK_SERVER = process.env.REACT_APP_TASK_SERVER;
const STREAM_SERVER = process.env.REACT_APP_STREAM_SERVER;
const TASK_URL = `${TASK_SERVER}`;
const STREAM_URL =  `${STREAM_SERVER}/stream`;
const DEVICE_URL = `${TASK_SERVER}/device`;

export const getAllDevices = createAsyncThunk('devices/getAllDevices', async () => {
    // const response = await fetch(`${TASK_URL}/devices`);
    // return response.json();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
        const response = await fetch(`${TASK_URL}/devices`, {
            signal: controller.signal
        }).then((res) => res.json());
        //console.log(response);
        log(response);
        return response;
    } catch (error) {
        //console.error(error);
        log('error')
        log(error)
        const customResponse={};
        customResponse.status_code=408;
        customResponse.message="Request time out.";
        return customResponse;

    } finally {
        log('clear time out')
        clearTimeout(timeoutId);
    }
});


const devicesSlice = createSlice({
    name: "devices",
    initialState: { status: 'idle', data: [] ,options: [], error: null },
    reducers: {
    },
    extraReducers: (builder) => {

        // ---- get all devices ---
        builder.addCase(
            getAllDevices.fulfilled,
            (state, action) => {
                log('--- get all devices fulfilled ---');
                log(action.payload.data)

                if (action.payload.status_code===200){
                    //let myData=[['NVIDIA GeForce RTX 3080 Ti','NVIDIA GeForce RTX 3080 Ti']];
                    let myData=[];
                    Object.keys(action.payload.data).map((e, i) => {
                        myData.push([action.payload.data[e].uid,action.payload.data[e].uid])
                    })
                    state.options = myData;
                    state.data = action.payload.data;
                    state.status = 'success';
                    
                    //return updateTemperatureInfo(state,action.meta.arg,action.payload.data);
                }else if (action.payload.status_code===500){
                    
                    state.error= action.payload.message;
                    state.status = 'error';
                }else if (action.payload.status_code===408){
                    
                    state.error= action.payload.message;
                    state.status = 'rejected';
                }else{
                    //return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
                    log('--- other ---')
                    state.error='unknow';
                    state.status = 'error';
                }
                
            }
        )
        builder.addCase(
            getAllDevices.pending,
            (state, {meta}) => {
                log('--- get all devices pending ---');
                state.status = 'loading';
                //return updateTaskStatus(state,meta.arg,'set_stream_delete_loading');
            }
        )
        builder.addCase(
            getAllDevices.rejected,
            (state, action ) => {
                log(`--- get all devices rejected ---`);
                state.status = 'rejected';
                // return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
            }
        )

    },



});
export const devicesActions = devicesSlice.actions;
export default devicesSlice.reducer;
