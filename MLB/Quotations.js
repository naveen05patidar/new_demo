import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import store from "../../../redux/store";
import {
  get_arb_list,
  get_bank_master_list,
  get_customer_vender_list,
  get_equipment_list,
  get_service_master_list,
  get_staff_list,
} from "../../MasterData/masterdataSlice";
import {
  get_quotation_list,
  get_transition_complete_list,
} from "../trasactionsSlice";
import { GST_data_api, quotation_sales_api } from "../../../utils/apis";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader";
import PageHeading from "../../../components/PageHeading";
import {
  AddButton,
  BackButton,
  SaveButton,
} from "../../../components/btn/Buttons";
import PageLoading from "../../../components/PageLoading";
import RowTxt from "../../../components/RowTxt";
import { DeleteIcon, Radio } from "../../../utils/utils";
import Modal from "../../../components/modal/Modal";
import Button from "../../../components/btn/Button";
import Dropdown from "../../../components/inputs/Dropdown";
import Input from "../../../components/inputs/Input";
import RadioBtn from "../../../components/radio/RadioBtn";
import Table from "../../../components/table/Table";
import SmallModal from "../../../components/modal/SmallModal";
import moment from "moment";
import { motion } from "framer-motion";
import NoData from "../../../components/NoData";
import { DateValidator2, UnitFunction } from "../../../utils/validation";
import { HiOutlineArrowRight } from "react-icons/hi";
import {
  CVOList,
  EquipmentList,
  PriceList,
  StaffList,
} from "../../../components/StaticLists/staticLists";
import { Pagination3 } from "../../../components/pagination/pagination";
import { DropInput } from "../../../components/inputs/DropInput";
import ReactToPrint from "react-to-print";
import { Alerts } from "../../../components/Alerts/Alerts";
import useUniqueEquipmentList from "../../../utils/Hook/useUniqueEquipmentList";
import SearchApiHook from "../../../CustomHooks/SearchApiHook";
import { EmailValidation, MobileValidation } from "../../../utils/validator";

import { ReduceFunction } from "../../../utils/Hook/ReduceFunction";
import TaxInvoice3 from "../../../components/TaxInvoice/TaxInvoice3";

