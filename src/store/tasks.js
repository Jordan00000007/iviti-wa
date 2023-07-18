import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import update from 'react-addons-update';
import log from "../utils/console";
import moment from 'moment';

const TASK_SERVER = process.env.REACT_APP_TASK_SERVER;
const STREAM_SERVER = process.env.REACT_APP_STREAM_SERVER;
const TASK_URL = `${TASK_SERVER}/tasks`;
const STREAM_URL =  `${STREAM_SERVER}/stream`;
const DEVICE_URL = `${TASK_SERVER}/device`;

//const TASK_URL_TEMP = `${TASK_SERVER_TEMP}/ivit/v1`;

export const fetchData = createAsyncThunk('tasks/fetchData', async () => {
    //log(`--- fetch data start ---`);
    const response = await fetch(TASK_URL);
    return response.json();
});

export const runTask = createAsyncThunk('tasks/runTask', async (uuid) => {
    log(`--- run task [${uuid}] start ---`);
    log(`${TASK_URL}/exec`)
    const myData={
        "uid": `${uuid}`,
        "action": "run",
        "data": {
            "cv_display": false
        }
    }
    const response = await fetch(`${TASK_URL}/exec`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(myData),
    });

    return response.json();;
});

export const stopTask = createAsyncThunk('tasks/stopTask', async (uuid) => {
    //log(`--- stop task [${uuid}] start ---`);
    const myData={
        "uid": `${uuid}`,
        "action": "stop",
        "data": {
            "cv_display": false
        }
    }
    const response = await fetch(`${TASK_URL}/exec`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(myData),
    });
    return response.json();;
});

export const addStream = createAsyncThunk('tasks/addStream', async (uuid) => {
    const inData={
        "name":uuid,
        "channels": {
            "0": {
                "name": "ch1",
                "url": `rtsp://127.0.0.1:8554/${uuid}`,
                "on_demand": false,
                "debug": false,
                "status": 0
            }
        }
    }
    const option={
        method: 'POST', 
        body: JSON.stringify(inData), // data can be `string` or {object}!
        headers: new Headers({
          'Content-Type': 'application/json'
        })
    }
    log(`--- add stream [${uuid}] start ---`);
    const response = await fetch(`${STREAM_URL}/${uuid}/add`,option);
    return response.json();;
});

export const deleteStream = createAsyncThunk('tasks/deleteStream', async (uuid) => {
    //log(`--- delete stream [${uuid}] start ---`);
    const response = await fetch(`${STREAM_URL}/${uuid}/delete`);
    return response.json();;
});

