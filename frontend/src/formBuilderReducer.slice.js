import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const IDLE = "IDLE";
export const PENDING = "PENDING";
export const ERROR = "ERROR";
export const SUCCESS = "SUCCESS";

const initialState = {
  data: {},
  loading: IDLE,
};

export const fetchFormBuilder = createAsyncThunk(
  "formBuilderThunk",
  async () => {
    const result = await fetch("http://localhost:8080/api/form/data");
    const data = await result.json();
    return data;
  }
);

export const submitForm = async (values) => {
  // We send the initial data to the fake API server
  const response = await fetch("http://localhost:8080/api/form", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
  const data = await response.json();
  return data;
};

const formBuilderReducer = createSlice({
  name: "formBuilder",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchFormBuilder.fulfilled]: (state, action) => {
      state.loading = SUCCESS;
      state.data = action.payload;
    },
    [fetchFormBuilder.pending]: (state) => {
      state.loading = PENDING;
    },
    [fetchFormBuilder.rejected]: (state) => {
      state.loading = ERROR;
    },
  },
});

export default formBuilderReducer.reducer;
