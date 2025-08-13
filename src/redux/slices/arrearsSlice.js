import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "global/AxiosSetting";


export const fetchArrears = createAsyncThunk(
  "Arrears/details",
  async ({page,limit,id}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/arrears?page=${page}&limit=${limit}&pensioner_id=${id}`);
      return {
        data: response.data.data,
        totalCount: response.data.total_count
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch employees");
    }
  }
);

export const createArrear = createAsyncThunk(
  "arrears/createArrear",
  async (arrearData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/arrears", arrearData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateArrear = createAsyncThunk(
  "arrears/updateArrear",
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/arrears/${id}?_method=PUT`, values);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchArrearsShow = createAsyncThunk(
  "showArrear/fetchArrearsShow",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/arrears?page&limit&pensioner_id=${id}`);
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch arrear");
    }
  });
      
export const showArrear = createAsyncThunk(
  "arrears/showArrear",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/arrears/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  arrears: [],
  showArrear: null,
  arrear:[],
  totalCount: 0,
  loading: false,
  error: null
}

const arrearSlice = createSlice({
  name: 'arrears',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchArrears.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchArrears.fulfilled, (state, action) => {
        state.loading = false;
        state.arrears = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchArrears.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createArrear.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createArrear.fulfilled, (state, action) => {
        state.loading = false;
        state.arrears.push(action.payload);
      })
      .addCase(createArrear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateArrear.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArrear.fulfilled, (state, action) => {
        const updatedArrear = action.payload;
        state.loading = false;
        const index = state.arrears.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.arrears[index] = {
            ...state.arrears[index], ...updatedArrear
          };
        }
      })
      .addCase(updateArrear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchArrearsShow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArrearsShow.fulfilled, (state, action) => {
        state.loading = false;
        state.showArrear = action.payload;
      })
      .addCase(fetchArrearsShow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(showArrear.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(showArrear.fulfilled, (state, action) => {
        state.loading = false;
        state.arrear = action.payload.data;
      })
      .addCase(showArrear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
})

export default arrearSlice.reducer;
