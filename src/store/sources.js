import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import update from 'react-addons-update';
import log from "../utils/console";
import axios from "axios";
import moment from 'moment';
import { Buffer } from 'buffer';


const TASK_SERVER = process.env.REACT_APP_TASK_SERVER;
const STREAM_SERVER = process.env.REACT_APP_STREAM_SERVER;
const TASK_URL = `${TASK_SERVER}`;


export const uploadSourceData = createAsyncThunk('sources/uploadSourceData', async (myFormData) => {
    const response = await fetch(`${TASK_URL}/sources`, {
        method: 'POST',
        body: myFormData,
    });
    return response.json();
});

export const getV4l2Devices = createAsyncThunk('sources/getV4l2Devices', async (myFormData) => {
    const response = await fetch(`${TASK_URL}/v4l2`);
    return response.json();
});

//getSourceFrame

export const getSourceFrame = createAsyncThunk('sources/getSourceFrame', async (myData, { getState }) => {

    log('--- get source frame start ---')
 
    let {fileUid,basicType}=myData;

    //--- calculate widht and height ---
    const state = getState();
    const fileMaxWidth = (basicType)?864:804;
    const fileMaxHeight = 558;
    const myWidth = parseInt(state.sources.width);
    const myHeight = parseInt(state.sources.height);
    let fileSetWidth = Math.trunc((myWidth / myHeight) * fileMaxHeight);
    let fileSetHeight = Math.trunc((myHeight / myWidth) * fileMaxWidth);
    if (fileSetWidth <= fileMaxWidth) {
        fileSetHeight=fileMaxHeight;
    }else{
        if (fileSetHeight <= fileMaxHeight) {
            fileSetWidth=fileMaxWidth;
        }
    }

    try {
        const myData={}
        myData.height=fileSetHeight;
        myData.width=fileSetWidth;
        //log(`${TASK_URL}/sources/${uid}/frame`)
        const response = await fetch(`${TASK_URL}/sources/${fileUid}/frame`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(myData),
        });
      
        const imageBlob = await response.blob();
        myData.blob=imageBlob;
        return myData;
    } catch (error) {

        log(error)
        return error;
    }




});

export const getSourceWidthHeight = createAsyncThunk('sources/getSourceWitdhHeight', async () => {

    log('--- get source width height start ---')
 
    try {
        const response = await fetch(`${TASK_URL}/sources`);
        return response.json();
    } catch (error) {

        log(error)
        return error;
    }

});



const sourcesSlice = createSlice({
    name: "sources",
    initialState: { status: 'idle', data: [], uid: '', width: 0, height: 0, drawWidth: 0, drawHeight: 0, fileName: '', fileUrl: '', v4l2Data: [], v4l2Options: [], type:'', error: null },
    reducers: {

        resetErrorMessage(state) {
            log('reset message')
            state.error = null;
        },
        resetFileName(state) {
            log('reset message')
            state.fileName = '';
            state.fileUrl = '';
            state.uid = '';
        },
        setSourceId(state,action) {
            log('set source id')
            state.uid = action.payload.uid;
            state.status='idle';
        },
    },
    extraReducers: (builder) => {

        // ---- upload source data ---
        builder.addCase(
            uploadSourceData.fulfilled,
            (state, action) => {

                if (action.payload.status_code === 200) {

                    log('--- upload source data fulfilled  ---')
                    //log(action.payload)
                    state.data = action.payload.data;
                    state.uid = action.payload.data.uid;
                    state.width = action.payload.data.width;
                    state.height = action.payload.data.height;
                    state.fileName = action.payload.data.name;
                    state.type = action.payload.data.type.toUpperCase();
                    state.status = 'success';
                }else if(action.payload.status_code === 500){
                    state.error=action.payload.message;
                    state.status = 'success';
                } else {
                    //return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
                    log('--- upload source data other ---')
                }

            }
        )
        builder.addCase(
            uploadSourceData.pending,
            (state, { meta }) => {
                log('--- upload source data pending ---');
                state.status = 'loading';
                //return updateTaskStatus(state,meta.arg,'set_stream_delete_loading');
            }
        )
        builder.addCase(
            uploadSourceData.rejected,
            (state, action) => {
                log(`--- upload source data rejected ---`);
                state.status = 'rejected';
                // return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
            }
        )

        // ---- get v4l2 devices ---
        builder.addCase(
            getV4l2Devices.fulfilled,
            (state, action) => {

                if (action.payload.status_code === 200) {

                    log('--- get v4l2 fulfilled  ---')
                    state.v4l2Data = action.payload.data;
                    state.status = 'success';
                    let myData = [];
                    Object.keys(action.payload.data).map((e, i) => {
                        myData.push([action.payload.data[e], action.payload.data[e]])
                    })
                    state.v4l2Options = myData;
                }else if(action.payload.status_code === 500){

                    log(action.payload.message);
                    state.error = action.payload.message;

                } else {
                    //return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
                    log('--- v4l2 other ---')
                }

            }
        )
        builder.addCase(
            getV4l2Devices.pending,
            (state, { meta }) => {
                log('--- get v4l2 pending ---');
                state.status = 'loading';
                //return updateTaskStatus(state,meta.arg,'set_stream_delete_loading');
            }
        )
        builder.addCase(
            getV4l2Devices.rejected,
            (state, action) => {
                log(`--- get v4l2 rejected ---`);
                state.status = 'rejected';
                // return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
            }
        )

        // ---- get source frame ---
        builder.addCase(
            getSourceFrame.fulfilled,
            (state, action) => {
             
                const {width,height,blob} = action.payload;
                const myImage= URL.createObjectURL(blob);

                state.fileUrl = myImage;
                state.drawHeight=height;
                state.drawWidth=width;

            }
        )
        builder.addCase(
            getSourceFrame.pending,
            (state, { meta }) => {

                log('--- get source frame pending  ---')
                state.status = 'loading';
                //return updateTaskStatus(state,meta.arg,'set_stream_delete_loading');
            }
        )
        builder.addCase(
            getSourceFrame.rejected,
            (state, action) => {
                log('--- get source frame rejected  ---')
                state.status = 'rejected';
                // return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
            }
        )

        // ---- get source width height ---
        builder.addCase(
            getSourceWidthHeight.fulfilled,
            (state, action) => {

                log('--- get source width height fulfilled ---')
                const myData=action.payload.data;
                myData.forEach(function (item, idx) {
                
                    if (item.uid.trim()===state.uid.trim()){
                        state.width=parseInt(item.width);
                        state.height=parseInt(item.height);
                        
                    }
                })
              
            }
        )
        builder.addCase(
            getSourceWidthHeight.pending,
            (state, { meta }) => {

                log('--- get source width height pending  ---')
                state.status = 'loading';
                
            }
        )
        builder.addCase(
            getSourceWidthHeight.rejected,
            (state, action) => {
                log('--- get source width height rejected  ---')
                state.status = 'rejected';
                
            }
        )

    },



});
export const sourcesActions = sourcesSlice.actions;
export const { resetErrorMessage,resetFileName,setSourceId } = sourcesSlice.actions;
export default sourcesSlice.reducer;
