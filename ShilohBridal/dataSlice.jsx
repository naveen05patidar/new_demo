import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchLinksData = createAsyncThunk("data/fetchData", async () => {
  const body = new FormData();
  body.append("action", "all_product_list");
  const response = await fetch(process.env.REACT_APP_API_KEY + "demo.php", {
    method: "POST",
    body: body,
  });
  const data = await response.json();
  return data;
});

// Fetch Product List
export const get_product_list = createAsyncThunk(
  "product_list",
  async (value) => {
    const body = new FormData();
    body.append("action", "list");
    body.append("page", value?.page);
    body.append("limit", value?.row);
    body.append("search", value?.search);
    const response = await fetch(process.env.REACT_APP_API_KEY + "demo.php", {
      method: "POST",
      body: body,
    });
    const data = await response.json();
    value?.setTotalCount(value?.search ? data?.searchcount : data?.totalcount);

    return data;
  }
);

// Fetch Promocode List

export const get_promocode_list = createAsyncThunk(
  "promocode_list",
  async (value) => {
    const body = new FormData();
    body.append("action", "promo_code_list");
    body.append("page", value?.page);
    body.append("limit", value?.row);
    body.append("search", value?.search);
    const response = await fetch(process.env.REACT_APP_API_KEY + "demo.php", {
      method: "POST",
      body: body,
    });
    const data = await response.json();
    value?.setTotalCount(value?.search ? data?.searchcount : data?.totalcount);

    return data;
  }
);

// Fetch Order List

export const get_order_list = createAsyncThunk("order_list", async (value) => {
  const body = new FormData();
  body.append("action", "admin_order_list");
  body.append("page", value?.page);
  body.append("limit", value?.row);
  if (value?.search) {
    body.append("search", value?.search);
  }
  const response = await fetch(process.env.REACT_APP_API_KEY + "demo.php", {
    method: "POST",
    body: body,
  });
  const data = await response.json();
  value?.setTotalCount(value?.search ? data?.searchcount : data?.totalcount);
  return data;
});

// Fetch Order Details

export const get_order = createAsyncThunk("order", async (id) => {
  const body = new FormData();
  body.append("action", "adminorderbyid");
  body.append("id", id);
  const response = await fetch(process.env.REACT_APP_API_KEY + "demo.php", {
    method: "POST",
    body: body,
  });
  const data = await response.json();
  return data;
});

// Fetch Category List

export const get_category_list = createAsyncThunk("category_list", async () => {
  const body = new FormData();
  body.append("action", "catrgorylist");
  const response = await fetch(process.env.REACT_APP_API_KEY + "demo.php", {
    method: "POST",
    body: body,
  });
  const data = await response.json();
  return data;
});

// Change Order Status

export const update_order_status = createAsyncThunk(
  "order_status",
  async (value) => {
    const body = new FormData();
    body.append("action", "status");
    body.append("orderid", value?.oid);
    body.append("status", value?.status);
    if (value?.shipper) {
      body.append("shipper", value?.shipper);
    }

    const response = await fetch(process.env.REACT_APP_API_KEY + "demo.php", {
      method: "POST",
      body: body,
    });
    const data = await response.json();
    return data;
  }
);

// Fetch Blog List

export const get_blog_list = createAsyncThunk("blog_list", async () => {
  const body = new FormData();
  body.append("action", "listall");
  const response = await fetch(process.env.REACT_APP_API_KEY + "demo.php", {
    method: "POST",
    body: body,
  });
  const data = await response.json();
  return data;
});

// Fetch Testimonial list

export const get_testimonial_list = createAsyncThunk(
  "testimonial_list",
  async () => {
    const body = new FormData();
    body.append("action", "list");
    const response = await fetch(process.env.REACT_APP_API_KEY + "demo.php", {
      method: "POST",
      body: body,
    });
    const data = await response.json();
    return data;
  }
);

// All Initail State

const initialState = {
  link_list: [],
  link_loading: false,
  product_list: [],
  product_loading: false,
  promocode_list: [],
  promocode_loading: false,
  order_list: [],
  order_list_loading: false,
  order: [],
  order_loading: false,
  category_list: [],
  blog_list: [],
  blog_list_loading: false,
  testimonial_list: [],
  testimonial_list_loading: false,
};

// Create slice using Redux Toolkit

const dataSlice = createSlice({
  name: "data",
  initialState: initialState,
  reducers: {
    addToCart(state, action) {
      state.push(action.payload);
    },
    deleteFromCart(state, action) {
      return state.filter((item) => item.id != action.payload.id);
    },
  },
  extraReducers: (builder) => {
    // Product List

    builder.addCase(get_product_list.pending, (state) => {
      state.product_loading = true;
    });
    builder.addCase(get_product_list.fulfilled, (state, action) => {
      const data = action.payload;
      state.product_loading = false;
      if (data?.success) {
        state.product_list = data.data;
      } else {
        state.product_list = [];
      }
    });
    builder.addCase(get_product_list.rejected, (state, action) => {
      state.product_loading = false;
    });

    // Promocode list

    builder
      .addCase(get_promocode_list.pending, (state) => {
        state.promocode_loading = true;
      })
      .addCase(get_promocode_list.fulfilled, (state, action) => {
        const data = action.payload;
        state.promocode_loading = false;
        if (data?.success) {
          state.promocode_list = data.message;
        } else {
          state.promocode_list = [];
        }
      })
      .addCase(get_promocode_list.rejected, (state, action) => {
        state.promocode_loading = false;
      });

    // Order list

    builder
      .addCase(get_order_list.pending, (state) => {
        state.order_list_loading = true;
      })
      .addCase(get_order_list.fulfilled, (state, action) => {
        const data = action.payload;
        state.order_list_loading = false;
        if (data?.success) {
          state.order_list = data.data;
        } else {
          state.order_list = [];
        }
      })
      .addCase(get_order_list.rejected, (state, action) => {
        state.order_list_loading = false;
      });

    // Order Details

    builder
      .addCase(get_order.pending, (state) => {
        state.order_loading = true;
      })
      .addCase(get_order.fulfilled, (state, action) => {
        const data = action.payload;
        state.order_loading = false;
        if (data?.success) {
          state.order = data.data;
        } else {
          state.order = [];
        }
      })
      .addCase(get_order.rejected, (state, action) => {
        state.order_loading = false;
      });

    // Category List

    builder.addCase(get_category_list.fulfilled, (state, action) => {
      const data = action.payload;
      if (data?.success) {
        state.category_list = data.data;
      } else {
        state.category_list = [];
      }
    });

    // Blog

    builder
      .addCase(get_blog_list.pending, (state) => {
        state.blog_list_loading = true;
      })
      .addCase(get_blog_list.fulfilled, (state, action) => {
        const data = action.payload;
        state.blog_list_loading = false;
        if (data?.success) {
          state.blog_list = data.data;
        } else {
          state.blog_list = [];
        }
      })
      .addCase(get_blog_list.rejected, (state, action) => {
        state.blog_list_loading = false;
      });

    // Testimonial

    builder
      .addCase(get_testimonial_list.pending, (state) => {
        state.testimonial_list_loading = true;
      })
      .addCase(get_testimonial_list.fulfilled, (state, action) => {
        const data = action.payload;
        state.testimonial_list_loading = false;
        if (data?.success) {
          state.testimonial_list = data.data;
        } else {
          state.testimonial_list = [];
        }
      })
      .addCase(get_testimonial_list.rejected, (state, action) => {
        state.testimonial_list_loading = false;
      });
  },
});

export default dataSlice.reducer;
