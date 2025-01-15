import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { base_url } from "../../utils/utils";

export const get_transition_complete_list = createAsyncThunk(
  "transaction_complete_list",
  async (data) => {
    const userIdString = localStorage.getItem("userId");
    const userId = JSON.parse(userIdString)?.aid;
    const body = new FormData();
    body.append("action", "select");
    body.append("agencyid", userId);

    const response = await fetch(base_url + "demo.php", {
      method: "POST",
      body: body,
    });
    const res = await response.json();
    return res;
  }
);

// Vender Purchase

export const get_vendor_purchase_list = createAsyncThunk(
  "vendor_purchase",
  async (data) => {
    const userIdString = localStorage.getItem("userId");
    const userId = JSON.parse(userIdString)?.aid;
    const body = new FormData();
    body.append("action", "list");
    body.append("agencyid", userId);
    body.append("page", data?.pageNo || "1");
    body.append("limit", data?.entries || "1000");
    body.append("search", data?.search || "");
    const empid = JSON.parse(userIdString)?.eid;
    if (empid) {
      body.append("emp_code", empid);
    }
    const response = await fetch(base_url + "demo.php", {
      method: "POST",
      body: body,
    });
    const res = await response.json();
    data?.setTotalCount(res.totalcount);
    data?.setSearchCount(res.searchcount);
    return res;
  }
);

// Cylinder Purchase

export const get_cylinder_purchase_list = createAsyncThunk(
  "cylinder_purchase",
  async (data) => {
    const userIdString = localStorage.getItem("userId");
    const userId = JSON.parse(userIdString)?.aid;
    const body = new FormData();
    body.append("action", "list");
    body.append("agencyid", userId);
    body.append("page", data?.pageNo || "1");
    body.append("limit", data?.entries || "1000");
    body.append("search", data?.search || "");
    const empid = JSON.parse(userIdString)?.eid;
    if (empid) {
      body.append("emp_code", empid);
    }
    const response = await fetch(base_url + "demo.php", {
      method: "POST",
      body: body,
    });
    const res = await response.json();
    data?.setTotalCount(res.totalcount);
    data?.setSearchCount(res.searchcount);
    return res;
  }
);

// ARB Purchase

export const get_arb_purchase_list = createAsyncThunk(
  "arb_purchase",
  async (data) => {
    const userIdString = localStorage.getItem("userId");
    const userId = JSON.parse(userIdString)?.aid;
    const body = new FormData();
    body.append("action", "list");
    body.append("agencyid", userId);
    body.append("page", data?.pageNo || "");
    body.append("limit", data?.entries || "");
    body.append("search", data?.search || "");
    const empid = JSON.parse(userIdString)?.eid;
    if (empid) {
      body.append("emp_code", empid);
    }
    const response = await fetch(base_url + "demo.php", {
      method: "POST",
      body: body,
    });
    const res = await response.json();
    data?.setTotalCount(res.totalcount);
    data?.setSearchCount(res.searchcount);
    return res;
  }
);

// Other Purchase

export const get_other_purchase_list = createAsyncThunk(
  "other_purchase",
  async (data) => {
    const userIdString = localStorage.getItem("userId");
    const userId = JSON.parse(userIdString)?.aid;
    const body = new FormData();
    body.append("agencyid", userId);
    body.append("page", data?.pageNo || "");
    body.append("limit", data?.entries || "");
    body.append("search", data?.search || "");
    if (data?.showData == "2") {
      body.append("action", "list");
      body.append("NO", "2");
    } else if (data?.showData == "1") {
      body.append("action", "fetch");
      body.append("YES", "1");
      if (data?.itc == "0") {
        body.append("eligible", data?.itc);
      } else if (data?.itc == "1") {
        body.append("ineligible", data?.itc);
      }
    }
    const empid = JSON.parse(userIdString)?.eid;
    if (empid) {
      body.append("emp_code", empid);
    }
    const response = await fetch(base_url + "demo.php", {
      method: "POST",
      body: body,
    });
    const res = await response.json();
    data?.setTotalCount(res.totalcount);
    data?.setSearchCount(res.searchcount);
    return res;
  }
);

