import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'global/AxiosSetting';

export const fetchPensionDocument = createAsyncThunk(
  'document/fetchPensionDocument',
  async ({page,limit}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/pension-documents?page=${page}&limit=${limit}`);
      return {
        data: response.data.data,
        totalCount: response.data.total_count
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update employee");
    }
  }
);

export const createPensionDocument = createAsyncThunk(
  'document/createPensionDocument',
  async (values, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      for (let key in values) {
        formData.append(key, values[key]);
      }
      const response = await axiosInstance.post(`/pension-documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to upload document");
    }
  }
);


export const updatePensionDocument = createAsyncThunk(
  'document/updatePensionDocument',
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      for (let key in values) {
        formData.append(key, values[key]);
      }

      const response = await axiosInstance.post(
        `/pension-documents/${id}?_method=PUT`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update document");
    }
  }
);


export const fetchPensionDocumentShow = createAsyncThunk(
  'showPensionerDocument/fetchPensionDocumentShow',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/pension-documents/${id}`);
      return {
        data: response.data.data,
        totalCount: response.data.total_count
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch pension document details");
    }
  }
);


const initialState = {
  document: [],
  showPensionerDocument: null,
  totalCount: 0,
  loading: false,
  error: null
}

const pensionDocumentSlice = createSlice(({
  name: 'document',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchPensionDocument.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPensionDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.document = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchPensionDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createPensionDocument.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPensionDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.document.push(action.payload);
      })
      .addCase(createPensionDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updatePensionDocument.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePensionDocument.fulfilled, (state, action) => {
        const updatedata = action.payload;
        const index = state.document.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.document[index] = {
            ...state.document[index], ...updatedata
          };
        }
        state.loading = false;
      })
      .addCase(updatePensionDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchPensionDocumentShow.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPensionDocumentShow.fulfilled, (state, action) => {
        state.loading = false;
        state.showPensionerDocument = action.payload.data;
      })
      .addCase(fetchPensionDocumentShow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
}));


export default pensionDocumentSlice.reducer;