export const addTask = createAsyncThunk('tasks/addTask', async (myData) => {
    log(`--- add task start ---`);
    log(`${TASK_URL}`)

    //log(myData)
   
    const response = await fetch(`${TASK_URL}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(myData),
    });

    return response.json();;
});

export const updateTask = createAsyncThunk('tasks/updateTask', async (myData) => {
    log(`--- add task start ---`);
    log(`${TASK_URL}`)
   
    const response = await fetch(`${TASK_URL}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(myData),
    });

    return response.json();;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (uuid) => {
    log(`--- delete task start ---`);
    log(`${TASK_URL}`)

    //log(myData)

    const myData={};
    myData.uids=[uuid];
   
    const response = await fetch(`${TASK_URL}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(myData),
    });

    return response.json();;
});

const updateTaskStatus=(state,uuid,myStatus,myMessage)=>{
    log(`--- update Task Status = ${uuid} => ${myStatus} ---`);
    const indexToUpdate = current(state).data.findIndex(item => item.task_uid === uuid);
    const updatedArray = update(current(state).data, {
        [indexToUpdate]: {
            status: { $apply: status => myStatus },
            apiError: { $apply: apiError => (((myStatus!=='run')&&(myStatus!=='stop'))?myMessage:'') },
            apiSuccess : { $apply: apiSuccess => ((myStatus==='run')||(myStatus==='stop')?myMessage:'') },
        }
    });
    return {
        ...state,
        data: updatedArray
    }

}

const updateTaskInfo=(state,uuid,message)=>{

    //log('--- update task info ---')
    const indexToUpdate = current(state).data.findIndex(item => item.task_uid === uuid);
    
    const updatedArray = update(current(state).data, {
        [indexToUpdate]: {
            source: { $apply: source => message.source.toString().substring(5) },
            device: { $apply: device => message.device },
            thres: { $apply: thres => message.thres },
        }
    });
    return {
        ...state,
        data: updatedArray
    }

}

const updateStreamInfo=(state,payload)=>{

    const uuid=payload.uuid;
    const indexToUpdate = current(state).data.findIndex(item => item.task_uid === uuid);

    const updatedArray = update(current(state).data, {
        [indexToUpdate]: {
            fps: { $apply: fps => payload.fps },
            liveTime: { $apply: liveTime => payload.liveTime },
        }
    });

    return {
        ...state,
        data: updatedArray
    }

}

const updateTemperatureInfo=(state,uuid,message)=>{

    //log(`--- update temperature info [CPU:${Math.round(message.CPU.temperature)}] [GPU:${Math.round(message.GPU.temperature)}] ---`)
    log('uuid')
    log(uuid)

    log('message')
    log(message)


    // const indexToUpdate = current(state).data.findIndex(item => item.uuid === uuid);
    // const updatedArray = update(current(state).data, {
    //     [indexToUpdate]: {
    //         cpuTemperature: { $apply: cpuTemperature => Math.round(message.CPU.temperature) },
    //         gpuTemperature: { $apply: gpuTemperature => Math.round(message.GPU.temperature) },
            
    //     }
    // });
    // return {
    //     ...state,
    //     data: updatedArray
    // }

}

const tasksSlice = createSlice({
    name: "tasks",
    initialState: { status: 'idle', data: [], error: null ,temperature:'N/A', deleteStatus:'idle',deleteMessage:'',addStatus:'idle',addMessage:'', updateStatus:'idle',updateMessage:''},
    reducers: {
        toggleOn(state, action) {
           
          
        },
        toggleOff(state, action) {


        },
        updateStreamInfo(state, action){

            return updateStreamInfo(state,action.payload);
        },
        updateTemperatureInfo(state,action){

            try {
                const temp=Math.round(action.payload);
                state.temperature=temp;
            }
            catch (e) {
                state.temperature='Error';
                log(e);
            }
            
        },
        resetError(state, action){

            state.status='idle';
            state.error='';
        },
        setTaskDeleteMessage(state, action){

            state.deleteMessage=action.payload;
            
        },
        setTaskStatus(state,action){
            log('reducer update task status....');
            log(action.payload.source_uid);
            log(action.payload.status);
            log(action.payload.message);

            const indexToUpdate = state.data.findIndex(item => item.source_uid === action.payload.source_uid);
            state.data[indexToUpdate].status=action.payload.status;
            state.data[indexToUpdate].apiError=action.payload.message;
            state.data[indexToUpdate].apiSuccess='';


        }
    },
    extraReducers: (builder) => {

        // ---- fetch data conditions ---
        builder.addCase(
            fetchData.fulfilled,
            (state, action) => {
               
                if (action.payload.status_code === 200) {

                    log('--- fetch data fulfilled  ---')
                    log(action.payload)
                    if (action.payload.message==="No task setup."){
                        //log('empty')
                        state.data = [];
                    }else{
                        //log('have data')
                        state.data = action.payload.data;
                    }
                    
                    state.status = 'success';
                }else if(action.payload.status_code === 500){
                    log('--- fetch data error ---')
                    log(action.payload.message)
                    state.error=action.payload.message;
                    state.status = 'error';
                } else {
                    //return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
                    log('--- fetch data unknow error ---')
                    state.status = 'error';
                }
               
            }
        )
        builder.addCase(
            fetchData.pending,
            (state, { payload }) => {
                //log('--- fetch data pending ---');
                state.status = 'loading';
            }
        )
        builder.addCase(
            fetchData.rejected,
            (state, { payload }) => {
                //log('--- fetch data reject ---');
                state.status = 'error';
            }
        )

        // ---- run task conditions ---
        builder.addCase(
            runTask.fulfilled,
            (state, action) => {
                //log(`--- run task [${action.meta.arg}] fulfilled ---`);
                log(action.payload);
                if (action.payload.status_code===200){
                    return updateTaskStatus(state,action.meta.arg,'set_task_run_success');
                }else if (action.payload.status_code===500){
                    return updateTaskStatus(state,action.meta.arg,'set_task_run_error',action.payload.message);
                }else{
                    return updateTaskStatus(state,action.meta.arg,'set_task_run_error','Unknow Error');
                }
            }
        )
        builder.addCase(
            runTask.pending,
            (state, action) => {
                //log(`--- run task [${action.meta.arg}] pending ---`);
                return updateTaskStatus(state,action.meta.arg,'set_task_run_loading');
            }
        )
        builder.addCase(
            runTask.rejected,
            (state, action) => {
                log(`--- run task [${action.meta.arg}] rejected ---`);
                return updateTaskStatus(state,action.meta.arg,'set_task_run_error');
            }
        )

        // ---- stop task conditions ---
        builder.addCase(
            stopTask.fulfilled,
            (state, action) => {
                //log(`--- stop task [${action.meta.arg}] fulfilled ---`);
                //log(action.payload);
                if (action.payload.status_code===200){
                    return updateTaskStatus(state,action.meta.arg,'set_task_stop_success');
                }else{
                    return updateTaskStatus(state,action.meta.arg,'set_task_stop_error');
                }
            }
        )
        builder.addCase(
            stopTask.pending,
            (state, action) => {
                //log(`--- stop task [${action.meta.arg}] pending ---`);
                return updateTaskStatus(state,action.meta.arg,'set_task_stop_loading');
            }
        )
        builder.addCase(
            stopTask.rejected,
            (state, action) => {
                //log(`--- stop task [${action.meta.arg}] rejected ---`);
                return updateTaskStatus(state,action.meta.arg,'set_task_stop_error');
            }
        )

        // ---- add stream conditions ---
        builder.addCase(
            addStream.fulfilled,
            (state, action) => {
                //log(`--- add stream [${action.meta.arg}] fulfilled ---`);
                //log(action);
                if (action.payload.status===1){
                    return updateTaskStatus(state,action.meta.arg,'run','Set streaming running success.');
                }else{
                    
                    if (action.payload.payload==='stream already exists'){
                        return updateTaskStatus(state,action.meta.arg,'run','Streaming already exists.');
                    }else{
                        return updateTaskStatus(state,action.meta.arg,'set_stream_add_error',action.payload.payload);
                    }
                }
                
            }
        )
        builder.addCase(
            addStream.pending,
            (state, action) => {
                log(`--- add stream pending ---`);
                //log(action)
                return updateTaskStatus(state,action.meta.arg,'set_stream_add_loading');
            }
        )
        builder.addCase(
            addStream.rejected,
            (state, action ) => {
                //log(`--- add stream [${action.meta.arg}] rejected ---`);
                return updateTaskStatus(state,action.meta.arg,'set_stream_add_error');
            }
        )

        // ---- delete stream conditions ---
        builder.addCase(
            deleteStream.fulfilled,
            (state, action) => {
                //log(`--- delete stream [${action.meta.arg}] fulfilled ---`);
                //log(action.payload);
                if (action.payload.status===1){
                    return updateTaskStatus(state,action.meta.arg,'stop','Set streaming stop success.');
                }else{
                    return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error',action.payload.payload);
                }
                
            }
        )
        builder.addCase(
            deleteStream.pending,
            (state, action) => {
                //log(`--- delete stream [${action.meta.arg}] pending ---`);
                return updateTaskStatus(state,action.meta.arg,'set_stream_delete_loading');
            }
        )
        builder.addCase(
            deleteStream.rejected,
            (state, action ) => {
                //log(`--- delete stream [${action.meta.arg}] rejected ---`);
                return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
            }
        )

        // ---- add task conditions ---
        builder.addCase(
            addTask.fulfilled,
            (state, action) => {
                log(`--- add task fulfilled ---`);
                log(action.payload);

                if (action.payload.status_code===200){
                    state.addStatus='success'
                    state.addMessage='Success';
                }else if (action.payload.status_code===500){
                    state.addStatus='error'
                    state.addMessage=JSON.stringify(action.payload.data.data);
                }else{
                    state.addStatus='error'
                    state.addMessage='Unknow error.';
                }
              
                
            }
        )
        builder.addCase(
            addTask.pending,
            (state, action) => {
                log(`--- add task pending ---`);
                state.addStatus='pending'
                state.addMessage='';
                
            }
        )
        builder.addCase(
            addTask.rejected,
            (state, action ) => {
                log(`--- add task rejected ---`);
                state.addStatus='rejected'
                state.addMessage='';
            }
        )

        // ---- update task conditions ---
        builder.addCase(
            updateTask.fulfilled,
            (state, action) => {
                log(`--- update task fulfilled ---`);
                log(action.payload);

                if (action.payload.status_code===200){
                    state.updateStatus='success'
                    state.updateMessage='Success';
                }else if (action.payload.status_code===500){
                    state.updateStatus='error'
                    state.updateMessage=action.payload.message;
                }else{
                    state.updateStatus='error'
                    state.updateMessage='Unknow error.';
                }
                   
            }
        )
        builder.addCase(
            updateTask.pending,
            (state, action) => {
                log(`--- update task pending ---`);
                state.updateStatus='pending'
                state.updateMessage='';
            }
        )
        builder.addCase(
            updateTask.rejected,
            (state, action ) => {
                log(`--- update task rejected ---`);
                state.updateStatus='rejected'
                state.updateMessage='';
            }
        )

        // ---- delete task conditions ---
        builder.addCase(
            deleteTask.fulfilled,
            (state, action) => {
                log(`--- delete task fulfilled ---`);
                log(action.payload)
                if (action.payload.status_code === 200) {
                    state.deleteStatus = 'success';
                }else if(action.payload.status_code === 500){
                    state.deleteMessage=action.payload.message;
                    state.deleteStatus = 'error';
                } else {
                    //return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
                    log('--- fetch data unknow error ---')
                    state.deleteMessage="Unknow error.";
                    state.deleteStatus = 'error';
                }
              
                
            }
        )
        builder.addCase(
            deleteTask.pending,
            (state, action) => {
                log(`--- delete task pending ---`);
                state.deleteStatus='pending';
                
            }
        )
        builder.addCase(
            deleteTask.rejected,
            (state, action ) => {
                log(`--- delete task rejected ---`);
                state.deleteMessage='Delete task rejected.';
                state.deleteStatus='error';
            }
        )

    },



});
export const tasksActions = tasksSlice.actions;
export const { resetError,setTaskDeleteMessage,setTaskStatus } = tasksSlice.actions;
export default tasksSlice.reducer;