// Defective Purchase

export const get_defective_purchase_list = createAsyncThunk(
  "defective_purchase",
  async (data) => {
    const userIdString = localStorage.getItem("userId");
    const userId = JSON.parse(userIdString)?.aid;
    const body = new FormData();
    body.append("action", "list");
    body.append("agencyid", userId);
    body.append("page", data?.pageNo || "");
    body.append("limit", data?.entries || "");
    body.append("search", data?.search || "");
    const empid = JSON.parse(userIdString)?.eid;
    if (empid) {
      body.append("emp_code", empid);
    }
    const response = await fetch(base_url + "demo.php", {
      method: "POST",
      body: body,
    });

    const res = await response.json();
    data?.setTotalCount(res?.totalcount);
    data?.setSearchCount(res.searchcount);

    return res;
  }
);

// Quotation

export const get_quotation_list = createAsyncThunk(
  "quotation",
  async (data) => {
    const userIdString = localStorage.getItem("userId");
    const userId = JSON.parse(userIdString)?.aid;
    const body = new FormData();
    body.append("action", "list");
    body.append("agencyid", userId);
    body.append("page", data?.page || "");
    body.append("limit", data?.limit || "");
    body.append("search", data?.search || "");
    const empid = JSON.parse(userIdString)?.eid;
    if (empid) {
      body.append("emp_code", empid);
    }
    const response = await fetch(base_url + "demo.php", {
      method: "POST",
      body: body,
    });
    const res = await response.json();
    data?.setTotalCount(res?.totalcount);
    data?.setSearchCount(res?.searchcount);
    return res;
  }
);

// Customer Purchase Order

export const get_customer_purchase_order_list = createAsyncThunk(
  "customerpurchase",
  async (data) => {
    const userIdString = localStorage.getItem("userId");
    const userId = JSON.parse(userIdString)?.aid;
    const body = new FormData();
    body.append("action", "list");
    body.append("agencyid", userId);
    body.append("page", data?.page || "1");
    body.append("limit", data?.limit || "10000");
    body.append("search", data?.search || "");
    const empid = JSON.parse(userIdString)?.eid;
    if (empid) {
      body.append("emp_code", empid);
    }
    const response = await fetch(base_url + "demo.php", {
      method: "POST",
      body: body,
    });
    const res = await response.json();
    data?.setTotalCount(res?.totalcount);
    data?.setSearchCount(res?.searchcount);
    return res;
  }
);

// Dom sales

export const get_domestic_sales_list = createAsyncThunk(
  "domesticcylinder",
  async (data) => {
    const userIdString = localStorage.getItem("userId");
    const userId = JSON.parse(userIdString)?.aid;
    const body = new FormData();
    body.append("action", "list");
    body.append("agencyid", userId);
    body.append("page", data?.page || "");
    body.append("limit", data?.limit || "");
    body.append("search", data?.search || "");
    const empid = JSON.parse(userIdString)?.eid;
    if (empid) {
      body.append("emp_code", empid);
    }
    const response = await fetch(base_url + "demo.php", {
      method: "POST",
      body: body,
    });
    const res = await response.json();
    data?.setTotalCount(res?.totalcount);
    data?.setSearchCount(res?.searchcount);
    return res;
  }
);

// Com sales

