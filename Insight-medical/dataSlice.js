import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import store from "../store";
import { base_url } from "../../utils/Utils";
import { toast } from "react-toastify";

export const get_theme_change = createAsyncThunk(
  "theme_change",
  async (data) => {
    return data;
  }
);
export const get_files = createAsyncThunk("files", async (data) => {
  store.dispatch(set_open(false));
  return data;
});
export const set_open = createAsyncThunk("set_open", async (data) => {
  return data;
});
export const set_open_modal = createAsyncThunk(
  "set_open_modal",
  async (data) => {
    return data;
  }
);
export const set_annotationMode = createAsyncThunk(
  "set_annotationMode",
  async (data) => {
    return data;
  }
);

export const set_upload_images = createAsyncThunk(
  "set_upload_images",
  async (data, { dispatch }) => {
    try {
      const body = new FormData();
      data.forEach((file) => {
        body.append("file", file); 
      });
      const response = await fetch(
        process.env.REACT_APP_BASE_URL + "demo",
        {
          method: "POST",
          body: body,
        }
      );
      const res = await response.json();
      return res;
    } catch (error) {
      console.log("Error uploading images:", error);
      throw error;
    }
  }
);
//

export const get_files_list = createAsyncThunk(
  "get_files_list",
  async (data) => {
    try {
      const body = new FormData();

      body.append("action", "list");

      const response = await fetch(base_url + "demo", {
        method: "POST",
        body: body,
      });
      const res = await response.json();
      return res;
    } catch (error) {
      console.log(error);
    }
    return data;
  }
);

export const set_show_image = createAsyncThunk(
  "set_show_image",
  async (data) => {
    return data;
  }
);
const dataSlice = createSlice({
  name: "list",
  initialState: {
    loading: false,
    data: [],
    theme: "dark",
    files: [],
    open: true,
    openmodal: false,
    do_animation: true,
    annotationMode: "polygon",
    files_data: [],
    files_loading: false,
    show_image: 0,
  },
  extraReducers: (builder) => {
    builder.addCase(get_theme_change.fulfilled, (state, action) => {
      const data = action.payload;
      state.theme = data;
    });
    builder.addCase(get_files.fulfilled, (state, action) => {
      const data = action.payload;
      state.files = data;
    });

    builder.addCase(set_open.fulfilled, (state, action) => {
      const data = action.payload;
      state.open = data;
    });
    builder.addCase(set_open_modal.fulfilled, (state, action) => {
      const data = action.payload;
      state.openmodal = data;
      state.do_animation = false;
    });
    builder.addCase(set_annotationMode.fulfilled, (state, action) => {
      const data = action.payload;
      state.annotationMode = data;
    });
    builder.addCase(set_show_image.fulfilled, (state, action) => {
      const data = action.payload;
      state.show_image = data;
    });

    builder.addCase(set_upload_images.pending, (state, action) => {
      state.files_loading = true;
    });
    builder.addCase(set_upload_images.rejected, (state, action) => {
      state.files_loading = false;
    });

    builder.addCase(set_upload_images.fulfilled, (state, action) => {
      state.files_loading = false;
      const data = action.payload;
      if (data.success) {
        state.files_data = [data?.results] || [];
        state.open = false;
      } else if (data.success) {
        state.files_data = [];
        toast.error(data?.error)
      }
    });

    builder.addCase(get_files_list.rejected, (state, action) => {
      state.files_loading = false;
    });
    builder.addCase(get_files_list.fulfilled, (state, action) => {
      state.files_loading = false;
      const data = action.payload;
      if (data.success) {
        state.files_data = data?.data;
        state.open = false;
      } else if (data.success) {
        state.files_data = [];
      }
    });
  },
});

export default dataSlice.reducer;
