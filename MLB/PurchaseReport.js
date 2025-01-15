import React, { useEffect, useState } from "react";
import { BackButton } from "../../components/btn/Buttons";
import PageHeading from "../../components/PageHeading";
import { Input } from "../../components/inputs/Inputs";
import Dropdown from "../../components/inputs/Dropdown";
import Button from "../../components/btn/Button";
import { useSelector } from "react-redux";
import Table from "../../components/table/Table";
import store from "../../redux/store";
import { get_purchase_report_list } from "./transactionReportSlice";
import { DateValidatorReports } from "../../utils/validation";
import moment from "moment";
import SmallModal from "../../components/modal/SmallModal";
import Loader from "../../components/Loader";
import { purchase_report_api } from "../../utils/apis";
import { Pagination3 } from "../../components/pagination/pagination";
import NoData from "../../components/NoData";
import { downloadExcel, exportPDF } from "../../utils/utils";
import { Alerts } from "../../components/Alerts/Alerts";
import SearchApiHook from "../../CustomHooks/SearchApiHook";

const PurchaseReport = () => {
  const [addData, setAddData] = useState({});
  const [addDataPre, setAddDataPre] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [mess, setMess] = useState("");
  const [totalCount, setTotalCount] = useState("50");
  const [entries, setEntries] = useState("5");
  const [pageNo, setPageNo] = useState(1);
  const [serchInput, setSerchInput] = useState("");
  const [prevSearch, setPrevSearch] = useState("");
  const [SearchCount, setSearchCount] = useState(0);
  const [showData, setShowData] = useState(false);
  const [purchase_report_item_list, setPurchase_report_item_list] = useState(
    []
  );
  const [totalData, setTotalData] = useState({});

  // fetched from the redux

  const { purchase_report_list } = useSelector(
    (state) => state.transactionReport
  );
  const { firm_name } = useSelector((state) => state.profile);

  const { eff_date, user_id, today } = useSelector((state) => state.other);

  // Fetched function

  useEffect(() => {
    store.dispatch(get_purchase_report_list());
  }, []);

  const fetchData = () => {
    if (showData) {
      get_list(addDataPre);
    }
  };

  // Search functinality with debouncing

  SearchApiHook(fetchData, serchInput?.trim(), prevSearch, [entries, pageNo]);

  // table data for PDF and Excel File download

  const table_data = (addData, total) => {
    const data = [
      ...addData?.map((v, i) => [
        i + 1,
        v?.INV_REF_NO,
        v?.INV_DATE,
        v?.GODOWN_NAME || "-",
        `${v?.CAT_NAME} - ${v?.CAT_DESC}`,
        v?.HSN_CODE,
        v?.GSTP,
        v?.CVO_NAME,
        v?.CVO_TIN || "NA",
        v?.QUANTITY,
        "NOS",
        v?.UNIT_PRICE,
        v?.TAXABLE_VALUE,
        v?.IGST_AMOUNT,
        v?.CGST_AMOUNT,
        v?.SGST_AMOUNT,
        v?.OTHER_CHARGES || "0.00",
        v?.INV_AMOUNT,
        v?.CREATED_NAME,
      ]),
      [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "TOTAL",
        "",
        total?.quantity,
        "",
        "",
        total?.taxable,
        total?.igst,
        total?.cgst,
        total?.sgst,
        "",
        total?.inv_amount,
      ],
    ];

    return data;
  };

  // table Header for PDF and Excel File download

  const table_header = [
    "INV NO",
    "INVOICE DATE",
    "GODOWN NAME",
    "PRODUCT	",
    "HSN CODE",
    "GST RATE",
    "VENDOR	",
    "VENDOR GSTIN",
    "QTY	",
    "UNITS	",
    "UNIT PRICE",
    "TAXABLE VALUE",
    "IGST AMOUNT",
    "CGST AMOUNT",
    "SGST AMOUNT",
    "OTHER CHARGES",
    "INVOICE AMOUNT",
    "CREATED BY",
  ];

  // PDF Download Function

  const export_pdf = (addData, data, total) => {
    exportPDF({
      table_data: table_data(data, total),
      table_headers: ["S.No.", ...table_header],
      fileName: `${firm_name} - PURCHASES REPORTS -- FROM DATE : ${moment(
        addData?.from_date
      ).format("DD/MM/YY")} & TO DATE : ${moment(addData?.to_date).format(
        "DD/MM/YY"
      )}   :: PRODUCT / VENDOR SELECTED : : ${addData?.custProdDetails}`,
      tableName: `${firm_name} - PURCHASES REPORTS -- FROM DATE : ${moment(
        addData?.from_date
      ).format("DD/MM/YY")} & TO DATE : ${moment(addData?.to_date).format(
        "DD/MM/YY"
      )}   :: PRODUCT / VENDOR SELECTED : : ${addData?.custProdDetails}`,
    });
  };

  // Excel Download Function

  const export_excel = (addData, data, total) => {
    downloadExcel(
      table_data(data, total),
      ["S.No.", ...table_header],
      `${firm_name} - PURCHASES REPORTS -- FROM DATE : ${moment(
        addData?.from_date
      ).format("DD/MM/YY")} & TO DATE : ${moment(addData?.to_date).format(
        "DD/MM/YY"
      )}   :: PRODUCT / VENDOR SELECTED : : ${addData?.custProdDetails}`
    );
  };

  // for Fetched list from the backend

  const get_list = async (addData, data1 = "") => {
    const data = validate(addData);
    if (data?.length == 0) {
      try {
        setShowLoader(true);
        const body = new FormData();
        body.append("action", "product_vendor");
        body.append("agencyid", user_id);
        body.append("sdate", addData?.from_date);
        body.append("edate", addData?.to_date);
        body.append("page", data1?.length > 1 || data1 == "main" ? 1 : pageNo);
        body.append(
          "limit",
          data1?.length > 1 ? (data1 == "main" ? entries : totalCount) : entries
        );
        body.append("search", data1 == "main" ? "" : serchInput);

        body.append("vendorid", addData?.vender_code || "");
        body.append(
          "vendor_cat",
          addData?.vendor_cat === ""
            ? ""
            : addData?.vendor_cat == "0"
            ? 0
            : addData?.vendor_cat || ""
        );
        body.append("productid", addData?.product_code || "");
        body.append("prod_cat", addData?.product_cat || "");
        const response = await purchase_report_api(body);
        setShowLoader(false);
        if (response.success) {
          if (data1 == "excel") {
            export_excel(
              addData,
              response?.data || response?.productlist,
              response?.total
            );
          } else if (data1 == "pdf") {
            export_pdf(
              addData,
              response?.data || response?.productlist,
              response?.total
            );
          } else {
            setPurchase_report_item_list(
              response?.data || response?.productlist
            );
            setTotalCount(response?.totalcount);
            setSearchCount(response?.searchcount);
            setShowData(true);
            setAddDataPre(addData);
            setTotalData(response?.total);
          }
        } else if (!response.success) {
          setMess(response?.message);
          setOpen(true);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setMess(<Alerts data={data} />);
      setOpen(true);
    }
  };

  // validate the field

  const validate = (addData) => {
    const data = [];

    const DateValidatorReportsData = DateValidatorReports(
      moment(addData?.from_date).format("DD/MM/YYYY"),
      moment(addData?.to_date).format("DD/MM/YYYY")
    );
    if (
      !addData?.from_date ||
      (addData?.from_date && addData?.from_date?.length != 10)
    ) {
      data.push("Please Enter From Date");
    } else if (
      !addData?.to_date ||
      (addData?.to_date && addData?.to_date?.length != 10)
    ) {
      data.push("Please Enter TO DATE");
    } else if (DateValidatorReportsData != true) {
      data.push(...DateValidatorReportsData);
    }
    // if (
    //   (!addData?.product_code ||
    //     (addData?.product_code && addData?.product_code?.length == 0)) &&
    //   (!addData?.vender_code ||
    //     (addData?.vender_code && addData?.vender_code?.length == 0))
    // ) {
    //   data.push("Please Select Either PRODUCT / VENDOR");
    // } else if (
    //   addData?.product_code?.length > 0 &&
    //   addData?.vender_code?.length > 0
    // ) {
    //   data.push("Please Select Either PRODUCT / VENDOR");
    // }
    return data;
  };

  return (
    <div className="container ">
      <PageHeading title={"PURCHASE REPORT"} right={<BackButton />} />
      {/* fetched list based on this parameters */}
      <div className="transactionMain">
        <div style={{ width: "180px" }}>
          <Input
            label={"FROM DATE"}
            type={"date"}
            value={addData?.from_date}
            onChange={(e) => {
              if (e.target.value.length <= 10) {
                setAddData({ ...addData, from_date: e.target.value });
              }
            }}
          />
        </div>
        <div style={{ width: "180px" }}>
          <Input
            label={"TO DATE"}
            value={addData?.to_date}
            onChange={(e) => {
              if (e.target.value.length <= 10) {
                setAddData({ ...addData, to_date: e.target.value });
              }
            }}
            type={"date"}
          />
        </div>

        <div style={{ width: "220px" }}>
          <Dropdown
            label={"PRODUCT"}
            value={addData?.product_code}
            onChange={(e) => {
              const data = purchase_report_list?.productlist?.filter(
                (v) => v?.ID == e.target.value
              )?.[0];
              setAddData({
                ...addData,
                product_code: e.target.value,
                action: e.target.value != "" ? "product" : "vendor",
                product_cat: data ? data?.CAT_TYPE : "",
                custProdDetails: data
                  ? data?.CAT_NAME == "DOMESTIC" ||
                    data?.CAT_NAME == "COMMERCIAL" ||
                    data?.CAT_NAME == "REGULATOR"
                    ? `${data?.CAT_NAME} - ${data?.CAT_DESC}`
                    : `${data?.CAT_DESC} - ${data?.PROD_BRAND} - ${data?.PROD_NAME}`
                  : "",
              });
            }}
            options={
              <>
                <option value={""}>SELECT</option>
                {purchase_report_list?.productlist?.map((v, i) => (
                  <option value={v?.ID} key={i}>
                    {v?.CAT_NAME == "DOMESTIC" ||
                    v?.CAT_NAME == "COMMERCIAL" ||
                    v?.CAT_NAME == "REGULATOR"
                      ? `${v?.CAT_NAME} - ${v?.CAT_DESC}`
                      : `${v?.CAT_DESC} - ${v?.PROD_BRAND} - ${v?.PROD_NAME}`}
                  </option>
                ))}
              </>
            }
          />
        </div>
        <div style={{ width: "220px" }}>
          <Dropdown
            label={"VENDOR NAME"}
            value={addData?.vender_code}
            onChange={(e) => {
              const data = purchase_report_list?.vendorlist?.filter(
                (v) => v?.ID == e.target.value
              )?.[0];

              setAddData({
                ...addData,
                vender_code: e.target.value,
                action: e.target.value != "" ? "vendor" : "product",
                vendor_cat: data ? data?.CVO_CAT : "",
                custProdDetails: data ? data?.CVO_NAME : "",
              });
            }}
            options={
              <>
                <option value={""}>SELECT</option>
                {purchase_report_list?.vendorlist?.map((v, i) => (
                  <option value={v?.ID} key={i}>
                    {v?.CVO_NAME}
                  </option>
                ))}
              </>
            }
          />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <Button
            title={"SEARCH"}
            onClick={async () => {
              await setShowData(false);
              await setSerchInput("");
              await setPageNo(1);
              await setEntries(5);
              get_list(addData, "main");
            }}
          />
        </div>
      </div>

      {/* Showing List as per data  */}

      {showData && totalCount != 0 ? (
        <>
          <div className="SFromDate">
            <span style={{ fontSize: "11PX" }}>FROM DATE :</span>
            <p className="FDATE">
              {moment(addDataPre?.from_date).format("DD/MM/YY")}
            </p>
            <span style={{ fontSize: "11PX" }}>TO DATE :</span>
            <p className="FDATE">
              {moment(addDataPre?.to_date).format("DD/MM/YY")}
            </p>
            <span style={{ fontSize: "11PX" }}>
              {addData?.action == "vendor" ? "VENDOR" : "PRODUCT"} SELECTED:
            </span>
            <h6 className="PDS">{addDataPre?.custProdDetails}</h6>
          </div>

          <Pagination3
            count={0}
            download={true}
            reportData={true}
            PDFDown={() => get_list(addDataPre, "pdf")}
            excelDown={() => get_list(addDataPre, "excel")}
            top={true}
            totalCount={totalCount > SearchCount ? SearchCount : totalCount}
            SerchInput={serchInput}
            serchChange={(e) => {
              setSerchInput(e.target.value);
              setPrevSearch(serchInput);
              setPageNo(1);
            }}
            pageNo={pageNo}
            setPageNo={setPageNo}
            entries={entries}
            setEntries={setEntries}
          >
            {purchase_report_item_list?.length == 0 ? (
              <NoData mt={30} />
            ) : (
              <Table
                headData={table_header}
                body={
                  <>
                    {purchase_report_item_list?.map((v, i) => (
                      <tr key={i}>
                        <td>{v?.INV_REF_NO}</td>
                        <td>{v?.INV_DATE}</td>
                        <td>{v?.GODOWN_NAME || "-"}</td>
                        <td>
                          {v?.CAT_NAME} - {v?.CAT_DESC}
                        </td>
                        <td>{v?.HSN_CODE}</td>
                        <td>{v?.GSTP}</td>
                        <td>{v?.CVO_NAME}</td>
                        <td>{v?.CVO_TIN || "NA"}</td>
                        <td>{v?.QUANTITY}</td>
                        <td>{"NOS"}</td>
                        <td>{v?.UNIT_PRICE}</td>
                        <td>{v?.TAXABLE_VALUE}</td>
                        <td>{v?.IGST_AMOUNT}</td>
                        <td>{v?.CGST_AMOUNT}</td>
                        <td>{v?.SGST_AMOUNT}</td>
                        <td>{v?.OTHER_CHARGES || "0.00"}</td>
                        <td>{v?.INV_AMOUNT}</td>
                        <td>{v?.CREATED_NAME}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={6} />
                      <td style={{ fontWeight: "bold", fontSize: "15px" }}>
                        TOTAL
                      </td>

                      <td />
                      <td style={{ fontWeight: "bold", fontSize: "15px" }}>
                        {totalData?.quantity}
                      </td>
                      <td colSpan={2} />
                      <td style={{ fontWeight: "bold", fontSize: "15px" }}>
                        {totalData?.taxable}
                      </td>
                      <td style={{ fontWeight: "bold", fontSize: "15px" }}>
                        {totalData?.igst}
                      </td>
                      <td style={{ fontWeight: "bold", fontSize: "15px" }}>
                        {totalData?.cgst}
                      </td>
                      <td style={{ fontWeight: "bold", fontSize: "15px" }}>
                        {totalData?.sgst}
                      </td>
                      <td style={{ fontWeight: "bold", fontSize: "15px" }}></td>
                      <td style={{ fontWeight: "bold", fontSize: "15px" }}>
                        {totalData?.inv_amount}
                      </td>
                    </tr>
                  </>
                }
              />
            )}
          </Pagination3>
        </>
      ) : showData ? (
        <NoData title={"NO RECORDS FOUND"} color="red" mt={30} />
      ) : (
        ""
      )}

      {/* Small Modal for alerts  */}

      {open && (
        <SmallModal
          isOpen={open}
          setIsOpen={setOpen}
          title={"alerts"}
          mess={mess}
          okbtn={setOpen}
        />
      )}

      {/* Loader */}

      {showLoader && <Loader />}
    </div>
  );
};

export default PurchaseReport;