export const get_commercial_sales_list = createAsyncThunk(
  "commercialSales",
  async (data) => {
    const userIdString = localStorage.getItem("userId");
    const userId = JSON.parse(userIdString)?.aid;
    const body = new FormData();
    body.append("action", "list");
    body.append("agencyid", userId);
    body.append("page", data?.page || "");
    body.append("limit", data?.limit || "");
    body.append("search", data?.search || "");
    const empid = JSON.parse(userIdString)?.eid;
    if (empid) {
      body.append("emp_code", empid);
    }
    const response = await fetch(base_url + "demo.php", {
      method: "POST",
      body: body,
    });
    const res = await response.json();
    data?.setTotalCount(res?.totalcount);
    data?.setSearchCount(res?.searchcount);
    return res;
  }
);

// BLPG Sales

export const get_blpg_arb_sales_list = createAsyncThunk(
  "BLPGARBSales",
  async (data) => {
    const userIdString = localStorage.getItem("userId");
    const userId = JSON.parse(userIdString)?.aid;
    const body = new FormData();
    body.append("action", "list");
    body.append("agencyid", userId);
    body.append("page", data?.pageNo || "");
    body.append("limit", data?.entries || "");
    body.append("search", data?.search || "");
    const empid = JSON.parse(userIdString)?.eid;
    if (empid) {
      body.append("emp_code", empid);
    }
    const response = await fetch(base_url + "demo.php", {
      method: "POST",
      body: body,
    });
    const res = await response.json();
    data?.setTotalCount(res?.totalcount);
    data?.setSearchCount(res?.searchcount);
    return res;
  }
);

// Delivery Challan

export const get_delivery_challan_list = createAsyncThunk(
  "deliverychallan",
  async (data) => {
    const userIdString = localStorage.getItem("userId");
    const userId = JSON.parse(userIdString)?.aid;
    const body = new FormData();
    body.append("action", "list");
    body.append("agencyid", userId);
    // body.append("dc_type", 2);
    // body.append("empid", 765678456);
    body.append("page", data?.page || "");
    body.append("limit", data?.limit || "");
    body.append("search", data?.search || "");
    const empid = JSON.parse(userIdString)?.eid;
    if (empid) {
      body.append("emp_code", empid);
    }
    const response = await fetch(base_url + "demo.php", {
      method: "POST",
      body: body,
    });
    const res = await response.json();
    data?.setTotalCount(res?.totalcount);
    data?.setSearchCount(res?.searchcount);
    return res;
  }
);

// Sales Return

export const get_sales_return_list = createAsyncThunk(
  "salesreturn",
  async (data) => {
    const userIdString = localStorage.getItem("userId");
    const userId = JSON.parse(userIdString)?.aid;
    const body = new FormData();
    body.append("action", "list");
    body.append("agencyid", userId);
    body.append("page", data?.page || "");
    body.append("limit", data?.limit || "");
    body.append("search", data?.search || "");
    const empid = JSON.parse(userIdString)?.eid;
    if (empid) {
      body.append("emp_code", empid);
    }
    const response = await fetch(base_url + "demo.php", {
      method: "POST",
      body: body,
    });
    const res = await response.json();
    data?.setTotalCount(res?.totalcount);
    data?.setSearchCount(res?.searchcount);
    return res;
  }
);

// NC DBC Data

export const get_ncdbc_data_list = createAsyncThunk(
  "ncdbcdata",
  async (data) => {
    const userIdString = localStorage.getItem("userId");
    const userId = JSON.parse(userIdString)?.aid;
    const body = new FormData();
    body.append("action", "list");
    body.append("agencyid", userId);
    body.append("page", data?.page || "");
    body.append("limit", data?.limit || "");
    body.append("search", data?.search || "");
    const empid = JSON.parse(userIdString)?.eid;
    if (empid) {
      body.append("emp_code", empid);
    }
    const response = await fetch(base_url + "demo.php", {
      method: "POST",
      body: body,
    });
    const res = await response.json();
    data?.setTotalCount(res?.totalcount);
    data?.setSearchCount(res?.searchcount);
    return res;
  }
);

// ITV RC Data

