import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import log from "../utils/console";

const TASK_SERVER = process.env.REACT_APP_TASK_SERVER;
const TASK_SERVER_TEMP = process.env.REACT_APP_TASK_SERVER_TEMP;
const STREAM_SERVER = process.env.REACT_APP_STREAM_SERVER;
const TASK_URL = `${TASK_SERVER}/task`;
const STREAM_URL = `${STREAM_SERVER}/stream`;
const DEVICE_URL = `${TASK_SERVER}/device`;
const TASK_URL_TEMP = `${TASK_SERVER_TEMP}/ivit/v1`;

export const fetchData = createAsyncThunk('data/fetchData', async () => {

    log('fetch data ....')
    const response = await axios.get(`${TASK_URL_TEMP}/devices`);
    log(response.data)
    return response.data;
});

const dataSlice = createSlice({
    name: 'data',
    initialState: { isLoading: false, data: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.pending, (state) => {
                log('pending')
                state.isLoading = true;
            })
            .addCase(fetchData.fulfilled, (state, action) => {
                log('fulfilled')
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchData.rejected, (state) => {
                log('rejected')
                state.isLoading = false;
                
            });
    },
});

export default dataSlice.reducer;
