import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import update from 'react-addons-update';
import log from "../utils/console";
import axios from "axios";
import moment from 'moment';
import { Buffer } from 'buffer';
import { sort,orderBy } from 'lodash-es';


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

export const getSourceFrame = createAsyncThunk('sources/getSourceFrame', async (myData, { getState }) => {

    log('--- get source frame start ---')
 
    let {fileUid,basicType}=myData;

    
    const state = getState();
    const fileMaxWidth = (basicType)?854:800;
    const fileMaxHeight = 558;
    const myWidth = parseInt(state.sources.originWidth);
    const myHeight = parseInt(state.sources.originHeight);
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

        // log('url=')
        // log(`${TASK_URL}/sources/${fileUid}/frame`)

        const response = await fetch(`${TASK_URL}/sources/${fileUid}/frame`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(myData),
        });
        log('response...')
        log(response)
        if (response.status===200){
            const imageBlob = await response.blob();
            myData.status_code=200;
            myData.blob=imageBlob;
            return myData;
        }else if (response.status===500){
            log('fetch source frame error...')
            const json = await response.json();
            myData.status_code=500;
            myData.message=json.message;
            return myData;
        }else{
            log('fetch source frame unknow error...')
            myData.status_code=500;
            myData.message='Unknow error';
            return myData;
        }
       
        
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

export const getSourceInfo = createAsyncThunk('sources/getSourceInfo', async (mySourceUid, ) => {

    log('--- get source info start ---')
    try {
        const response = await fetch(`${TASK_URL}/sources/${mySourceUid}`);
        return response.json();
    } catch (error) {

        log(error)
        return error;
    }

});



const sourcesSlice = createSlice({
    name: "sources",
    initialState: { uploadStatus: 'idle', v4l2Status:'idle', frameStatus:'idle',frameMessage:'' ,sizeStatus:'idle',infoStatus:'idle',infoMessage:'', data: [], uid: '', originWidth: 0, originHeight: 0, drawWidth: 0, drawHeight: 0, fileName: '', fileUrl: '', v4l2Data: [], v4l2Options: [], type:'', error: null },
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
        resetV4l2Status(state) {
        
            state.v4l2Status = 'idle';
        },
        resetV4l2Options(state) {
        
            state.v4l2Options = [];
        },
        setSourceId(state,action) {
           
            state.uid = action.payload;
            state.status='idle';
        },
        resetFrameStatus(state,action) {
            state.frameStatus='idle';
        },
        setDrawWidthHeight(state,action){
            const {maxWidth,maxHeight}=action.payload;
          
            const myWidth = parseInt(state.originWidth);
            const myHeight = parseInt(state.originHeight);
            let drawWidth = Math.trunc((myWidth / myHeight) * maxHeight);
            let drawHeight = Math.trunc((myHeight / myWidth) * maxWidth);
            if (drawWidth <= maxWidth) {
                drawHeight = maxHeight;
            } else {
                if (drawHeight <= maxHeight) {
                    drawWidth = maxWidth;
                }
            }
            state.drawWidth=drawWidth;
            state.drawHeight=drawHeight;
             
        }
    },
    extraReducers: (builder) => {

        // ---- upload source data ---
        builder.addCase(
            uploadSourceData.fulfilled,
            (state, action) => {

                if (action.payload.status_code === 200) {

                    log('--- upload source data fulfilled  ---')
                    //log(action.payload.data)
                   
                    state.data = action.payload.data;
                    state.uid = action.payload.data.uid;
                    state.originWidth = action.payload.data.width;
                    state.originHeight = action.payload.data.height;
                    state.fileName = action.payload.data.name;
                    state.type = action.payload.data.type.toUpperCase();
                    state.uploadStatus = 'success';
                }else if(action.payload.status_code === 500){
                    state.error=action.payload.message;
                    state.uploadStatus = 'error';
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
                state.uploadStatus = 'loading';
                //return updateTaskStatus(state,meta.arg,'set_stream_delete_loading');
            }
        )
        builder.addCase(
            uploadSourceData.rejected,
            (state, action) => {
                log(`--- upload source data rejected ---`);
                state.uploadStatus = 'rejected';
                // return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
            }
        )

        // ---- get v4l2 devices ---
        builder.addCase(
            getV4l2Devices.fulfilled,
            (state, action) => {


                if (action.payload.status_code === 200) {

                    log('--- get v4l2 fulfilled  ---')
                    log(action.payload.data)

                    state.v4l2Data = action.payload.data;
                    state.status = 'success';
                    let myData = [];
                    //let myData=[['/dev/video999','/dev/video999'],['/dev/video10','/dev/video10'],['/dev/video4','/dev/video4']];
                    Object.keys(action.payload.data).map((e, i) => {
                        myData.push([action.payload.data[e], action.payload.data[e]])
                    })

                    myData.forEach(element => {
                        element.push(parseInt(element[0].match(/\d+$/)[0]));
                    });
                    myData=orderBy(myData,[2]);
                    const mySortData = myData.map(function(item){
                        return item.splice(0,2);
                    });
                    
                    state.v4l2Options = mySortData;
                    state.v4l2Status='success';
                }else if(action.payload.status_code === 500){

                    log(action.payload.message);
                    state.error = action.payload.message;
                    state.v4l2Status='error';

                } else {
                    //return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
                    log('--- v4l2 other ---')
                    state.v4l2Status='error';
                }


            }
        )
        builder.addCase(
            getV4l2Devices.pending,
            (state, { meta }) => {
                log('--- get v4l2 pending ---');
                state.v4l2Status='pending';
                //return updateTaskStatus(state,meta.arg,'set_stream_delete_loading');
            }
        )
        builder.addCase(
            getV4l2Devices.rejected,
            (state, action) => {
                log(`--- get v4l2 rejected ---`);
                state.v4l2Status = 'rejected';
                // return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
            }
        )

        // ---- get source frame ---
        builder.addCase(
            getSourceFrame.fulfilled,
            (state, action) => {
             
                log('----- get source frame fulfilled  -----')
                log(action.payload)
                log('-----------------------------')

                if (action.payload.status_code === 200) {
                    const {width,height,blob} = action.payload;
                    const myImage= URL.createObjectURL(blob);
                    state.fileUrl = myImage;
                    state.drawHeight=height;
                    state.drawWidth=width;
                    state.frameMessage='';
                    state.frameStatus='success';
                }else if(action.payload.status_code === 500){



                    state.frameMessage=action.payload.message;
                    state.frameStatus = 'error';
                } else {
                    //return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
                   
                    state.frameMessage='Unknow error';
                    state.frameStatus='error';
                } 

            }
        )
        builder.addCase(
            getSourceFrame.pending,
            (state, { meta }) => {

                log('--- get source frame pending  ---')
                state.frameStatus = 'pending';
                //return updateTaskStatus(state,meta.arg,'set_stream_delete_loading');
            }
        )
        builder.addCase(
            getSourceFrame.rejected,
            (state, action) => {
                log('--- get source frame rejected  ---')
                state.frameStatus = 'rejected';
                // return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
            }
        )

        // ---- get source width height ---
        builder.addCase(
            getSourceWidthHeight.fulfilled,
            (state, action) => {

                const myData=action.payload.data;

                if (action.payload.status_code === 200) {

                    log('get source width height success')

                    myData.forEach(function (item, idx) {
                
                        if (item.uid===state.uid){
                           
                            state.originWidth=parseInt(item.width);
                            state.originHeight=parseInt(item.height);
                            state.type=item.type.toUpperCase();
                            state.fileName=item.name;
                            
                        }
                    })
                    state.sizeStatus='success';

                }else if(action.payload.status_code === 500){

                    log(action.payload.message);
                    state.sizeMessage = action.payload.message;
                    state.sizeStatus='error';

                } else {
                    //return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
                   
                    state.sizeStatus='error';
                }
            }
        )
        builder.addCase(
            getSourceWidthHeight.pending,
            (state, { meta }) => {

                log('--- get source width height pending  ---')
                state.sizeStatus = 'loading';
                
            }
        )
        builder.addCase(
            getSourceWidthHeight.rejected,
            (state, action) => {
                log('--- get source width height rejected  ---')
                state.sizeStatus = 'rejected';
                
            }
        )


         // ---- get source info ---
         builder.addCase(
            getSourceInfo.fulfilled,
            (state, action) => {

                if (action.payload.status_code === 200) {

                    log('--- get source info fulfilled  ---')
                    log(action.payload.data)
                    state.infoMessage = action.payload.data;
                    state.infoStatus = 'success';
                }else if(action.payload.status_code === 500){
                    log('--- get source info error  ---')
                    log(action.payload.message);
                    state.infoMessage = action.payload.message;
                    state.infoStatus = 'error';

                } else {
                    //return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
                    log('--- source info error other ---')
                    state.infoMessage = 'unknow error';
                    state.infoStatus = 'error';
                }
            }
        )
        builder.addCase(
            getSourceInfo.pending,
            (state, action) => {

                log('--- get source info pending  ---')
                state.infoStatus = 'loading';
                
            }
        )
        builder.addCase(
            getSourceInfo.rejected,
            (state, action) => {
                log('--- get source info rejected  ---')
                state.infoStatus = 'rejected';
                
            }
        )
    },



});
export const sourcesActions = sourcesSlice.actions;
export const { resetErrorMessage,resetFileName,resetV4l2Status,resetV4l2Options,setSourceId,resetFrameStatus,setDrawWidthHeight } = sourcesSlice.actions;
export default sourcesSlice.reducer;