export const get_itv_rc_data_list = createAsyncThunk(
  "itvrcdata",
  async (data) => {
    const userIdString = localStorage.getItem("userId");
    const userId = JSON.parse(userIdString)?.aid;
    const body = new FormData();
    body.append("action", "list");
    body.append("agencyid", userId);
    body.append("page", data?.page || "");
    body.append("limit", data?.limit || "");
    body.append("search", data?.search || "");
    const empid = JSON.parse(userIdString)?.eid;
    if (empid) {
      body.append("emp_code", empid);
    }
    const response = await fetch(base_url + "demo.php", {
      method: "POST",
      body: body,
    });
    const res = await response.json();
    data?.setTotalCount(res?.totalcount);
    data?.setSearchCount(res?.searchcount);
    return res;
  }
);

// OTV / TTV Data

export const get_otv_ttv_data_list = createAsyncThunk(
  "otvttvdata",
  async (data) => {
    const userIdString = localStorage.getItem("userId");
    const userId = JSON.parse(userIdString)?.aid;
    const body = new FormData();
    body.append("action", "list");
    body.append("agencyid", userId);
    body.append("page", data?.page || "");
    body.append("limit", data?.limit || "");
    body.append("search", data?.search || "");
    const empid = JSON.parse(userIdString)?.eid;
    if (empid) {
      body.append("emp_code", empid);
    }
    const response = await fetch(base_url + "demo.php", {
      method: "POST",
      body: body,
    });
    const res = await response.json();
    data?.setTotalCount(res?.totalcount);
    data?.setSearchCount(res?.searchcount);
    return res;
  }
);

const initialState = {
  transition_complete_list: {},
  transition_complete_loading: false,
  vendor_purchase_list: [],
  vendor_purchase_loading: false,
  cylinder_purchase_list: [],
  cylinder_purchase_loading: false,
  arb_purchase_list: [],
  arb_purchase_loading: false,
  other_purchase_list: [],
  other_purchase_loading: false,
  defective_purchase_list: [],
  defective_purchase_loading: false,
  quotation_list: [],
  quotation_loading: false,
  customer_purchase_list: [],
  customer_purchase_loading: false,
  domestic_sales_list: [],
  domestic_sales_loading: "",
  commercial_sales_list: [],
  commercial_sales_loading: "",
  blpg_sales_list: [],
  blpg_sales_loading: "",
  delivery_challan_list: [],
  delivery_challan_loading: false,
  return_sales_list: [],
  return_sales_loading: false,
  nc_dbc_data_list: [],
  nc_dbc_data_loading: false,
  itv_rc_data_list: [],
  itv_rc_data_loading: false,
  otv_ttv_data_list: [],
  otv_ttv_data_loading: false,
};

