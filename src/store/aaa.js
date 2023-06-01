import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const apiUrl = 'https://example.com/data';

export const fetchData = createAsyncThunk('data/fetchData', async () => {
  const response = await fetch(apiUrl);
  return response.json();
});

const dataSlice = createSlice({
  name: 'data',
  initialState: { status: 'idle', data: null, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default dataSlice.reducer;
