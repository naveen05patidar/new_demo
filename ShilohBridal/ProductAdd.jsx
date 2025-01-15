import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Heading,
  Spacer,
  DropDown,
  FileInput2,
  FileInput,
  DeleteIcon,
  BackButton,
} from "../../../utils/layoutUtils";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Description from "./Description";
import { FaPlus } from "react-icons/fa";
import Table from "../../../components/Table";
import store from "../../../redux/store";
import { get_category_list } from "../../../redux/dataSlice";
import { useSelector } from "react-redux";

const sizeOptions = [
  { value: "US 0 / UK 2 / EU 30", label: "US 0 / UK 2 / EU 30" },
  { value: "US 2 / UK 6 / EU 32", label: "US 2 / UK 6 / EU 32" },
  { value: "US 4 / UK 8 / EU 34", label: "US 4 / UK 8 / EU 34" },
  { value: "US 6 / UK 10 / EU 36", label: "US 6 / UK 10 / EU 36" },
  { value: "US 8 / UK 12 / EU 38", label: "US 8 / UK 12 / EU 38" },
  { value: "US 10 / UK 14 / EU 40", label: "US 10 / UK 14 / EU 40" },
  { value: "US 12 / UK 16 / EU 42", label: "US 12 / UK 16 / EU 42" },
  { value: "US 14 / UK 18 / EU 44", label: "US 14 / UK 18 / EU 44" },
  { value: "US 16 / UK 20 / EU 46", label: "US 16 / UK 20 / EU 46" },
  { value: "US 16W / UK 20 / EU 46", label: "US 16W / UK 20 / EU 46" },
  { value: "US 18 / UK 22 / EU 48", label: "US 18 / UK 22 / EU 48" },
  { value: "US 20 / UK 24 / EU 50", label: "US 20 / UK 24 / EU 50" },
];