const transactionsSlice = createSlice({
  name: "cylinder_purchase_data",
  initialState: initialState,
  extraReducers: (builder) => {
    // transition complete list

    builder.addCase(get_transition_complete_list.fulfilled, (state, action) => {
      const data = action.payload;
      state.transition_complete_loading = false;

      state.transition_complete_list = data;
    });
    builder.addCase(get_transition_complete_list.pending, (state, action) => {
      state.transition_complete_loading = true;
    });
    builder.addCase(get_transition_complete_list.rejected, (state, action) => {
      state.transition_complete_loading = false;
    });

    // Vendor Purchase List

    builder.addCase(get_vendor_purchase_list.fulfilled, (state, action) => {
      const data = action.payload;
      state.vendor_purchase_loading = false;
      if (data.success) {
        state.vendor_purchase_list = data?.data;
      } else {
        state.vendor_purchase_list = [];
      }
    });
    builder.addCase(get_vendor_purchase_list.pending, (state, action) => {
      state.vendor_purchase_loading = true;
    });
    builder.addCase(get_vendor_purchase_list.rejected, (state, action) => {
      state.vendor_purchase_loading = false;
    });

    // Cylinder Purchase Order

    builder.addCase(get_cylinder_purchase_list.fulfilled, (state, action) => {
      const data = action.payload;
      state.cylinder_purchase_loading = false;
      if (data.success) {
        state.cylinder_purchase_list = data.data;
      } else {
        state.cylinder_purchase_list = [];
      }
    });
    builder.addCase(get_cylinder_purchase_list.pending, (state, action) => {
      state.cylinder_purchase_loading = true;
    });
    builder.addCase(get_cylinder_purchase_list.rejected, (state, action) => {
      state.cylinder_purchase_loading = false;
    });

    // ARB Purchase Order

    builder.addCase(get_arb_purchase_list.fulfilled, (state, action) => {
      const data = action.payload;
      state.arb_purchase_loading = false;
      if (data.success) {
        state.arb_purchase_list = data.data;
      } else {
        state.arb_purchase_list = [];
      }
    });
    builder.addCase(get_arb_purchase_list.pending, (state, action) => {
      state.arb_purchase_loading = true;
    });
    builder.addCase(get_arb_purchase_list.rejected, (state, action) => {
      state.arb_purchase_loading = false;
    });

    // Other Purchase

    builder.addCase(get_other_purchase_list.fulfilled, (state, action) => {
      const data = action.payload;
      state.other_purchase_loading = false;
      if (data.success) {
        state.other_purchase_list = data.data;
      } else {
        state.other_purchase_list = [];
      }
    });
    builder.addCase(get_other_purchase_list.pending, (state, action) => {
      state.other_purchase_loading = true;
    });
    builder.addCase(get_other_purchase_list.rejected, (state, action) => {
      state.other_purchase_loading = false;
    });

    // Defective Purchase

    builder.addCase(get_defective_purchase_list.fulfilled, (state, action) => {
      const data = action.payload;
      state.defective_purchase_loading = false;
      if (data.success) {
        state.defective_purchase_list = data.data;
      } else {
        state.defective_purchase_list = [];
      }
    });
    builder.addCase(get_defective_purchase_list.pending, (state, action) => {
      state.defective_purchase_loading = true;
    });
    builder.addCase(get_defective_purchase_list.rejected, (state, action) => {
      state.defective_purchase_loading = false;
    });

    // Quotation

    builder.addCase(get_quotation_list.fulfilled, (state, action) => {
      const data = action.payload;
      state.quotation_loading = false;
      if (data.success) {
        state.quotation_list = data.data;
      } else {
        state.quotation_list = [];
      }
    });
    builder.addCase(get_quotation_list.pending, (state, action) => {
      state.quotation_loading = true;
    });
    builder.addCase(get_quotation_list.rejected, (state, action) => {
      state.quotation_loading = false;
    });

    // Customer Order

    builder.addCase(
      get_customer_purchase_order_list.fulfilled,
      (state, action) => {
        const data = action.payload;
        state.customer_purchase_loading = false;
        if (data.success) {
          state.customer_purchase_list = data.data;
        } else {
          state.customer_purchase_list = [];
        }
      }
    );
    builder.addCase(
      get_customer_purchase_order_list.pending,
      (state, action) => {
        state.customer_purchase_loading = true;
      }
    );
    builder.addCase(
      get_customer_purchase_order_list.rejected,
      (state, action) => {
        state.customer_purchase_loading = false;
      }
    );

    // Domestic Sales

    builder.addCase(get_domestic_sales_list.fulfilled, (state, action) => {
      const data = action.payload;
      state.domestic_sales_loading = false;
      if (data.success) {
        state.domestic_sales_list = data.data || [];
      } else {
        state.domestic_sales_list = [];
      }
    });
    builder.addCase(get_domestic_sales_list.pending, (state, action) => {
      state.domestic_sales_loading = true;
    });
    builder.addCase(get_domestic_sales_list.rejected, (state, action) => {
      state.domestic_sales_loading = false;
    });

    // Commercial Sales

    builder.addCase(get_commercial_sales_list.fulfilled, (state, action) => {
      const data = action.payload;
      state.commercial_sales_loading = false;
      if (data.success) {
        state.commercial_sales_list = data.data;
      } else {
        state.commercial_sales_list = [];
      }
    });
    builder.addCase(get_commercial_sales_list.pending, (state, action) => {
      state.commercial_sales_loading = true;
    });
    builder.addCase(get_commercial_sales_list.rejected, (state, action) => {
      state.commercial_sales_loading = false;
    });

    // ARB Sales

    builder.addCase(get_blpg_arb_sales_list.fulfilled, (state, action) => {
      const data = action.payload;
      state.blpg_sales_loading = false;
      if (data.success) {
        state.blpg_sales_list = data.data;
      } else {
        state.blpg_sales_list = [];
      }
    });
    builder.addCase(get_blpg_arb_sales_list.pending, (state, action) => {
      state.blpg_sales_loading = true;
    });
    builder.addCase(get_blpg_arb_sales_list.rejected, (state, action) => {
      state.blpg_sales_loading = false;
    });

    // Delivery Challan

    builder.addCase(get_delivery_challan_list.fulfilled, (state, action) => {
      const data = action.payload;
      state.delivery_challan_loading = false;
      if (data.success) {
        state.delivery_challan_list = data.data;
      } else {
        state.delivery_challan_list = [];
      }
    });
    builder.addCase(get_delivery_challan_list.pending, (state, action) => {
      state.delivery_challan_loading = true;
    });
    builder.addCase(get_delivery_challan_list.rejected, (state, action) => {
      state.delivery_challan_loading = false;
    });

    // Sales Return

    builder.addCase(get_sales_return_list.fulfilled, (state, action) => {
      const data = action.payload;
      state.return_sales_loading = false;
      if (data.success) {
        state.return_sales_list = data.data;
      } else {
        state.return_sales_list = [];
      }
    });
    builder.addCase(get_sales_return_list.pending, (state, action) => {
      state.return_sales_loading = true;
    });
    builder.addCase(get_sales_return_list.rejected, (state, action) => {
      state.return_sales_loading = false;
    });

    // NC DBC Data

    builder.addCase(get_ncdbc_data_list.fulfilled, (state, action) => {
      const data = action.payload;
      state.nc_dbc_data_loading = false;
      if (data.success) {
        state.nc_dbc_data_list = data.data;
      } else {
        state.nc_dbc_data_list = [];
      }
    });
    builder.addCase(get_ncdbc_data_list.pending, (state, action) => {
      state.nc_dbc_data_loading = true;
    });
    builder.addCase(get_ncdbc_data_list.rejected, (state, action) => {
      state.nc_dbc_data_loading = false;
    });

    // NC DBC Data

    builder.addCase(get_itv_rc_data_list.fulfilled, (state, action) => {
      const data = action.payload;
      state.itv_rc_data_loading = false;
      if (data.success) {
        state.itv_rc_data_list = data.data;
      } else {
        state.itv_rc_data_list = [];
      }
    });
    builder.addCase(get_itv_rc_data_list.pending, (state, action) => {
      state.itv_rc_data_loading = true;
    });
    builder.addCase(get_itv_rc_data_list.rejected, (state, action) => {
      state.itv_rc_data_loading = false;
    });

    // OTV/TTV Data

    builder.addCase(get_otv_ttv_data_list.fulfilled, (state, action) => {
      const data = action.payload;
      state.otv_ttv_data_loading = false;
      if (data.success) {
        state.otv_ttv_data_list = data.data;
      } else {
        state.otv_ttv_data_list = [];
      }
    });
    builder.addCase(get_otv_ttv_data_list.pending, (state, action) => {
      state.otv_ttv_data_loading = true;
    });
    builder.addCase(get_otv_ttv_data_list.rejected, (state, action) => {
      state.otv_ttv_data_loading = false;
    });
  },
});

export default transactionsSlice.reducer;