export const Quotations = () => {
  const previewRef = useRef(null);
  const [isAdd, setIsAdd] = useState(false);
  const [addData, setAddData] = useState([]);
  const [addDataHead, setAddDataHead] = useState({});
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [mess, setMess] = useState("");
  const [id, setId] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [cvoClick, setCvoClick] = useState(false);
  const [EquipClick, setEquipClick] = useState(false);
  const [PriceClick, setPriceClick] = useState(false);
  const [StaffClick, setStaffClick] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [viewItem, setViewItem] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [entries, setEntries] = useState("5");
  const [totalCount, setTotalCount] = useState("");
  const [SerchInput, setSearchInput] = useState("");
  const [prevSearch, setPrevSearch] = useState("");
  const [SearchCount, setSearchCount] = useState(0);

  // Fetch Dada from the redux 

  const { quotation_list, quotation_loading, transition_complete_list } =
    useSelector((state) => state.transactions);

  const { profile_data, day_end_date } = useSelector((state) => state.profile);
  const {
    equipment_list,
    service_master_list,
    arb_list,
    cust_vend_list,
    staff_list,
    bank_master_list,
  } = useSelector((state) => state.masterdata);
  const { eff_date, user_id, today, emp_id, user_type } = useSelector(
    (state) => state.other
  );

  // remove duplicate item from the list 
  const uniqueEquipmentList = useUniqueEquipmentList(equipment_list);

  const obj = {
    page: pageNo,
    limit: entries,
    setTotalCount: setTotalCount,
    setSearchCount: setSearchCount,
    search: SerchInput,
  };

// Fetch all the required List (this list also contains there own components) 

  useEffect(() => {
    store.dispatch(get_equipment_list());
    store.dispatch(get_arb_list());
    store.dispatch(get_service_master_list());
    store.dispatch(get_customer_vender_list());
    store.dispatch(get_staff_list());
    store.dispatch(get_transition_complete_list());
    store.dispatch(get_bank_master_list());
  }, []);


  const fetchData = () => {
    store.dispatch(get_quotation_list(obj));
  };

  // Search option Hook for debounching and search 
  SearchApiHook(fetchData, SerchInput?.trim(), prevSearch, [entries, pageNo]);

  // Delete Particuler Item

  const onDelete_item = () => {
    setOpen(false);
    const body = new FormData();
    body.append("action", "delete");
    body.append("agencyid", user_id);
    body.append("id", id);
    if (emp_id) {
      body.append("emp_code", emp_id);
    }
    quotation_sales_api(body, setShowLoader).then((v) => {
      if (v?.success) {
        store.dispatch(get_quotation_list(obj));
        toast(v?.message);
      } else {
        setOpen1(true);
        setMess(v?.message);
      }
    });
  };

  // Fetch Gst For the particuler item 

  const fetchGST = async () => {
    if (!addData[addData.length - 1]?.product_code) {
      setOpen1(true);
      setMess("Please Select PRODUCT and Click FETCH GST");
    } else if (
      !addDataHead?.qtn_date ||
      (addDataHead?.qtn_date && addDataHead?.qtn_date?.length != 10)
    ) {
      setOpen1(true);
      setMess("Please Select Quotation Date");
    } else {
      try {
        setShowLoader(true);
        const body = new FormData();
        body.append("action", "fetchgst");
        body.append("agencyid", user_id);
        addData.forEach((v) => body.append("type", v.product_category));
        addData.forEach((v) => body.append("pcode", v.product_code));
        body.append("q_date", addDataHead?.qtn_date);

        const response = await quotation_sales_api(body, setShowLoader);
        setShowLoader(false);
        if (response.success) {
          setAddData((prev) =>
            prev.map((v, i) =>
              i === addData.length - 1
                ? {
                    ...v,
                    p_gst: Number(
                      response?.GSTP == "NA"
                        ? 0
                        : response?.GSTP || response?.GST_AMT
                    ).toFixed(0),
                    unit_rate: response?.BASE_PRICE || response?.PROD_CHARGES,
                  }
                : v
            )
          );
        } else if (
          !response.success &&
          response.message == "Product code not found"
        ) {
          setOpen1(true);
          setMess(
            "Please define the price of product for sale invoice month in it's price master and continue"
          );
        }
      } catch (error) {
        setOpen1(true);
        setMess(error.message);
      }
    }
  };

  // Calculate the all rows available in add data 
  const calculate = () => {
    if (
      !addDataHead?.customer_name ||
      (addDataHead?.customer_name && addDataHead?.customer_name.length === 0)
    ) {
      setMess("Please Enter Customer Name");
      setOpen1(true);
      return;
    }
    addData?.forEach((product, index) => {
      if (
        !product?.quantity ||
        product?.quantity == 0 ||
        (product?.quantity && product?.quantity.length == 0) ||
        !product?.discount_price ||
        (product?.discount_price && product?.discount_price.length == 0) ||
        parseFloat(product?.discount_price) >= parseFloat(product?.unit_rate)
      ) {
        setMess(
          `${
            !product?.quantity ||
            product?.quantity == 0 ||
            (product?.quantity && product?.quantity.length == 0)
              ? "Please Enter QUANTITY."
              : ""
          } \n
                  ${
                    !product?.discount_price ||
                    (product?.discount_price &&
                      product?.discount_price.length == 0)
                      ? "Please Enter Discount Price."
                      : ""
                  }
                   \n
                    ${
                      parseFloat(product?.discount_price) >=
                      parseFloat(product?.unit_rate)
                        ? "Discount Price Always less on Unit Price."
                        : ""
                    }
                    `
        );
        setOpen1(true);
        return;
      }
    });
    if (addData?.length > 0) {
      var amt = 0;
      addData?.forEach((product, index) => {
        if (
          !product?.quantity ||
          product?.quantity == 0 ||
          (product?.quantity && product?.quantity.length == 0) ||
          !product?.discount_price ||
          (product?.discount_price && product?.discount_price.length == 0) ||
          parseFloat(product?.discount_price) >= parseFloat(product?.unit_rate)
        ) {
          setMess(
            `${
              !product?.quantity ||
              product?.quantity == 0 ||
              (product?.quantity && product?.quantity.length == 0)
                ? "Please Enter QUANTITY."
                : ""
            } \n
                    ${
                      !product?.discount_price ||
                      (product?.discount_price &&
                        product?.discount_price.length == 0)
                        ? "Please Enter Discount Price."
                        : ""
                    }
                      ${
                        parseFloat(product?.discount_price) >=
                        parseFloat(product?.unit_rate)
                          ? "Discount Price Always less on Unit Price."
                          : ""
                      }
                      `
          );
          setOpen1(true);
          return;
        } else {
          if (addDataHead?.c_type || addDataHead?.c_type?.length > 0) {
            const unit_rate = Number(product?.unit_rate);
            const discount_price = Number(product?.discount_price);
            const quantity = Number(product?.quantity);
            const p_gst = Number(product?.p_gst);

            const tax_amount = (unit_rate - discount_price) * quantity;
            const gst_amount = tax_amount * (p_gst / 100);
            const amount = gst_amount + tax_amount;

            if (addDataHead?.c_type === "isp") {
              setAddData((prevData) => {
                const updatedData = [...prevData];
                updatedData[index] = {
                  ...updatedData[index],
                  tax_amount: Number(tax_amount || "0.0").toFixed(2),
                  igst_amount: Number(gst_amount || "0.0").toFixed(2),
                  cgst_amount: "0.0",
                  sgst_amount: "0.0",
                  amount: Number(amount).toFixed(2),
                };
                return updatedData;
              });
            } else if (addDataHead?.c_type === "lp") {
              setAddData((prevData) => {
                const updatedData = [...prevData];
                updatedData[index] = {
                  ...updatedData[index],
                  tax_amount: Number(tax_amount || "0.0").toFixed(2),
                  cgst_amount: Number(gst_amount / 2 || "0.0").toFixed(2),
                  sgst_amount: Number(gst_amount / 2 || "0.0").toFixed(2),
                  igst_amount: "0.0",
                  amount: Number(amount).toFixed(2),
                };
                return updatedData;
              });
            }
            amt += amount;
          } else {
            setMess(`Please Select Sale Type`);
            setOpen1(true);
          }
        }
      });
      setAddDataHead({ ...addDataHead, inv_amount: Number(amt).toFixed(2) });
    }
  };

  const validation_check = () => {
    if (
      addData.find(
        (v) =>
          !v?.product_code ||
          (v.product_code && v.product_code.length == 0) ||
          !v.p_gst ||
          (v.p_gst && v.p_gst.length == 0) ||
          !v.unit_rate ||
          (v.unit_rate && v.unit_rate.length == 0) ||
          !v.quantity ||
          v.quantity == 0 ||
          (v.quantity && v.quantity.length == 0) ||
          !v.discount_price ||
          // v.discount_price == 0 ||
          (v.discount_price && v.discount_price.length == 0) ||
          !v.tax_amount ||
          (v.tax_amount && v.tax_amount.length == 0) ||
          !v.igst_amount ||
          (v.igst_amount && v.igst_amount.length == 0) ||
          !v.sgst_amount ||
          (v.sgst_amount && v.sgst_amount.length == 0) ||
          !v.cgst_amount ||
          (v.cgst_amount && v.cgst_amount.length == 0) ||
          !v.amount ||
          (v.amount && v.amount.length == 0)
      )
    ) {
      return true;
    }
    return false;
  };

  // Validate all the addData  and  addDataHead state fields

  const valiDate = () => {
    const data = [];
    if (
      !addDataHead?.qtn_date ||
      (addDataHead?.qtn_date && addDataHead?.qtn_date.length === 0)
    ) {
      data.push("Please Enter Purchase Quotation Date");
    } else if (
      DateValidator2(
        moment(addDataHead?.qtn_date).format("DD/MM/YYYY"),
        today,
        day_end_date
      ) !== true
    ) {
      data.push(
        DateValidator2(
          moment(addDataHead?.qtn_date).format("DD/MM/YYYY"),
          today,
          day_end_date,
          `Quotation Date cant be a below as ${day_end_date} (Day end Date)`,
          `Quotation Date cant be a future date`
        )
      );
    }
    if (
      !addDataHead?.cust_reg ||
      (addDataHead?.cust_reg && addDataHead?.cust_reg.length === 0)
    ) {
      data.push("Please Select Customer Registration");
    }
    if (addDataHead?.cust_reg) {
      if (
        !addDataHead?.customer_name ||
        (addDataHead?.customer_name && addDataHead?.customer_name.length === 0)
      ) {
        data.push("Please Enter Customer Name");
      }
      if (addDataHead?.cust_reg == "0") {
        if (
          !addDataHead?.address ||
          (addDataHead?.address && addDataHead?.address.length === 0)
        ) {
          data.push("Please Enter Customer Address");
        } else if (addDataHead?.address?.length < 25) {
          data.push("Customer Address Must Contain atleast 25 Characters");
        } else if (addDataHead?.address?.length > 200) {
          data.push("Customer Address max length is 200 Characters");
        }
        if (
          addDataHead?.gst_num?.length > 0 &&
          addDataHead?.gst_num?.length != 15
        ) {
          data.push("Please Enter Valid GST Number");
        }
        if (!EmailValidation.test(addDataHead?.email)) {
          if (!addDataHead?.email || addDataHead?.email?.length == 0) {
            data.push("Please enter valid email id");
          } else {
            data.push(" Please enter valid data for EMAIL ID field.");
          }
        }
        if (!addDataHead?.contact || addDataHead?.contact?.length == 0) {
          data.push("Please enter valid CONTACT NO.");
        } else if (
          !MobileValidation.test(
            addDataHead?.contact || addDataHead?.contact?.length != 10
          )
        ) {
          data.push("Please enter Valid CONTACT NO. field");
        }
      }
    }

    if (
      !addDataHead?.staff_name ||
      (addDataHead?.staff_name && addDataHead?.staff_name.length === 0)
    ) {
      data.push("Please Select Staff Name");
    }
    if (
      !addDataHead?.foot_note ||
      (addDataHead?.foot_note && addDataHead?.foot_note.length === 0)
    ) {
      data.push("Please Enter Foot Note");
    }
    if (
      !addDataHead?.c_type ||
      (addDataHead?.c_type && addDataHead?.c_type.length === 0)
    ) {
      data.push("Please Select SALE TYPE");
    }

    for (let v of addData) {
      if (
        !v.product_category ||
        (v.product_category && v.product_category.length === 0)
      ) {
        data.push("Please Select PRODUCT CATEGORY");
      } else if (
        !v.product_code ||
        (v.product_code && v.product_code.length === 0)
      ) {
        data.push("Please Select PRODUCT");
      } else if (
        !v.unit_rate ||
        (v.unit_rate && v.unit_rate.length === 0) ||
        !v.p_gst ||
        (v.p_gst && v.p_gst.length === 0)
      ) {
        data.push("first Click on FETCH GST ");
      }

      if (!v.quantity || (v.quantity && v.quantity.length === 0)) {
        data.push("Please Enter Quantity");
      } else if (v.quantity == 0) {
        data.push("Please Enter valid Quantity");
      }
      if (
        !v.discount_price ||
        (v.discount_price && v.discount_price.length === 0)
      ) {
        data.push("Please Enter Discount Price");
      }

      // if (Number(v.discount_price) >= Number(v.unit_rate)) {
      //   data.push("DISCOUNT ON UNIT PRICE Must Be Less Than UNIT PRICE.");
      // }
 

      if (parseFloat(v.discount_price) >= parseFloat(v.unit_rate)) {
        data.push("DISCOUNT ON UNIT PRICE Must Be Less Than UNIT PRICE.");
      }

      if (!v.tax_amount || (v.tax_amount && v.tax_amount.length === 0)) {
        data.push("Please Click on Calculate");
      } else if (
        !v.igst_amount ||
        (v.igst_amount && v.igst_amount.length === 0)
      ) {
        data.push("Please Click on Calculate");
      } else if (
        !v.sgst_amount ||
        (v.sgst_amount && v.sgst_amount.length === 0)
      ) {
        data.push("Please Click on Calculate");
      } else if (
        !v.cgst_amount ||
        (v.cgst_amount && v.cgst_amount.length === 0)
      ) {
        data.push("Please Click on Calculate");
      } else if (!v.amount || (v.amount && v.amount.length === 0)) {
        data.push("Please Click on Calculate");
      } else if (
        !addDataHead?.inv_amount ||
        (addDataHead?.inv_amount && addDataHead?.inv_amount.length === 0)
      ) {
        data.push("Please Click on Calculate");
      }
    }
    return data;
  };

  // Add Functiuon for add item 

  const add_items = async () => {
    const data1 = valiDate();
    const data = [...new Set(data1)];
    if (data.length == 0) {
      try {
        setShowLoader(true);
        const body = new FormData();
        body.append("action", "create");
        body.append("agencyid", user_id);
        body.append("q_date", addDataHead?.qtn_date);
        body.append("customer_list", addDataHead?.customer_id || "");
        body.append("customer_name", addDataHead?.customer_name);
        body.append("staff", addDataHead?.staff_name);
        body.append("foot_notes", addDataHead?.foot_note);
        body.append("q_value", addDataHead?.inv_amount);
        body.append("connection_type", addDataHead?.c_type);
        body.append("cust_reg", addDataHead?.cust_reg);
        body.append(
          "address",
          addDataHead?.cust_reg == "0" ? addDataHead?.address : "" || ""
        );
        body.append(
          "mobile",
          addDataHead?.cust_reg == "0" ? addDataHead?.contact : "" || ""
        );
        body.append(
          "email",
          addDataHead?.cust_reg == "0" ? addDataHead?.email : "" || ""
        );
        body.append(
          "gstin",
          addDataHead?.cust_reg == "0"
            ? addDataHead?.gst_num
              ? addDataHead?.gst_num
              : ""
            : ""
        );

        addData.forEach((item) => {
          if (item) {
            body.append("procode[]", item?.product_code);
            body.append("gst[]", item?.p_gst);
            body.append("quantity[]", item?.quantity);
            body.append("unit_price[]", item?.unit_rate);
            body.append("dis_price[]", item?.discount_price);
            body.append("tax_amount[]", item?.tax_amount);
            body.append("igst_amount[]", item?.igst_amount);
            body.append("cgst_amount[]", item?.cgst_amount);
            body.append("sgst_amount[]", item?.sgst_amount);
            body.append("total_amount[]", item?.amount);
          }
        });
        if (emp_id) {
          body.append("emp_code", emp_id);
        }
        const responce = await quotation_sales_api(body, setShowLoader);
        setShowLoader(false);
        if (responce.success) {
          store.dispatch(get_quotation_list(obj));
          setAddData([]);
          setAddDataHead({});
          toast(responce.message);
          setIsAdd(false);
        } else {
          toast(responce.message);
        }
      } catch (error) {
        setShowLoader(false);
        console.log(error);
      }
    } else {
      setMess(<Alerts data={data} />);
      setOpen1(true);
    }
  };

  return (
    <div className="container">
      {/* Page Heading Component */}
      <PageHeading
        title={"QUOTATIONS"}
        right={
          <>
            <AddButton
              onClick={() => {
                setAddData([{}]);
                setAddDataHead({});
                setIsAdd(true);
              }}
            />
            <BackButton />
          </>
        }
      />
      {/* Pagination with data cards  */}
      <Pagination3
        totalCount={totalCount > SearchCount ? SearchCount : totalCount}
        SerchInput={SerchInput}
        serchChange={(e) => {
          setSearchInput(e.target.value);
          setPrevSearch(SerchInput);
          setPageNo(1);
        }}
        pageNo={pageNo}
        setPageNo={setPageNo}
        entries={entries}
        setEntries={setEntries}
      >
        {quotation_loading ? (
          <PageLoading />
        ) : quotation_list?.length == 0 ? (
          <NoData />
        ) : (
          <div className="grid">
            {quotation_list.map((v, i) => (
              <div className="card" key={i}>
                <div>
                  <div className="card-heading">
                    {v?.CVO_NAME || v?.CUSTOMER_NAME}
                  </div>
                  <RowTxt
                    title={"Quotation No."}
                    value={
                      <ReactToPrint
                        trigger={() => (
                          <div
                            onMouseEnter={() => {
                              setViewItem(v);
                            }}
                            onTouchStart={() => {
                              setViewItem(v);
                            }}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setViewItem(v);
                            }}
                          >
                            {v?.SR_NO}
                          </div>
                        )}
                        content={() => previewRef.current}
                        documentTitle={`${v?.CVO_NAME || v?.CUSTOMER_NAME}-${
                          v?.SR_NO
                        }`}
                      />
                    }
                  />
                  <RowTxt
                    title={"Quotation Date"}
                    value={moment(v?.quotation_date).format("DD-MMM-YYYY")}
                  />
                  <RowTxt title={"Staff Name"} value={v?.EMP_NAME} />
                  <RowTxt title={"Foot Notes"} value={v?.FOOT_NOTES} />
                  {v?.EMAIL && <RowTxt title={"Email"} value={v?.EMAIL} />}
                  {v?.CONTACT_NUMBER && (
                    <RowTxt title={"Contact No."} value={v?.CONTACT_NUMBER} />
                  )}
                  <RowTxt title={"Created By"} value={v?.CREATED_NAME || "-"} />
                </div>
                <div
                  className="df jcsb mt10"
                  style={{
                    justifyContent:
                      user_type != "admin" && v?.EMPLOYEE_CODE != emp_id
                        ? "flex-end"
                        : "space-between",
                  }}
                >
                  {user_type == "admin" || v?.EMPLOYEE_CODE == emp_id ? (
                    <DeleteIcon
                      onClick={() => {
                        setId(v?.ID);
                        setOpen(true);
                      }}
                    />
                  ) : (
                    ""
                  )}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 1.05 }}
                    className="flex aic gap10 jce cursor-pointer"
                  >
                    <div
                      className="view-btn"
                      onClick={() => {
                        setOpenView(true);
                        setViewItem(v);
                      }}
                    >
                      View
                    </div>
                    <HiOutlineArrowRight size={20} color="#1b64af" />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Pagination3>

      {/* Add Modal for add product */}

      {isAdd && (
        <Modal
          onCancel={() => {
            setAddData([]);
            setAddDataHead({});
          }}
          isOpen={isAdd}
          setIsOpen={setIsAdd}
          header_right={
            <div className="flex aic gap10">
              <Button title={"CVO"} back onClick={() => setCvoClick(true)} />
              <Button
                title={"EQUIPMENT"}
                back
                onClick={() => setEquipClick(true)}
              />
              <Button
                title={"PRICE"}
                back
                onClick={() => {
                  setPriceClick(true);
                }}
              />
              <Button
                title={"STAFF"}
                back
                onClick={() => setStaffClick(true)}
              />
            </div>
          }
          title={"QUOTATIONS"}
          body={
            <div>
              {/* AddDataHead Fields (Normal Object) */}
              <div className="flex aic gap10 credit-limit">
                <Input
                  label={"QUOTATION DATE"}
                  type={"date"}
                  value={addDataHead.qtn_date}
                  onChange={(e) => {
                    if (e.target.value.length <= 10) {
                      setAddDataHead({
                        ...addDataHead,
                        qtn_date: e.target.value,
                        inv_amount: "",
                      });

                      addData.forEach((data, index) => {
                        setAddData((prevData) => {
                          return prevData.map((item, i) => {
                            if (i === index) {
                              return {
                                ...item,
                                unit_rate: "",
                                p_gst: "",
                                tax_amount: "",
                                cgst_amount: "",
                                sgst_amount: "",
                                igst_amount: "",
                                amount: "",
                              };
                            }
                            return item;
                          });
                        });
                      });
                    }
                  }}
                />
                <Dropdown
                  width2=""
                  onChange={(e) => {
                    setAddDataHead({
                      ...addDataHead,
                      cust_reg: e.target.value,
                      customer_name: "",
                      customer_id: "",
                      gst_num: "",
                      address: "",
                    });
                  }}
                  value={addDataHead?.cust_reg}
                  label={"CUSTOMER REG."}
                  options={
                    <>
                      <option value={""}>SELECT</option>
                      <option value={"1"}>YES</option>
                      <option value={"0"}>NO</option>
                    </>
                  }
                />
                <DropInput
                  label={"CUSTOMER NAME"}
                  id="cust"
                  placeholder={"CUSTOMER NAME"}
                  value={addDataHead?.customer_name}
                  onChange={(e) => {
                    const data = cust_vend_list?.filter(
                      (item) =>
                        item?.CVO_CAT == "1" && item?.ID == e.target.value
                    );
                    const data1 = transition_complete_list?.Customer?.filter(
                      (v) => v.ID == e.target.value
                    )[0];
                    setAddDataHead({
                      ...addDataHead,
                      customer_name:
                        addDataHead?.cust_reg == "1"
                          ? data[0]?.cvo_name
                          : e.target.value || "",
                      customer_id:
                        addDataHead?.cust_reg == "1"
                          ? e.target.value
                          : "" || "",
                      c_type:
                        addDataHead?.cust_reg == "1"
                          ? data1?.connection_type
                          : "",
                      c_type_dis: data1 ? true : false,
                    });
                  }}
                  list={
                    addDataHead?.cust_reg == "1"
                      ? cust_vend_list
                          ?.filter((item) => item?.CVO_CAT == "1")
                          ?.map((v, i) => (
                            <option key={i} value={v?.ID}>
                              {v?.cvo_name?.toUpperCase()}
                            </option>
                          ))
                      : ""
                  }
                />
                {addDataHead?.cust_reg == "0" && (
                  <>
                    <Input
                      label={"ADDRESS"}
                      placeholder={"ADDRESS"}
                      value={addDataHead?.address}
                      onChange={(e) => {
                        if (e.target.value.length <= 200) {
                          setAddDataHead({
                            ...addDataHead,
                            address: e.target.value,
                          });
                        }
                      }}
                    />
                    <Input
                      label={"GST No."}
                      placeholder={"GST No."}
                      value={addDataHead?.gst_num}
                      onChange={async (e) => {
                        let GSTInputValue = e.target.value.toUpperCase();
                        const validInput = GSTInputValue.replace(
                          /[^a-zA-Z0-9]/g,
                          ""
                        );
                        if (validInput.length <= 15) {
                          setAddDataHead({
                            ...addDataHead,
                            gst_num: validInput,
                          });
                        }
                        if (validInput?.length == 15) {
                          try {
                            const body = new FormData();
                            body.append("gstin", validInput);
                            const response = await GST_data_api(body);
                            if (response.error == false) {
                            } else if (response.error == true) {
                              setAddDataHead({
                                ...addDataHead,
                                gst_num: "",
                              });
                              setMess(
                                response.errmsg == null
                                  ? "Please enter valid GSTIN"
                                  : response?.errmsg
                              );
                              setOpen1(true);
                            }
                          } catch (error) {
                            console.log(error);
                          }
                        }
                      }}
                    />
                    <Input
                      label="MOBILE NO."
                      placeholder={"MOBILE NO"}
                      value={addDataHead?.contact}
                      onChange={(e) => {
                        const input = e.target.value.replace(/[^0-9]/g, "");
                        if (input.length <= 10) {
                          setAddDataHead({
                            ...addDataHead,
                            contact: input,
                          });
                        }
                      }}
                    />

                    <Input
                      label="EMAIL"
                      placeholder={"EMAIL"}
                      value={addDataHead?.email}
                      onChange={(e) => {
                        setAddDataHead({
                          ...addDataHead,
                          email: e.target.value?.trim(),
                        });
                      }}
                    />
                  </>
                )}

                <Dropdown
                  width2=""
                  value={addDataHead?.staff_name}
                  onChange={(e) => {
                    setAddDataHead({
                      ...addDataHead,
                      staff_name: e.target.value,
                    });
                  }}
                  label={"STAFF NAME"}
                  options={
                    <>
                      <option value={""}>SELECT</option>
                      {staff_list.length > 0 &&
                        staff_list.map((v) => (
                          <option key={v.ID} value={v.ID}>
                            {v.EMP_NAME}
                          </option>
                        ))}
                    </>
                  }
                />
                <Input
                  label={"FOOT NOTES"}
                  placeholder={"FOOT NOTES"}
                  value={addDataHead.foot_note}
                  onChange={(e) =>
                    setAddDataHead({
                      ...addDataHead,
                      foot_note: e.target.value,
                    })
                  }
                />
                <Input
                  label={"QUOTATION VALUE"}
                  placeholder={"QUOTATION AMOUNT"}
                  value={addDataHead.inv_amount}
                  disabled={true}
                />
              </div>
              <div className="flex aic gap10 mt10">
                <RadioBtn label={"SALE TYPE"} />
                <Radio
                  title={"LOCAL SALE"}
                  disabled={addDataHead?.c_type_dis}
                  show={addDataHead.c_type == "lp" ? true : false}
                  setShow={() =>
                    setAddDataHead({ ...addDataHead, c_type: "lp" })
                  }
                />
                <Radio
                  disabled={addDataHead?.c_type_dis}
                  title={"INTER-STATE SALE"}
                  show={addDataHead.c_type == "isp" ? true : false}
                  setShow={() =>
                    setAddDataHead({ ...addDataHead, c_type: "isp" })
                  }
                />
              </div>
              {/* AddData Fields (multiple add Functionality using array object) */}

              <div
                style={{
                  maxHeight: "20%",
                  overflow: "scroll",
                  display: "flex",
                  height: "100%",
                  position: "relative",
                }}
              >
                <Table
                  headData={[
                    "PRODUCT CATEGORY",
                    "PRODUCT",
                    "GST%",
                    "UNIT RATE ",
                    "DISCOUNT ON UNIT PRICE",
                    "QUANTITY",
                    "TAXABLE AMOUNT",
                    "IGST AMOUNT",
                    "CGST AMOUNT",
                    "SGST AMOUNT	",
                    "TOTAL AMOUNT",
                    "ACTIONS",
                  ]}
                  body={addData?.map((val, ind) => (
                    <tr key={ind}>
                      <td>
                        {
                          <Dropdown
                            disabled={addData?.length > ind + 1}
                            options={
                              <>
                                <option value={""}>{"SELECT"}</option>
                                <option value={"1"}>{"EQUIPMENT"}</option>
                                <option value={"2"}>{"BLPG/ARB/NFR"}</option>
                                <option value={"3"}>{"SERVICES"}</option>
                              </>
                            }
                            onChange={(e) => {
                              setAddData((pre) =>
                                pre.map((v, i) =>
                                  i == ind
                                    ? {
                                        ...v,
                                        product_category: e.target.value,
                                        product_code: "",
                                        p_gst: "",
                                        unit_rate: "",
                                        igst_amount: "",
                                        cgst_amount: "",
                                        sgst_amount: "",
                                        tax_amount: "",
                                        amount: "",
                                      }
                                    : { ...v }
                                )
                              );
                              setAddDataHead({
                                ...addDataHead,
                                inv_amount: "",
                              });
                            }}
                            value={val.product_category}
                          />
                        }
                      </td>
                      <td>
                        <Dropdown
                          disabled={addData?.length > ind + 1}
                          onChange={(e) => {
                            setAddData((pre) =>
                              pre.map((v, i) =>
                                i == ind
                                  ? {
                                      ...v,
                                      product_code: e.target.value,
                                      p_gst: "",
                                      unit_rate: "",
                                      igst_amount: "",
                                      cgst_amount: "",
                                      sgst_amount: "",
                                      tax_amount: "",
                                      amount: "",
                                    }
                                  : { ...v }
                              )
                            );
                            setAddDataHead({ ...addDataHead, inv_amount: "" });
                          }}
                          options={
                            <>
                              <option value={""}>{"SELECT"}</option>
                              {addData[ind]?.product_category == "1" &&
                                uniqueEquipmentList
                                  ?.filter((v, i) => v?.CAT_NAME != "DOMESTIC")
                                  ?.map((v, i) => (
                                    <option
                                      disabled={
                                        addData?.filter(
                                          (s) => s?.product_code == v.PROD_CODE
                                        )?.length > 0
                                      }
                                      value={v.PROD_CODE}
                                      key={i}
                                    >
                                      {v.CAT_NAME} - {v.product_name}
                                    </option>
                                  ))}
                              {addData[ind]?.product_category === "2" &&
                                arb_list?.map((v, i) => (
                                  <option
                                    disabled={
                                      addData?.filter(
                                        (s) =>
                                          s?.product_code == v?.PROD_CODE ||
                                          s?.product_code == v.ID
                                      )?.length > 0
                                    }
                                    value={v.ID}
                                    key={i}
                                  >
                                    {v.category_description} - {v.PROD_BRAND} -
                                    {v.PROD_NAME}
                                  </option>
                                ))}

                              {addData[ind]?.product_category == "3" &&
                                service_master_list?.map((v, i) => (
                                  <option
                                    disabled={
                                      addData?.filter(
                                        (s) =>
                                          s?.product_code == v?.PROD_CODE ||
                                          s?.product_code == v.ID
                                      )?.length > 0
                                    }
                                    value={v.PROD_CODE || v?.ID}
                                    key={i}
                                  >
                                    {v.CAT_DESC}
                                  </option>
                                ))}
                            </>
                          }
                        />
                      </td>
                      <td>
                        {
                          <Input
                            disabled={true}
                            value={val.p_gst}
                            placeholder={"GST%"}
                          />
                        }
                      </td>
                      <td>
                        {
                          <Input
                            placeholder={"UNIT RATE"}
                            value={val.unit_rate}
                            disabled={true}
                          />
                        }
                      </td>
                      <td>
                        {
                          <Input
                            placeholder={"DISCOUNT ON UNIT PRICE"}
                            value={val.discount_price}
                            onChange={(event) => {
                              const inputValue = event.target.value;
                              if (
                                (inputValue?.length < 11 &&
                                  /^(0|[1-9]\d{0,6})(\.\d{0,2})?$/.test(
                                    inputValue
                                  )) ||
                                event.target.value == 0 ||
                                !val?.discount_price
                              ) {
                                setAddData((pre) =>
                                  pre.map((v, i) =>
                                    i === ind
                                      ? {
                                          ...v,
                                          discount_price:
                                            /^(0|[1-9]\d{0,6})(\.\d{0,2})?$/.test(
                                              inputValue
                                            )
                                              ? inputValue
                                              : "",
                                          tax_amount: "",
                                          igst_amount: "",
                                          sgst_amount: "",
                                          cgst_amount: "",
                                          amount: "",
                                        }
                                      : { ...v }
                                  )
                                );
                              }
                            }}
                          />
                        }
                      </td>
                      <td>
                        {
                          <Input
                            placeholder={"QUANTITY"}
                            value={val?.quantity}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              if (
                                (inputValue?.length < 5 &&
                                  /^\d+$/.test(inputValue)) ||
                                inputValue == 0 ||
                                !val?.quantity
                              ) {
                                setAddData((pre) =>
                                  pre.map((v, i) =>
                                    i == ind
                                      ? {
                                          ...v,
                                          quantity: /^\d+$/.test(inputValue)
                                            ? inputValue
                                            : "",
                                          tax_amount: "",
                                          igst_amount: "",
                                          sgst_amount: "",
                                          cgst_amount: "",
                                          amount: "",
                                        }
                                      : { ...v }
                                  )
                                );
                              }
                            }}
                          />
                        }
                      </td>
                      <td>
                        {
                          <Input
                            placeholder={"TAXABLE AMOUNT"}
                            value={val.tax_amount}
                            disabled={true}
                          />
                        }
                      </td>
                      <td>
                        {
                          <Input
                            placeholder={"IGST AMOUNT"}
                            value={val.igst_amount}
                            disabled={true}
                          />
                        }
                      </td>
                      <td>
                        {
                          <Input
                            placeholder={"CGST AMOUNT"}
                            value={val.cgst_amount}
                            disabled={true}
                          />
                        }
                      </td>
                      <td>
                        {
                          <Input
                            placeholder={"SGST AMOUNT"}
                            value={val.sgst_amount}
                            disabled={true}
                          />
                        }
                      </td>
                      <td>
                        {
                          <Input
                            placeholder={"TOTAL AMOUNT"}
                            value={val.amount}
                            disabled={true}
                          />
                        }
                      </td>
                      <td>
                        {
                          <DeleteIcon
                            onClick={() => {
                              setAddData((pre) =>
                                pre.filter((v, i) => i != ind)
                              );
                              setAddDataHead({
                                ...addDataHead,
                                inv_amount: "",
                              });
                            }}
                          />
                        }
                      </td>
                    </tr>
                  ))}
                />
              </div>
              <div
                className="flex aic gap10"
                style={{ marginTop: 10, justifyContent: "flex-end" }}
              >
                {/* Add button for adding new item in the addData array */}
                <Button
                  title={"ADD"}
                  onClick={() => {
                    validation_check() &&
                      setMess(
                        "Please enter all the values in current row,calculate and then add next row"
                      );
                    validation_check()
                      ? setOpen1(true)
                      : setAddData((pre) => [...pre, {}]);
                  }}
                />
                {/* Fetch gst for items gst */}
                <Button title={"FETCH GST"} back onClick={() => fetchGST()} />

                  {/* Calculate function */}
                  
                <Button
                  title={"CALCULATE"}
                  back
                  disable={
                    !addData[addData.length - 1]?.product_code ||
                    !addData[addData.length - 1]?.p_gst
                      ? true
                      : false
                  }
                  onClick={() =>
                    !addData[addData.length - 1].product_code ||
                    !addData[addData.length - 1].p_gst
                      ? ""
                      : calculate()
                  }
                />
                {/* Save Button for adding a new item  */}
                <SaveButton onClick={() => add_items()} />
              </div>
            </div>
          }
        ></Modal>
      )}

      {/* View Modal for multiple rows item */}

      {openView && (
        <Modal
          onCancel={() => {
            setViewItem({});
          }}
          bg={"white"}
          isOpen={openView}
          title={viewItem?.CVO_NAME || viewItem?.CUSTOMER_NAME}
          setIsOpen={setOpenView}
          header_right={
            <ReactToPrint
              trigger={() => (
                <Button style={{ cursor: "pointer" }} title={"PRINT"} />
              )}
              content={() => previewRef.current}
              documentTitle={`${
                viewItem?.CVO_NAME || viewItem?.CUSTOMER_NAME
              }-${viewItem?.SR_NO}`}
            />
          }
          body={
            <>
              <Table
                mt={10}
                headData={[
                  "PRODUCT",
                  "GST%",
                  "UNIT PRICE	",
                  "DISCOUNT ON UNIT PRICE",
                  "QUANTITY",
                  "TAXABLE AMOUNT	",
                  "IGST AMOUNT",
                  "SGST AMOUNT",
                  "CGST AMOUNT",
                  "TOTAL AMOUNT",
                ]}
                body={
                  <>
                    {viewItem?.products?.map((v, i) => (
                      <tr key={i}>
                        <td>
                          {/* {v?.CAT_NAME +
                            (v?.CAT_DESC ? ` - ${v?.CAT_DESC}` : "")} */}
                          {v?.CAT_NAME == "SERVICE" ||
                          v?.CAT_NAME == "REGULATOR" ||
                          v?.CAT_NAME == "DOMESTIC" ||
                          v?.CAT_NAME == "COMMERCIAL"
                            ? `${v?.CAT_NAME} - ${v?.CAT_DESC}`
                            : `${v?.CAT_DESC} - ${v?.CAT_NAME} - ${v?.PROD_NAME} `}
                        </td>
                        <td>{v?.VATP}</td>
                        <td>{Number(v?.UNIT_RATE).toFixed(2)}</td>
                        <td>{Number(v?.DISC_UNIT_RATE).toFixed(2)}</td>
                        <td>{v?.QUANTITY}</td>
                        <td>{Number(v?.BASIC_AMOUNT).toFixed(2)}</td>
                        <td>{Number(v?.IGST_AMOUNT).toFixed(2)}</td>
                        <td>{Number(v?.SGST_AMOUNT).toFixed(2)}</td>
                        <td>{Number(v?.CGST_AMOUNT).toFixed(2)}</td>
                        <td>{v?.PROD_AMOUNT}</td>
                      </tr>
                    ))}
                    <tr>
                      <td />
                      <td />
                      <td />
                      <td style={{ fontWeight: "bold", fontSize: "15px" }}>
                        TOTAL
                      </td>
                      <td />
                      <td style={{ fontWeight: "bold", fontSize: "15px" }}>
                        {viewItem?.products
                          .map((v) => v?.BASIC_AMOUNT)
                          .reduce((a, b) => Number(a) + Number(b), 0)
                          ?.toFixed(2)}
                      </td>
                      <td style={{ fontWeight: "bold", fontSize: "15px" }}>
                        {viewItem?.products
                          .map((v) => v.IGST_AMOUNT)
                          .reduce((a, b) => Number(a) + Number(b), 0)
                          ?.toFixed(2)}
                      </td>
                      <td style={{ fontWeight: "bold", fontSize: "15px" }}>
                        {viewItem?.products
                          .map((v) => v.SGST_AMOUNT)
                          .reduce((a, b) => Number(a) + Number(b), 0)
                          ?.toFixed(2)}
                      </td>
                      <td style={{ fontWeight: "bold", fontSize: "15px" }}>
                        {viewItem?.products
                          .map((v) => v.CGST_AMOUNT)
                          .reduce((a, b) => Number(a) + Number(b), 0)
                          ?.toFixed(2)}
                      </td>
                      <td style={{ fontWeight: "bold", fontSize: "15px" }}>
                        {Number(viewItem?.QTN_AMOUNT)?.toFixed(2)}
                      </td>
                    </tr>
                  </>
                }
              />
            </>
          }
        ></Modal>
      )}

      {/* Custom Print Functionality handled ferom the frontend*/}

      <div style={{ display: "none" }}>
        <TaxInvoice3
          previewRef={previewRef}
          bank={false}
          doc_name={"Quotation"}
          empty_row_height={180 - viewItem?.products?.length * 40}
          listdata={{
            SR_NO: viewItem?.SR_NO,
            SR_NO_DATE: viewItem?.quotation_date,
            CVO_NAME: viewItem?.CVO_NAME || viewItem?.CUSTOMER_NAME,
            CVO_ADDRESS: viewItem?.CVO_ADDRESS || viewItem?.ADDRESS,
            CVO_DISTRICT: viewItem?.B_DISTRICT,
            CVO_LOCATION: viewItem?.B_LOCATION,
            B_STATE_CODE: viewItem?.STATE_CODE,
            B_STATE_NAME: viewItem?.B_STATE,
            CVO_PINCODE: viewItem?.B_PINCODE,
            CVO_TIN:
              viewItem?.CVO_TIN ||
              (viewItem?.CUST_GSTIN == "0" ? "" : viewItem?.CUST_GSTIN) ||
              "NA",
            EMAIL: viewItem?.CVO_EMAIL,
            MOBILE: viewItem?.CVO_CONTACT,
            SHIP_CVO_NAME: viewItem?.CVO_NAME || viewItem?.CUSTOMER_NAME,
            SHIP_CVO_ADDRESS: viewItem?.S_ADDRESS || viewItem?.ADDRESS,
            SHIP_CVO_DISTRICT: viewItem?.S_DISTRICT,
            SHIP_CVO_LOCATION: viewItem?.S_LOCATION,
            SHIP_B_STATE: viewItem?.S_STATE,
            SHIP_B_STATE_NAME: viewItem?.S_STATE_NAME,
            SHIP_CVO_PINCODE: viewItem?.S_PINCODE,
            SHIP_CVO_TIN:
              viewItem?.CVO_TIN ||
              (viewItem?.CUST_GSTIN == "0" ? "" : viewItem?.CUST_GSTIN) ||
              "NA",
          }}
          table_body={
            <>
              {viewItem?.products?.map((v, i) => (
                <tr key={i}>
                  <td className="both">{i + 1}</td>
                  <td
                    className="both"
                    style={{
                      textAlign: "left",
                      fontWeight: "bold",
                      minWidth: "300px",
                    }}
                  >
                    {v?.CAT_NAME == "SERVICE" ||
                    v?.CAT_NAME == "REGULATOR" ||
                    v?.CAT_NAME == "DOMESTIC" ||
                    v?.CAT_NAME == "COMMERCIAL"
                      ? `${v?.CAT_NAME} - ${v?.CAT_DESC}`
                      : `${v?.CAT_DESC} - ${v?.CAT_NAME} - ${v?.PROD_NAME} `}
                  </td>
                  <td className="both">{v?.CSTEH_NO}</td>
                  <td className="both">
                    {v?.QUANTITY} {UnitFunction(v?.UNITS, "title")}
                  </td>
                  <td className="both">{v?.UNIT_RATE}</td>
                  <td className="both">{v?.DISC_UNIT_RATE}</td>
                  <td className="both">{v?.VATP}</td>

                  <td className="both" style={{ textAlign: "right" }}>
                    {v?.BASIC_AMOUNT}
                  </td>
                </tr>
              ))}
            </>
          }
          // Total_tax={viewItem?.hsn_groups
          //   ?.map((v) => v?.TOTAL_AMOUNT)
          //   ?.reduce((a, b) => Number(a) + Number(b), 0)
          //   ?.toFixed(2)}
          // tax_total={viewItem?.products
          //   ?.map((v) => v?.BASIC_AMOUNT)
          //   .reduce((a, b) => Number(a) + Number(b), 0)
          //   ?.toFixed(2)}
          // igst_amount={viewItem?.products
          //   ?.map((v) => v?.IGST_AMOUNT)
          //   .reduce((a, b) => Number(a) + Number(b), 0)
          //   ?.toFixed(2)}
          // cgst_amount={viewItem?.products
          //   ?.map((v) => v?.CGST_AMOUNT)
          //   .reduce((a, b) => Number(a) + Number(b), 0)
          //   ?.toFixed(2)}
          // sgst_amount={viewItem?.products
          //   ?.map((v) => v?.SGST_AMOUNT)
          //   .reduce((a, b) => Number(a) + Number(b), 0)
          //   ?.toFixed(2)}
          // net_total={viewItem?.QTN_AMOUNT}
          Total_tax={ReduceFunction(viewItem?.hsn_groups, "TOTAL_AMOUNT")}
          net_total={Number(viewItem?.QTN_AMOUNT).toFixed(2)}
          taxable_amt={Number(
            ReduceFunction(viewItem?.products, "BASIC_AMOUNT")
          ).toFixed(2)}
          igst={ReduceFunction(viewItem?.products, "IGST_AMOUNT")}
          cgst={ReduceFunction(viewItem?.products, "CGST_AMOUNT")}
          sgst={ReduceFunction(viewItem?.products, "SGST_AMOUNT")}
          other={"0.00"}
        />
      </div>

      {/* other list for helping user for add product  */}

      {cvoClick && <CVOList cvoClick={cvoClick} setCvoClick={setCvoClick} />}

      {EquipClick && (
        <EquipmentList EquipClick={EquipClick} setEquipClick={setEquipClick} />
      )}

      {StaffClick && (
        <StaffList StaffClick={StaffClick} setStaffClick={setStaffClick} />
      )}

      {PriceClick && (
        <PriceList PriceClick={PriceClick} setPriceClick={setPriceClick} />
      )}

      {/* Small modal for delete */}

      {open && (
        <SmallModal
          title={"Confirm"}
          isOpen={open}
          setIsOpen={setOpen}
          mess={"Are you sure? You want to delete"}
          onClick={() => onDelete_item()}
        />
      )}

      {/* Small modal for Alerts (regarding messing fields or backend comes error ) */}

      {open1 && (
        <SmallModal
          title={"Alerts"}
          isOpen={open1}
          setIsOpen={setOpen1}
          mess={mess}
          okbtn={true}
        />
      )}
      {/* loader */}
      {showLoader && <Loader />}
    </div>
  );
};
