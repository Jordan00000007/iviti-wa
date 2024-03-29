import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import update from 'react-addons-update';
import log from "../utils/console";
import moment from 'moment';
import { orderBy, cloneDeep, find } from 'lodash-es';
import axios from 'axios';

const TASK_SERVER = process.env.REACT_APP_TASK_SERVER;
const STREAM_SERVER = process.env.REACT_APP_STREAM_SERVER;
const REQUEST_TIMEOUT = process.env.REACT_APP_REQUEST_TIMEOUT;


const TASK_URL = `${TASK_SERVER}/tasks`;
const STREAM_URL = `${STREAM_SERVER}/stream`;
const DEVICE_URL = `${TASK_SERVER}/device`;

//const TASK_URL_TEMP = `${TASK_SERVER_TEMP}/ivit/v1`;

export const fetchData = createAsyncThunk('tasks/fetchData', async () => {
    log(`--- fetch data start ---`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
        const response = await fetch(TASK_URL, {
            signal: controller.signal
        }).then((res) => res.json());
        return response;
    } catch (error) {
        const customResponse = {};
        customResponse.status_code = 408;
        customResponse.message = "Request time out.";
        return customResponse;
    } finally {
        clearTimeout(timeoutId);
    }


});

export const runTask = createAsyncThunk('tasks/runTask', async (uuid) => {
    log(`--- run task [${uuid}] start ---`);

    const myData = {
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
    }).then((res) => res.json());
    return response;



});

