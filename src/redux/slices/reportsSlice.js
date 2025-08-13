
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "global/AxiosSetting";

export const fetchReports = createAsyncThunk(
  "reports/fetchReports",
  async (
    {
      format = "Excel",
      startMonth,
      startYear,
      endMonth,
      endYear,
      employeeId,
      pensionerId,
      type,
    },
    { rejectWithValue }
  ) => {
    let url = "";

    switch (type) {
      case "employee":
        url = "/export/employee-sheet";
        break;
      case "pensioner":
        url = "/export/pensioner-sheet";
        break;
      default:
        url = "/export/multi-sheet";
    }

    const params = new URLSearchParams();

    if (startMonth && startYear && endMonth && endYear) {
      params.append("start_month", startMonth);
      params.append("start_year", startYear);
      params.append("end_month", endMonth);
      params.append("end_year", endYear);
    }

    if (type === "employee" && employeeId)
      params.append("employee_id", employeeId);
    if (type === "pensioner" && pensionerId)
      params.append("pensioner_id", pensionerId);

    const fullUrl = params.toString() ? `${url}?${params.toString()}` : url;

    try {
      const response = await axiosInstance.get(fullUrl, {
        responseType: "blob",
      });

      // Extract filename from headers
      const header = response.headers["content-disposition"];
      let baseFilename = format === "PDF" ? "report.pdf" : "report.xlsx";
      if (header) {
        const parts = header.split(";");
        const filenamePart = parts.find((part) =>
          part.trim().startsWith("filename=")
        );
        if (filenamePart) {
          baseFilename = filenamePart.split("=")[1].trim().replace(/"/g, "");
        }
      }

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      let filename = "report";
      if (startMonth && startYear && endMonth && endYear) {
        const startMonthName = monthNames[startMonth - 1];
        const endMonthName = monthNames[endMonth - 1];

        if (startYear === endYear) {
          filename =
            startMonth === endMonth
              ? `${startMonthName}-${startYear}`
              : `${startMonthName}-${endMonthName}-${startYear}`;
        } else {
          filename = `${startMonthName}-${startYear}-${endMonthName}-${endYear}`;
        }
      } else {
        // If no date range, use previous month name and year
        const now = new Date();
        const prevMonth = now.getMonth() ;
        const prevYear =  now.getFullYear() ;
        filename = `${monthNames[prevMonth]}-${prevYear}`;
      }

      const extension = format === "PDF" ? ".pdf" : ".xlsx";
      const finalFilename = `${filename}${extension}`;

      return { data: response.data, filename: finalFilename };
    } catch (error) {
      if (error.response && error.response.data instanceof Blob) {
        const errorText = await error.response.data.text();
        const errorJson = JSON.parse(errorText);
        return rejectWithValue(errorJson || "Failed to fetch report");
      }
      return rejectWithValue(error.response?.data || "Failed to fetch report");
    }
  }
);

const reportsSlice = createSlice({
  name: "reports",
  initialState: { loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reportsSlice.reducer;
