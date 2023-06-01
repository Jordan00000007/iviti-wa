import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import update from 'react-addons-update';
import log from "../utils/console";
import moment from 'moment';

const TASK_SERVER = process.env.REACT_APP_TASK_SERVER;
const STREAM_SERVER = process.env.REACT_APP_STREAM_SERVER;
const TASK_URL = `${TASK_SERVER}`;
const STREAM_URL =  `${STREAM_SERVER}/stream`;
const DEVICE_URL = `${TASK_SERVER}/device`;




export const getAllModels = createAsyncThunk('models/getAllModels', async () => {
    const response = await fetch(`${TASK_URL}/models`);
    return response.json();
});


const modelsSlice = createSlice({
    name: "models",
    initialState: { status: 'idle', data: [], options: [], error: null },
    reducers: {
    },
    extraReducers: (builder) => {

        // ---- get all models ---
        builder.addCase(
            getAllModels.fulfilled,
            (state, action) => {

                if (action.payload.status_code===200){
                    let myData=[];
                  
                    Object.keys(action.payload.data).map((e, i) => {
                        myData.push([action.payload.data[e].uid,action.payload.data[e].name]);
                        
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

    },



});
export const modelsActions = modelsSlice.actions;
export default modelsSlice.reducer;