export const stopTask = createAsyncThunk('tasks/stopTask', async (uuid) => {
    //log(`--- stop task [${uuid}] start ---`);
    const myData = {
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
    const inData = {
        "name": uuid,
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
    const option = {
        method: 'POST',
        body: JSON.stringify(inData), // data can be `string` or {object}!
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    }
    log(`--- add stream [${uuid}] start ---`);
    const response = await fetch(`${STREAM_URL}/${uuid}/add`, option);
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
    log(`--- update task start ---`);
    log(`${TASK_URL}`)

    log(myData)

    const response = await fetch(`${TASK_URL}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(myData),
    });

    return response.json();;
});

export const exportTask = createAsyncThunk('tasks/exportTask', async (myData) => {
    log(`--- export task start ---`);
    log(`${TASK_URL}`)

    log(myData)

    const response = await fetch(`${TASK_URL}/export`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(myData),
    });

    return response.json();
});

export const importTask = createAsyncThunk('tasks/importTask', async (myData) => {
    log(`--- import task start ---`);
    log(`${TASK_URL}`)

    log(myData)

    const response = await fetch(`${TASK_URL}/import`, {
        method: 'POST',
        body: myData,
    });

    return response.json();
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (uuid) => {
    log(`--- delete task start ---`);
    log(`${TASK_URL}`)

    //log(myData)

    const myData = {};
    myData.uids = [uuid];

    const response = await fetch(`${TASK_URL}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(myData),
    });

    return response.json();;
});

const updateTaskStatus = (state, uuid, myStatus, myMessage) => {
    log(`--- update Task Status = ${uuid} => ${myStatus} ---`);
    const indexToUpdate = current(state).data.findIndex(item => item.task_uid === uuid);
    const updatedArray = update(current(state).data, {
        [indexToUpdate]: {
            status: { $apply: status => myStatus },
            apiError: { $apply: apiError => (((myStatus !== 'run') && (myStatus !== 'stop')) ? myMessage : '') },
            apiSuccess: { $apply: apiSuccess => ((myStatus === 'run') || (myStatus === 'stop') ? myMessage : '') },
        }
    });
    return {
        ...state,
        data: updatedArray
    }

}

const updateTaskInfo = (state, uuid, message) => {

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

const updateStreamInfo = (state, payload) => {

    const uuid = payload.uuid;
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

const updateTemperatureInfo = (state, uuid, message) => {

    //log(`--- update temperature info [CPU:${Math.round(message.CPU.temperature)}] [GPU:${Math.round(message.GPU.temperature)}] ---`)
    log('uuid')
    log(uuid)

    log('message')
    log(message)



}

const tasksSlice = createSlice({
    name: "tasks",
    initialState: {
        status: 'idle',
        data: [],
        error: null,
        temperature: 'N/A',
        deleteStatus: 'idle',
        deleteMessage: '',
        addStatus: 'idle',
        addMessage: '',
        updateStatus: 'idle',
        updateMessage: '',
        exportStatus: 'idle',
        exportMessage: '',
        importStatus: 'idle',
        importMessage: '',
    },
    reducers: {
        toggleOn(state, action) {


        },
        toggleOff(state, action) {


        },
        updateStreamInfo(state, action) {

            return updateStreamInfo(state, action.payload);
        },
        updateTemperatureInfo(state, action) {

            try {
                const temp = Math.round(action.payload);
                state.temperature = temp;
            }
            catch (e) {
                state.temperature = 'Error';
                log(e);
            }

        },
        resetError(state, action) {

            state.status = 'idle';
            state.error = '';
        },
        setTaskDeleteMessage(state, action) {

            state.deleteMessage = action.payload;

        },
        setTaskStatus(state, action) {
            log('reducer update task status....');
            log(action.payload.task_uid);
            log(action.payload.status);
            log(action.payload.message);

            const indexToUpdate = state.data.findIndex(item => item.task_uid === action.payload.task_uid);
            state.data[indexToUpdate].status = action.payload.status;
            state.data[indexToUpdate].apiError = action.payload.message;
            state.data[indexToUpdate].apiSuccess = '';


        },
        setMessageKey(state, action) {
            log('reducer update task status....');
            log(action.payload.task_uid);
            log(action.payload.key);

            const indexToUpdate = state.data.findIndex(item => item.task_uid === action.payload.task_uid);

            state.data[indexToUpdate].messageKey = action.payload.key;


        },
        resetExportStatus(state, action) {
            state.exportStatus = 'idle';
            state.exportMessage = '';
        },
        resetImportStatus(state, action) {
            state.importStatus = 'idle';
            state.importMessage = '';
        },
        resetDeleteTaskStatus(state, action) {
            state.deleteStatus = 'idle';
            state.deleteMessage = '';
        },
    },
    extraReducers: (builder) => {

        // ---- fetch data conditions ---
        builder.addCase(
            fetchData.fulfilled,
            (state, action) => {

                if (action.payload.status_code === 200) {

                    log('--- fetch data fulfilled  ---')
                    log(action.payload)
                    if (action.payload.message === "No task setup.") {
                        //log('empty')
                        state.data = [];
                    } else {
                        //console.log('have data ---------------->',action.payload.data)
                        const myOrderArr = orderBy(action.payload.data, ['created_time'], ['desc'])
                        //console.log('have data order ---------------->',myOrderArr)
                        state.data = myOrderArr;
                    }

                    state.status = 'success';
                } else if (action.payload.status_code === 500) {
                    log('--- fetch data error ---')
                    state.status = 'error';
                    if (action.payload.data.data) {
                        state.error = JSON.stringify(action.payload.data.data);
                    } else {
                        state.error = action.payload.message;
                    }
                } else if (action.payload.status_code === 408) {
                    log('--- fetch data time out ---')
                    log(action.payload.message)
                    state.error = action.payload.message;
                    state.status = 'rejected';
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
                state.status = 'rejected';
            }
        )

        // ---- run task conditions ---
        builder.addCase(
            runTask.fulfilled,
            (state, action) => {
                //log(`--- run task [${action.meta.arg}] fulfilled ---`);
                //log(action.payload);
                if (action.payload.status_code === 200) {
                    return updateTaskStatus(state, action.meta.arg, 'set_task_run_success');
                } else if (action.payload.status_code === 500) {
                    return updateTaskStatus(state, action.meta.arg, 'set_task_run_error', action.payload.message);
                } else if (action.payload.status_code === 408) {
                    return updateTaskStatus(state, action.meta.arg, 'set_task_run_error', 'request time out');
                } else {
                    return updateTaskStatus(state, action.meta.arg, 'set_task_run_error', 'Unknow Error');
                }
            }
        )
        builder.addCase(
            runTask.pending,
            (state, action) => {
                //log(`--- run task [${action.meta.arg}] pending ---`);
                return updateTaskStatus(state, action.meta.arg, 'set_task_run_loading');
            }
        )
        builder.addCase(
            runTask.rejected,
            (state, action) => {
                log(`--- run task [${action.meta.arg}] rejected ---`);
                return updateTaskStatus(state, action.meta.arg, 'set_task_run_error');
            }
        )

        // ---- stop task conditions ---
        builder.addCase(
            stopTask.fulfilled,
            (state, action) => {
                //log(`--- stop task [${action.meta.arg}] fulfilled ---`);
                //log(action.payload);
                if (action.payload.status_code === 200) {

                    return updateTaskStatus(state, action.meta.arg, 'set_task_stop_success');

    
                } else {
                    return updateTaskStatus(state, action.meta.arg, 'set_task_stop_error');
                }
            }
        )
        builder.addCase(
            stopTask.pending,
            (state, action) => {
                //log(`--- stop task [${action.meta.arg}] pending ---`);
                return updateTaskStatus(state, action.meta.arg, 'set_task_stop_loading');
            }
        )
        builder.addCase(
            stopTask.rejected,
            (state, action) => {
                //log(`--- stop task [${action.meta.arg}] rejected ---`);
                return updateTaskStatus(state, action.meta.arg, 'set_task_stop_error');
            }
        )

        // ---- add stream conditions ---
        builder.addCase(
            addStream.fulfilled,
            (state, action) => {
                //log(`--- add stream [${action.meta.arg}] fulfilled ---`);
                //log(action);
                if (action.payload.status === 1) {
                    return updateTaskStatus(state, action.meta.arg, 'run', 'Set streaming running success.');
                } else {

                    if (action.payload.payload === 'stream already exists') {
                        return updateTaskStatus(state, action.meta.arg, 'run', 'Streaming already exists.');
                    } else {
                        return updateTaskStatus(state, action.meta.arg, 'set_stream_add_error', action.payload.payload);
                    }
                }

            }
        )
        builder.addCase(
            addStream.pending,
            (state, action) => {
                log(`--- add stream pending ---`);
                //log(action)
                return updateTaskStatus(state, action.meta.arg, 'set_stream_add_loading');
            }
        )
        builder.addCase(
            addStream.rejected,
            (state, action) => {
                //log(`--- add stream [${action.meta.arg}] rejected ---`);
                return updateTaskStatus(state, action.meta.arg, 'set_stream_add_error');
            }
        )

        // ---- delete stream conditions ---
        builder.addCase(
            deleteStream.fulfilled,
            (state, action) => {
                //log(`--- delete stream [${action.meta.arg}] fulfilled ---`);
                //log(action.payload);
                if (action.payload.status === 1) {
                    return updateTaskStatus(state, action.meta.arg, 'stop', 'Set streaming stop success.');

                  
                } else {
                
                    if (action.payload.payload === 'stream not found') {
                        return updateTaskStatus(state, action.meta.arg, 'stop', 'Stream not found.');
                    } else {
                        return updateTaskStatus(state, action.meta.arg, 'set_stream_delete_error', action.payload.payload);
                    }
                }


                if (action.payload.payload === 'stream already exists') {
                    return updateTaskStatus(state, action.meta.arg, 'run', 'Streaming already exists.');
                } else {
                    return updateTaskStatus(state, action.meta.arg, 'set_stream_add_error', action.payload.payload);
                }

            }
        )
        builder.addCase(
            deleteStream.pending,
            (state, action) => {
                //log(`--- delete stream [${action.meta.arg}] pending ---`);
                return updateTaskStatus(state, action.meta.arg, 'set_stream_delete_loading');
            }
        )
        builder.addCase(
            deleteStream.rejected,
            (state, action) => {
                //log(`--- delete stream [${action.meta.arg}] rejected ---`);
                return updateTaskStatus(state, action.meta.arg, 'set_stream_delete_error');
            }
        )

        // ---- add task conditions ---
        builder.addCase(
            addTask.fulfilled,
            (state, action) => {
                log(`--- add task fulfilled ---`);
                log(action.payload);

                if (action.payload.status_code === 200) {
                    state.addStatus = 'success'
                    state.addMessage = 'Success';
                } else if (action.payload.status_code === 500) {
                    state.addStatus = 'error'
                    if (action.payload.data.data) {
                        state.addMessage = JSON.stringify(action.payload.data.data);
                    } else {
                        state.addMessage = action.payload.message;
                    }

                } else {
                    state.addStatus = 'error'
                    state.addMessage = 'Unknow error.';
                }


            }
        )
        builder.addCase(
            addTask.pending,
            (state, action) => {
                log(`--- add task pending ---`);
                state.addStatus = 'pending'
                state.addMessage = '';

            }
        )
        builder.addCase(
            addTask.rejected,
            (state, action) => {
                log(`--- add task rejected ---`);
                state.addStatus = 'rejected'
                state.addMessage = '';
            }
        )

        // ---- update task conditions ---
        builder.addCase(
            updateTask.fulfilled,
            (state, action) => {
                log(`--- update task fulfilled ---`);
                log(action.payload);

                if (action.payload.status_code === 200) {
                    state.updateStatus = 'success'
                    state.updateMessage = 'Success';
                } else if (action.payload.status_code === 500) {
                    state.updateStatus = 'error';
                    if (action.payload.data.data) {
                        state.updateMessage = JSON.stringify(action.payload.data.data);
                    } else {
                        state.updateMessage = action.payload.message;
                    }

                } else {
                    state.updateStatus = 'error'
                    state.updateMessage = 'Unknow error.';
                }

            }
        )
        builder.addCase(
            updateTask.pending,
            (state, action) => {
                log(`--- update task pending ---`);
                state.updateStatus = 'pending'
                state.updateMessage = '';
            }
        )
        builder.addCase(
            updateTask.rejected,
            (state, action) => {
                log(`--- update task rejected ---`);
                state.updateStatus = 'rejected'
                state.updateMessage = '';
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
                } else if (action.payload.status_code === 500) {
                    state.deleteStatus = 'error';
                    if (action.payload.data.data) {
                        state.deleteMessage = JSON.stringify(action.payload.data.data);
                    } else {
                        state.deleteMessage = action.payload.message;
                    }
                } else {
                    //return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
                    log('--- fetch data unknow error ---')
                    state.deleteMessage = "Unknow error.";
                    state.deleteStatus = 'error';
                }


            }
        )
        builder.addCase(
            deleteTask.pending,
            (state, action) => {
                log(`--- delete task pending ---`);
                state.deleteStatus = 'pending';

            }
        )
        builder.addCase(
            deleteTask.rejected,
            (state, action) => {
                log(`--- delete task rejected ---`);
                state.deleteMessage = 'Delete task rejected.';
                state.deleteStatus = 'error';
            }
        )

        // ---- export task conditions ---
        builder.addCase(
            exportTask.fulfilled,
            (state, action) => {
                log(`--- export task fulfilled ---`);
                log(action.payload)
                if (action.payload.status_code === 200) {
                    state.exportStatus = 'success';
                    const taskId = action.payload.data.uid;
                    const taskObj = find(state.data, function (o) { return o.task_uid === taskId; });
                    state.exportMessage = taskObj.task_name + ' - ' + action.payload.data.status;
                } else if (action.payload.status_code === 500) {
                    state.exportStatus = 'error';
                    if (action.payload.data.data) {
                        state.exportMessage = JSON.stringify(action.payload.data.data);
                    } else {
                        state.exportMessage = action.payload.message;
                    }
                } else {
                    //return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
                    log('--- export task unknow error ---')
                    state.exportMessage = "Unknow error.";
                    state.exportStatus = 'error';
                }


            }
        )
        builder.addCase(
            exportTask.pending,
            (state, action) => {
                log(`--- export task pending ---`);
                state.exportStatus = 'pending';

            }
        )
        builder.addCase(
            exportTask.rejected,
            (state, action) => {
                log(`--- export task rejected ---`);
                state.exportMessage = 'Export task rejected.';
                state.exportStatus = 'error';
            }
        )

        // ---- import task conditions ---
        builder.addCase(
            importTask.fulfilled,
            (state, action) => {
                log(`--- import task fulfilled ---`);
                log(action.payload)
                if (action.payload.status_code === 200) {
                    state.importStatus = 'success';
                    const taskId = action.payload.data.uid;
                    const taskObj = find(state.data, function (o) { return o.task_uid === taskId; });
                    state.importMessage = 'Import task' + ' - ' + action.payload.data.status;
                } else if (action.payload.status_code === 500) {
                    state.importStatus = 'error';
                    if (action.payload.data.data) {
                        state.importMessage = JSON.stringify(action.payload.data.data);
                    } else {
                        state.importMessage = action.payload.message;
                    }
                } else {
                    //return updateTaskStatus(state,action.meta.arg,'set_stream_delete_error');
                    log('--- import task unknow error ---')
                    state.importMessage = "Unknow error.";
                    state.importStatus = 'error';
                }


            }
        )
        builder.addCase(
            importTask.pending,
            (state, action) => {
                log(`--- import task pending ---`);
                state.importStatus = 'pending';

            }
        )
        builder.addCase(
            importTask.rejected,
            (state, action) => {
                log(`--- import task rejected ---`);
                state.importMessage = 'Import task rejected.';
                state.importStatus = 'error';
            }
        )

    },



});
export const tasksActions = tasksSlice.actions;
export const { resetError, setTaskDeleteMessage, setTaskStatus, resetExportStatus, resetImportStatus, resetDeleteTaskStatus, setMessageKey } = tasksSlice.actions;
export default tasksSlice.reducer;