const ProductDetail = () => {
  const [data, setData] = useState({});
  const [addDataCust, setAddDataCust] = useState([{}]);
  const [addDataColor, setAddDataColor] = useState([{}]);
  const [addDataFabric, setAddDataFabric] = useState([{}]);
  const [addDataSpecs, setAddDataSpecs] = useState([{}]);

  const [imagePreview, setImagePreview] = useState({
    file: null,
    file1: null,
    file2: null,
  });

  // Fetch Category List from Redux

  const { category_list } = useSelector((state) => state.dataSlice);

  const [loading, setLoading] = useState(false);

  // Fetch State from Previus Page
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    store.dispatch(get_category_list());
  }, []);

  // this useEffect call at the time when state coming because im using 3 types in this component ADD Data, Edit Data and View Data
  useEffect(() => {
    if (state?.state) {
      setData({
        ...state.state,
        id: state.state.id || "",
      });
      setAddDataCust(state?.state?.customizations);
      setAddDataColor(state?.state?.colors);
      setAddDataFabric(state?.state?.fabric);
      setAddDataSpecs(state?.state?.specifications);
    }
  }, [state]);

  // File Change multiple Files at a time

  const handleImageChange = async (e, fieldName) => {
    const files = e.target.files;

    if (files) {
      const fileArray = Array.from(files);
      await new Promise((resolve) => {
        setData((prev) => ({
          ...prev,
          [fieldName]: fileArray,
          [`${fieldName}Mess`]: "",
        }));
        resolve();
      });
      if (fileArray.length > 0) {
        if (fileArray?.length > 1) {
          const arr = []; // To store the image previews
          fileArray.forEach((file, index) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              arr.push(reader.result);
              // When all files are read, update the state
              if (arr.length === fileArray.length) {
                setImagePreview((prev) => ({
                  ...prev,
                  [fieldName]: arr, // Store array of image previews for the field
                }));
              }
            };
            reader.readAsDataURL(file);
          });
        } else {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview((prev) => ({
              ...prev,
              [fieldName]: reader.result,
            }));
          };
          reader.readAsDataURL(fileArray[0]);
        }
      }
    }
  };

  // This function work for changing the input as per there given arguments

  const handleChange = ({ type, value, field_name, max }) => {
    if (type === "num") {
      if (value?.length < max) {
        setData({
          ...data,
          [field_name]: /^\d+$/.test(value) ? Number(value) : "",
          [`${field_name}Mess`]: "",
        });
      }
    } else if (type === "flot") {
      if (
        (value?.length <= max + 4 &&
          new RegExp(`^(0|[1-9]\\d{0,${max}})(\\.\\d{0,2})?$`).test(value)) ||
        value === 0 ||
        value == "" ||
        !data?.[field_name]
      ) {
        setData({
          ...data,
          [field_name]: new RegExp(
            `^(0|[1-9]\\d{0,${max}})(\\.\\d{0,2})?$`
          ).test(value)
            ? value
            : "",
          [`${field_name}Mess`]: "",
        });
      }
    } else if (type === "str") {
      if (value?.length < max) {
        const val = value
          ?.trimStart()
          .replace(/[^a-zA-Z0-9 !@#$%^&*()_+\-=[\]{};':",.<>?/|\\]/g, "");
        setData({
          ...data,
          [field_name]: val,
          [`${field_name}Mess`]: "",
        });
      }
    }
  };

  // Submit Functionality

  const on_submit = async () => {
    const valid = validate();

    // Field validation Start
    const validations = {
      availability: !data?.availability,
      itemcategory: !data?.itemcategory,
      subcategorey: !data?.subcategorey,
      itemcode: !data?.itemcode,
      name: !data?.name,
      nameitem1: !data?.nameitem1,
      nameitem2: !data?.nameitem2,
      price: !data?.price,
      priority: !data?.priority,
      discount: !data?.discount,
      weight: !data?.weight,
      length: !data?.length,
      breadth: !data?.breadth,
      height: !data?.height,
      net_weight: !data?.net_weight,
      qavailable: !data?.qavailable,
      brand: !data?.brand,
      size: !data?.size,
      default_color: !data?.default_color,
      default_color_code: !data?.default_color_code,
      description: !data?.description,
      file: !data?.file,
      file1: !data?.file1,
      video: !data?.video,
    };

    if (
      Object.values(validations).some(Boolean) ||
      (Object.values(valid).every((value) => !value) &&
        Object.keys(valid).length > 0)
    ) {
      setData((prevData) => ({
        ...prevData,
        availabilityMess: validations.availability
          ? "Availability is required"
          : "",
        itemcategoryMess: validations.itemcategory
          ? "Item Category is required"
          : "",
        subcategoreyMess: validations.subcategorey
          ? "Subcategory is required"
          : "",
        itemcodeMess: validations.itemcode ? "Item Code is required" : "",
        nameMess: validations.name ? "Name is required" : "",
        name1Mess: validations.nameitem1 ? "Name1 is required" : "", // Validation message for name1
        name2Mess: validations.nameitem2 ? "Name2 is required" : "", // Validation message for name2
        priceMess: validations.price ? "Price is required" : "",
        priorityMess: validations.priority ? "Priority is required" : "", // Added validation message for priority
        discountMess: validations.discount ? "Discount is required" : "", // Added validation message for discount
        weightMess: validations.weight ? "Weight is required" : "",
        lengthMess: validations.length ? "Length is required" : "",
        breadthMess: validations.breadth ? "Breadth is required" : "",
        heightMess: validations.height ? "Height is required" : "",
        net_weightMess: validations.net_weight ? "Net Weight is required" : "",
        qavailableMess: validations.qavailable
          ? "Quantity Available is required"
          : "",
        brandMess: validations.brand ? "Brand is required" : "", // Added validation message for brand
        sizeMess: validations.size ? "Size is required" : "", // Added validation message for size
        default_colorMess: validations.default_color ? "Color is required" : "", // Added validation message for brand
        default_color_codeMess: validations.default_color_code
          ? "Color Code is required"
          : "", // Added validation message for size
        descriptionMess: validations.description
          ? "Description is required"
          : "",
        fileMess: validations.file ? "Image is required" : "",
        file1Mess: validations.file1 ? "Other Images is required" : "",
        videoMess: validations.video ? "Video is required" : "", // Added validation message for file2
        ...valid,
      }));
      return;
    }
    // Field validation End

    // API Call
    try {
      const body = new FormData();
      body.append("action", state?.type === "add" ? "create" : "update");
      if (state?.type == "edit") {
        body.append("id", data?.id);
      }
      body.append("code", "SHBRD");
      body.append("availability", data?.availability); //  Done
      body.append("pcategory", data?.itemcategory); // Done
      body.append("category1", data?.subcategorey); // Done
      body.append("pcode", data?.itemcode); // Done
      body.append("pname", data?.name); // Done
      body.append("pname1", data?.nameitem1); // Done
      body.append("pname2", data?.nameitem2); // Done
      body.append("price", data?.price); // Done
      body.append("priority", data?.priority); // Done
      body.append("discount", data?.discount); // Done
      body.append("weight", data?.weight); // Done
      body.append("length", data?.length); // Done
      body.append("breadth", data?.breadth); // Done
      body.append("height", data?.height); // Done
      body.append("net_weight", data?.net_weight); // Done
      body.append("qty_available", data?.qavailable); // Done
      body.append("brand", data?.brand); // Done
      body.append("size", data?.size); // Done
      body.append("default_color", data?.default_color); // Done
      body.append("default_color_code", data?.default_color_code); // Done

      addDataCust.forEach((v, i) => {
        if (state?.type == "edit") {
          body.append(`customization_id[${i}]`, v?.id || "");
        }
        body.append(`customization_category[]`, v?.customization_category); // Done
        body.append(`customization_name[]`, v?.customization_name); // Done
        body.append(`customization_price[]`, v?.customization_price); // Done
        // if (v?.file ) {
        body.append(`customization_image[]`, v?.file || ""); // Done
        // }
      });

      addDataColor.forEach((v, i) => {
        if (state?.type == "edit") {
          body.append("color_id[]", v?.id);
        }
        body.append("color_name[]", v?.color_name); // Done
        body.append("color_code[]", v?.color_code); // Done
        body.append("color_price[]", v?.price); // Done
      });
      addDataFabric.forEach((v, i) => {
        if (state?.type == "edit") {
          body.append("fabric_id[]", v?.id);
        }
        body.append("fabric_name[]", v?.fabric_name); // Done
        body.append("fabric_option_name[]", v?.fabric_option_name); // Done
      });
      addDataSpecs.forEach((v, i) => {
        if (state?.type == "edit") {
          body.append("specification_id[]", v?.id);
        }
        body.append("specification_name[]", v?.specification_name); // Done
        body.append(
          "specification_option_name[]",
          v?.specification_option_name
        ); // Done
      });

      if (data?.file?.length > 0) {
        data?.file?.forEach((v, i) => {
          body.append("main_image", v);
        });
      }

      if (data?.video?.length > 0 && typeof data?.video == "object") {
        data?.video?.forEach((v, i) => {
          body.append("video", v); // Done
        });
      }
      if (data?.file1?.length > 0) {
        data?.file1?.forEach((v, i) => {
          body.append("image[]", v); // Done
        });
      }

      body.append("description", data?.description); // Done

      const response = await fetch(process.env.REACT_APP_API_KEY + "demo.php", {
        method: "POST",
        body: body,
      });
      const res = await response.json();
      if (res.success) {
        toast.success(res.message);
        navigate(-1);
      } else {
        toast.error(res.message || "Failed to process request.");
      }
    } catch (error) {
      console.error("API request failed:", error);
      toast.error("An error occurred while processing the request.");
    } finally {
      setLoading(false);
    }
  };

  // Other field Validation

  const validate = (type = "all") => {
    const obj = {};
    if (type == "all" || type == "cust") {
      for (let v of addDataCust) {
        if (
          !v?.customization_category ||
          !v?.customization_name ||
          !v?.customization_price ||
          (!v?.file?.name &&
            state.type == "add" &&
            v?.customization_category == 8)
        ) {
          obj.addDataCustErr = "Please Fill all the Customization field";
        }
      }
    }
    if (type == "all" || type == "color") {
      for (let v of addDataColor) {
        if (!v?.color_name || !v?.color_code || !v?.price) {
          obj.addDataColorErr = "Please Fill all the  Color field";
        }
      }
    }
    if (type == "all" || type == "fabric") {
      for (let v of addDataFabric) {
        if (!v?.fabric_name || !v?.fabric_option_name) {
          obj.addDataFabricErr = "Please Fill all the Fabric field";
        }
      }
    }
    if (type == "all" || type == "specs") {
      for (let v of addDataSpecs) {
        if (!v?.specification_name || !v?.specification_option_name) {
          obj.addDataSpecsErr = "Please Fill all the  Specification field";
        }
      }
    }

    return obj;
  };

  return (
    <>
      <div className="container mx-auto p-4">
        {/* Component Heading  */}
        <div className="flex items-center justify-between">
          <Heading title={"Product Detail"} />
          <BackButton />
        </div>
        <Spacer height={20} />
        <div className="flex flex-col">
          {/* Form Start  */}

          <>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
              <DropDown
                disabled={state?.type === "view"}
                label={"Availability"}
                value={data?.availability}
                error={data?.availabilityMess}
                onChange={(v) =>
                  setData({
                    ...data,
                    availability: v.target.value,
                    availabilityMess: "",
                  })
                }
                options={
                  <>
                    <option value="">Select Availability</option>
                    <option value="available">Available</option>
                    <option value="Not Available">Not Available</option>
                  </>
                }
              />

              <DropDown
                disabled={state?.type === "view"}
                label={"Item Category"}
                options={
                  <>
                    <option value="">Select Category</option>
                    {category_list?.map((v, i) => (
                      <option key={i} value={v?.id}>
                        {v?.category}
                      </option>
                    ))}
                  </>
                }
                value={data?.itemcategory}
                onChange={(v) =>
                  setData({
                    ...data,
                    itemcategory: v.target.value,
                    subcategorey: "",
                    itemcategoryMess: "",
                  })
                }
                error={data?.itemcategoryMess}
              />
              <DropDown
                disabled={state?.type === "view"}
                label={"Subcategory"}
                // placeholder={"Subcategory"}
                options={
                  <>
                    <option value="">Select Sub Category</option>
                    {category_list
                      ?.filter((v, i) => v?.id == data?.itemcategory)?.[0]
                      ?.sub_category?.map((v, i) => (
                        <option key={i} value={v?.id}>
                          {v?.sub_category}
                        </option>
                      ))}
                  </>
                }
                value={data?.subcategorey}
                onChange={(e) =>
                  handleChange({
                    type: "num",
                    value: e.target.value,
                    field_name: "subcategorey",
                    max: 11,
                  })
                }
                error={data?.subcategoreyMess}
              />
              <Input
                disabled={state?.type === "view"}
                label={"Product Code"}
                placeholder={"Product Code"}
                value={data?.itemcode}
                onChange={(e) =>
                  handleChange({
                    type: "num",
                    value: e.target.value,
                    field_name: "itemcode",
                    max: 25,
                  })
                }
                error={data?.itemcodeMess}
              />
              <Input
                disabled={state?.type === "view"}
                label={"Product Name"}
                placeholder={"Product Name"}
                value={data?.name}
                // onChange={(v) =>
                //   setData({ ...data, name: v.target.value, nameMess: "" })
                // }
                onChange={(e) =>
                  handleChange({
                    type: "str",
                    value: e.target.value,
                    field_name: "name",
                    max: 200,
                  })
                }
                error={data?.nameMess}
              />

              <Input
                disabled={state?.type === "view"}
                label={"Product Name 1"}
                placeholder={"Product Name 1"}
                value={data?.nameitem1}
                onChange={(e) =>
                  handleChange({
                    type: "str",
                    value: e.target.value,
                    field_name: "nameitem1",
                    max: 200,
                  })
                }
                error={data?.name1Mess}
              />
              <Input
                disabled={state?.type === "view"}
                label={"Product Name 2"}
                placeholder={"Product Name 2"}
                value={data?.nameitem2}
                onChange={(e) =>
                  handleChange({
                    type: "str",
                    value: e.target.value,
                    field_name: "nameitem2",
                    max: 200,
                  })
                }
                error={data?.name2Mess}
              />
              <Input
                disabled={state?.type === "view"}
                label={"Price"}
                placeholder={"Price"}
                type="text"
                value={data?.price}
                onChange={(e) =>
                  handleChange({
                    type: "flot",
                    value: e.target.value,
                    field_name: "price",
                    max: 7,
                  })
                }
                error={data?.priceMess}
              />

              <DropDown
                disabled={state?.type === "view"}
                label={"Priority"}
                value={data?.priority}
                error={data?.priorityMess}
                onChange={(v) =>
                  setData({
                    ...data,
                    priority: v.target.value,
                    priorityMess: "",
                  })
                }
                options={
                  <>
                    <option value="">Select Priority</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    {/* <option value="available">Available</option>
                    <option value="Not Available">Not Available</option> */}
                  </>
                }
              />

              <Input
                disabled={state?.type === "view"}
                label={"Discount"}
                placeholder={"Discount"}
                type="text"
                value={data?.discount}
                onChange={(e) =>
                  handleChange({
                    type: "flot",
                    value: e.target.value,
                    field_name: "discount",
                    max: 7,
                  })
                }
                error={data?.discountMess}
              />

              <Input
                disabled={state?.type === "view"}
                label={"Weight"}
                placeholder={"Weight"}
                type="text"
                value={data?.weight}
                onChange={(e) =>
                  handleChange({
                    type: "flot",
                    value: e.target.value,
                    field_name: "weight",
                    max: 4,
                  })
                }
                error={data?.weightMess}
              />
              <Input
                disabled={state?.type === "view"}
                label={"Length"}
                placeholder={"Length"}
                type="text"
                value={data?.length}
                onChange={(e) =>
                  handleChange({
                    type: "flot",
                    value: e.target.value,
                    field_name: "length",
                    max: 4,
                  })
                }
                error={data?.lengthMess}
              />
              <Input
                disabled={state?.type === "view"}
                label={"Breadth"}
                placeholder={"Breadth"}
                type="text"
                value={data?.breadth}
                onChange={(e) =>
                  handleChange({
                    type: "flot",
                    value: e.target.value,
                    field_name: "breadth",
                    max: 4,
                  })
                }
                error={data?.breadthMess}
              />
              <Input
                disabled={state?.type === "view"}
                label={"Height"}
                placeholder={"Height"}
                type="text"
                value={data?.height}
                onChange={(e) =>
                  handleChange({
                    type: "flot",
                    value: e.target.value,
                    field_name: "height",
                    max: 4,
                  })
                }
                error={data?.heightMess}
              />
              <Input
                disabled={state?.type === "view"}
                label={"Net weight"}
                placeholder={"Net weight"}
                type="text"
                value={data?.net_weight}
                onChange={(e) =>
                  handleChange({
                    type: "flot",
                    value: e.target.value,
                    field_name: "net_weight",
                    max: 5,
                  })
                }
                error={data?.net_weightMess}
              />
              <Input
                disabled={state?.type === "view"}
                label={"Quantity Available"}
                placeholder={"Quantity Available"}
                type="text"
                value={data?.qavailable}
                onChange={(e) =>
                  handleChange({
                    type: "num",
                    value: e.target.value,
                    field_name: "qavailable",
                    max: 4,
                  })
                }
                error={data?.qavailableMess}
              />
              <Input
                disabled={state?.type === "view"}
                label={"Brand"}
                placeholder={"Brand"}
                type="text"
                value={data?.brand}
                onChange={(e) =>
                  handleChange({
                    type: "str",
                    value: e.target.value,
                    field_name: "brand",
                    max: 50,
                  })
                }
                error={data?.brandMess}
              />
              <DropDown
                disabled={state?.type === "view"}
                label={"Size"}
                value={data?.size}
                error={data?.sizeMess}
                onChange={(v) =>
                  setData({
                    ...data,
                    size: v.target.value,
                    sizeMess: "",
                  })
                }
                options={
                  <>
                    <option value="">Select Size</option>
                    {sizeOptions.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </>
                }
              />

              <Input
                disabled={state?.type === "view"}
                label={"Color"}
                placeholder={"Color"}
                type="text"
                value={data?.default_color}
                onChange={(e) =>
                  handleChange({
                    type: "str",
                    value: e.target.value,
                    field_name: "default_color",
                    max: 50,
                  })
                }
                error={data?.default_colorMess}
              />
              <Input
                disabled={state?.type === "view"}
                label={"Color Code"}
                placeholder={"Color Code"}
                type="text"
                value={data?.default_color_code}
                onChange={(e) =>
                  handleChange({
                    type: "str",
                    value: e.target.value,
                    field_name: "default_color_code",
                    max: 50,
                  })
                }
                error={data?.default_color_codeMess}
              />
            </div>

            {/* Customization Start */}

            <div className="mt-6 flex flex-col gap-2 ">
              <div className="flex justify-between ">
                <h1 className="text-2xl">Customization</h1>
                {state?.type != "view" && (
                  <Button
                    title={"Add"}
                    icon={<FaPlus size={16} />}
                    onClick={() => {
                      const valid = validate("cust");
                      if (valid?.addDataCustErr) {
                        setData({ ...data, ...valid });
                      } else {
                        setAddDataCust([...addDataCust, {}]);
                      }
                    }}
                  />
                )}
              </div>
              <Table
                pagination={false}
                noData={addDataCust?.length == 0} // This will display a message if there’s no data
                headData={["Category", "Name", "Price", "Image", "action"]}
              >
                {addDataCust?.map((val, ind) => (
                  <tr key={ind}>
                    <td className="">
                      <DropDown
                        showError={false}
                        error={
                          data?.addDataCustErr && !val?.customization_category
                        }
                        disabled={state?.type === "view"}
                        value={val?.customization_category}
                        onChange={(e) => {
                          const updatedData = [...addDataCust];
                          updatedData[ind].customization_category =
                            e.target.value;
                          setAddDataCust(updatedData);
                        }}
                        options={
                          <>
                            <option value="">Select</option>
                            <option value="1">Sleeve</option>
                            <option value="2">Neckline</option>
                            <option value="3">Patticoat</option>
                            <option value="4">Back Style</option>
                            <option value="5">Skirt Type</option>
                            <option value="6">Skirt Length</option>
                            <option value="7">Size</option>
                            <option value="8">Train</option>
                            <option value="9">Silhouette</option>
                          </>
                        }
                      />
                    </td>
                    <td className="">
                      <Input
                        showError={false}
                        error={data?.addDataCustErr && !val?.customization_name}
                        disabled={state?.type === "view"}
                        placeholder={"Name"}
                        value={val?.customization_name}
                        onChange={(e) => {
                          const updatedData = [...addDataCust];
                          updatedData[ind].customization_name = e.target.value;
                          setAddDataCust(updatedData);
                        }}
                      />
                    </td>
                    <td className="">
                      <Input
                        showError={false}
                        error={
                          data?.addDataCustErr && !val?.customization_price
                        }
                        disabled={state?.type === "view"}
                        placeholder={"Price"}
                        value={val?.customization_price}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (
                            (value?.length <= 11 &&
                              new RegExp(
                                `^(0|[1-9]\\d{0,7})(\\.\\d{0,2})?$`
                              ).test(value)) ||
                            value === 0 ||
                            value == "" ||
                            !val?.customization_price
                          ) {
                            const updatedData = [...addDataCust];
                            updatedData[ind].customization_price = new RegExp(
                              `^(0|[1-9]\\d{0,7})(\\.\\d{0,2})?$`
                            ).test(value)
                              ? value
                              : "";
                            setAddDataCust(updatedData);
                          }
                          // Update the price field of the specific item in the addDataCust array
                        }}
                      />
                    </td>
                    <td className="">
                      {state?.type === "view" ? (
                        <img
                          src={val?.image}
                          alt="Preview"
                          className="w-48 h-48 object-contain rounded-lg"
                        />
                      ) : (
                        <FileInput
                          showError={false}
                          error={
                            data?.addDataCustErr &&
                            !val?.file?.name &&
                            val?.customization_category == 8
                          }
                          disabled={state?.type === "view"}
                          placeholder={"File"}
                          value={val?.file?.name || val?.image}
                          fileName={val?.file?.name || val?.image}
                          onChange={(e) => {
                            const updatedData = [...addDataCust];
                            updatedData[ind].file = e.target.files[0]; // Assuming FileInput uses the file input type
                            setAddDataCust(updatedData);
                          }}
                        />
                      )}
                    </td>
                    <td className="mt-2 px-2 flex justify-center items-center ">
                      {state?.type == "view" ? (
                        "-"
                      ) : (
                        <DeleteIcon
                          onClick={() => {
                            setAddDataCust(
                              addDataCust?.filter((v, i) => i !== ind)
                            );
                          }}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </Table>
              {/* {data?.addDataCustErr && (
                <p className="text-red-500 text-sm mt-1 text-center">
                  {data?.addDataCustErr}
                </p>
              )} */}
            </div>

            {/* Color  */}

            <div className="mt-6 flex flex-col gap-2 ">
              <div className="flex justify-between ">
                <h1 className="text-2xl">Color</h1>
                {state?.type != "view" && (
                  <Button
                    onClick={() => {
                      const valid = validate("color");
                      if (valid?.addDataColorErr) {
                        setData({ ...data, ...valid });
                      } else {
                        setAddDataColor([...addDataColor, {}]);
                      }
                    }}
                    title={"Add"}
                    icon={<FaPlus size={16} />}
                  />
                )}
              </div>
              <Table
                noData={addDataColor?.length == 0} // This will display a message if there’s no data
                headData={["Color Name", "Color Code", "Price", "action"]}
              >
                {addDataColor?.map((val, ind) => (
                  <tr key={ind}>
                    <td className="">
                      <Input
                        showError={false}
                        error={data?.addDataColorErr && !val?.color_name}
                        disabled={state?.type === "view"}
                        placeholder={"Color Name"}
                        value={val?.color_name}
                        onChange={(e) => {
                          // Update the color_name field of the specific item in the addDataColor array
                          const updatedData = [...addDataColor];
                          updatedData[ind].color_name = e.target.value;
                          setAddDataColor(updatedData);
                        }}
                      />
                    </td>
                    <td className="">
                      <Input
                        showError={false}
                        error={data?.addDataColorErr && !val?.color_code}
                        disabled={state?.type === "view"}
                        placeholder={"Color Code"}
                        value={val?.color_code}
                        onChange={(e) => {
                          // Update the color_code field of the specific item in the addDataColor array
                          const updatedData = [...addDataColor];
                          updatedData[ind].color_code = e.target.value;
                          setAddDataColor(updatedData);
                        }}
                      />
                    </td>
                    <td className="">
                      <Input
                        showError={false}
                        error={data?.addDataColorErr && !val?.price}
                        disabled={state?.type === "view"}
                        placeholder={"Price"}
                        value={val?.price}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (
                            (value?.length <= 11 &&
                              new RegExp(
                                `^(0|[1-9]\\d{0,7})(\\.\\d{0,2})?$`
                              ).test(value)) ||
                            value === 0 ||
                            value == "" ||
                            !val?.price
                          ) {
                            const updatedData = [...addDataColor];
                            updatedData[ind].price = new RegExp(
                              `^(0|[1-9]\\d{0,7})(\\.\\d{0,2})?$`
                            ).test(value)
                              ? value
                              : "";
                            setAddDataColor(updatedData);
                          }
                        }}
                      />
                    </td>
                    <td className="mt-2 px-2 flex justify-center items-center">
                      {state?.type == "view" ? (
                        "-"
                      ) : (
                        <DeleteIcon
                          onClick={() => {
                            // Remove the current item from the array by filtering out the item at index `ind`
                            setAddDataColor(
                              addDataColor?.filter((v, i) => i !== ind)
                            );
                          }}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </Table>
              {/* {data?.addDataColorErr && (
                <p className="text-red-500 text-sm mt-1 text-center">
                  {data?.addDataColorErr}
                </p>
              )} */}
            </div>

            {/* Fabric  */}

            <div className="mt-6 flex flex-col gap-2 ">
              <div className="flex justify-between ">
                <h1 className="text-2xl">Fabric</h1>
                {state?.type != "view" && (
                  <Button
                    onClick={() => {
                      const valid = validate("fabric");
                      if (valid?.addDataFabricErr) {
                        setData({ ...data, ...valid });
                      } else {
                        setAddDataFabric([...addDataFabric, {}]);
                      }
                    }}
                    title={"Add"}
                    icon={<FaPlus size={16} />}
                  />
                )}
              </div>
              <Table
                noData={addDataFabric?.length == 0} // This will display a message if there’s no data
                headData={["Fabric Name", "Fabric Option Name", "action"]}
              >
                {addDataFabric?.map((val, ind) => (
                  <tr key={ind}>
                    <td className="">
                      <Input
                        showError={false}
                        error={data?.addDataFabricErr && !val?.fabric_name}
                        disabled={state?.type === "view"}
                        placeholder={"Fabric Name"}
                        value={val?.fabric_name}
                        onChange={(e) => {
                          // Update the fabric_name field of the specific item in the addDataFabric array
                          const updatedData = [...addDataFabric];
                          updatedData[ind].fabric_name = e.target.value;
                          setAddDataFabric(updatedData);
                        }}
                      />
                    </td>
                    <td className="">
                      <Input
                        showError={false}
                        error={
                          data?.addDataFabricErr && !val?.fabric_option_name
                        }
                        disabled={state?.type === "view"}
                        placeholder={"Fabric Option Name"}
                        value={val?.fabric_option_name}
                        onChange={(e) => {
                          // Update the fabric_option_name field of the specific item in the addDataFabric array
                          const updatedData = [...addDataFabric];
                          updatedData[ind].fabric_option_name = e.target.value;
                          setAddDataFabric(updatedData);
                        }}
                      />
                    </td>
                    <td className="mt-2 px-2 flex justify-center items-center">
                      {state?.type == "view" ? (
                        "-"
                      ) : (
                        <DeleteIcon
                          onClick={() => {
                            // Remove the current item from the array by filtering out the item at index `ind`
                            setAddDataFabric(
                              addDataFabric?.filter((v, i) => i !== ind)
                            );
                          }}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </Table>
              {/* {data?.addDataFabricErr && (
                <p className="text-red-500 text-sm mt-1 text-center">
                  {data?.addDataFabricErr}
                </p>
              )} */}
            </div>

            {/* Specification  */}

            <div className="mt-6 flex flex-col gap-2 ">
              <div className="flex justify-between ">
                <h1 className="text-2xl">Specification</h1>
                {state?.type != "view" && (
                  <Button
                    onClick={() => {
                      const valid = validate("specs");
                      if (valid?.addDataSpecsErr) {
                        setData({ ...data, ...valid });
                      } else {
                        setAddDataSpecs([...addDataSpecs, {}]);
                      }
                    }}
                    title={"Add"}
                    icon={<FaPlus size={16} />}
                  />
                )}
              </div>
              <Table
                noData={addDataSpecs?.length == 0} // This will display a message if there’s no data
                headData={[
                  "Specification Name",
                  "Specification Option Name",
                  "action",
                ]}
              >
                {addDataSpecs?.map((val, ind) => (
                  <tr key={ind}>
                    <td className="">
                      <Input
                        showError={false}
                        error={
                          data?.addDataSpecsErr && !val?.fabric_option_name
                        }
                        disabled={state?.type === "view"}
                        placeholder={"Specification Name"}
                        value={val?.specification_name}
                        onChange={(e) => {
                          // Update the specification_name field of the specific item in the addDataSpecs array
                          const updatedData = [...addDataSpecs];
                          updatedData[ind].specification_name = e.target.value;
                          setAddDataSpecs(updatedData);
                        }}
                      />
                    </td>
                    <td className="">
                      <Input
                        showError={false}
                        error={
                          data?.addDataSpecsErr &&
                          !val?.specification_option_name
                        }
                        disabled={state?.type === "view"}
                        placeholder={"Specification Option Name"}
                        value={val?.specification_option_name}
                        onChange={(e) => {
                          // Update the specification_option_name field of the specific item in the addDataSpecs array
                          const updatedData = [...addDataSpecs];
                          updatedData[ind].specification_option_name =
                            e.target.value;
                          setAddDataSpecs(updatedData);
                        }}
                      />
                    </td>
                    <td className="mt-2 px-2 flex justify-center items-center">
                      {state?.type == "view" ? (
                        "-"
                      ) : (
                        <DeleteIcon
                          onClick={() => {
                            // Remove the current item from the array by filtering out the item at index `ind`
                            setAddDataSpecs(
                              addDataSpecs?.filter((v, i) => i !== ind)
                            );
                          }}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </Table>
              {/* {data?.addDataSpecsErr && (
                <p className="text-red-500 text-sm mt-1 text-center">
                  {data?.addDataSpecsErr}
                </p>
              )} */}

              {/* <div className="flex"></div> */}
            </div>

            <div className="mt-7 col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 font-bold">
              {/* Display Image */}

              <FileInput2
                disabled={state?.type == "view"}
                doctype={"image/png, image/jpg, image/jpeg "}
                onChange={handleImageChange}
                fieldName="file"
                onClick={(e) => {
                  e.preventDefault();
                  setData((prev) => ({ ...prev, file: null, image: null }));
                  setImagePreview((prev) => ({
                    ...prev,
                    file: null,
                  }));
                }}
                label={"Display Image"}
                preview={imagePreview.file || data?.image}
                error={data?.fileMess}
              />

              {/* Other Images */}

              <FileInput2
                disabled={state?.type == "view"}
                doctype={"image/png, image/jpg, image/jpeg "}
                onChange={handleImageChange}
                fieldName="file1"
                onClick={(e) => {
                  e.preventDefault();
                  setData((prev) => ({ ...prev, file1: null, images: null }));
                  setImagePreview((prev) => ({
                    ...prev,
                    file1: null,
                  }));
                }}
                label={"Other Images"}
                preview={imagePreview.file1 || data?.images}
                error={data?.file1Mess}
                multiple={true}
              />

              {/* Video */}

              <FileInput2
                disabled={state?.type == "view"}
                doctype={
                  "video/mp4, video/avi, video/mov, video/mkv, video/webm"
                }
                onChange={handleImageChange}
                fieldName="video"
                onClick={(e) => {
                  e.preventDefault();
                  setData((prev) => ({ ...prev, video: null }));
                  setImagePreview((prev) => ({
                    ...prev,
                    video: null,
                  }));
                }}
                label={"Video"}
                preview={imagePreview.video || data?.video}
                error={data?.videoMess}
              />
            </div>
          </>
        </div>

        <div className="flex flex-col mb-4">
          <label className="mb-2 mt-4">Description</label>
          {state?.type == "view" ? (
            <p dangerouslySetInnerHTML={{ __html: data?.description }}></p>
          ) : (
            <Description
              disabled={state?.type == "view"}
              value={data?.description}
              onChange={(content) =>
                setData((prev) => ({
                  ...prev,
                  description: content,
                  descriptionMess: "",
                }))
              }
              error={data?.descriptionMess}
            />
          )}
        </div>

        <Spacer height={20} />

        {/* Sumit Button */}

        {state?.type != "view" && (
          <Button
            title={state?.type === "add" ? "Add Product" : "Update Product"}
            onClick={on_submit}
            className={`bg-blue-500 text-white hover:bg-blue-600 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          />
        )}
      </div>
    </>
  );
};

export default ProductDetail;
