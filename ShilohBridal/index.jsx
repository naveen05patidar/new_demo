import React, { useEffect, useState, useCallback } from "react";
import { Button, Heading, Loader, MyPopup } from "../../../utils/layoutUtils";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiEye, FiPlus, FiTrash } from "react-icons/fi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import store from "../../../redux/store";
import { get_product_list } from "../../../redux/dataSlice";
import { LTD } from "../../../components/LTD";
import moment from "moment";
import DebounceHook from "../../../Hooks/DebouncingHook";

const Product = () => {
  const [currentTab, setCurrentTab] = useState(1);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [open1, setOpen1] = useState(false);
  const [detail, setDetail] = useState({});
  const [row, setRow] = useState(10);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const { product_list, product_loading } = useSelector(
    (state) => state.dataSlice
  );

  const obj = {
    row: row,
    page: page,
    search: searchTerm,
    setTotalCount: setTotalCount,
  };

  // Using debouncing for Search

  const updateSearchResultsDebounced = useCallback(
    DebounceHook((query) => {
      store.dispatch(get_product_list({ ...obj, page: 1, search: query }));
    }, 500),
    []
  );

  // Search Change

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchTerm(query);
    setPage(1);
    updateSearchResultsDebounced(query);
  };

  // Product List Update when row and page changed

  useEffect(() => {
    store.dispatch(get_product_list(obj));
  }, [row, page]);

  // Delete a specific itom

  const delete_item = async () => {
    try {
      setLoading(true);
      const formdata = new FormData();
      formdata.append("action", "delete");
      formdata.append("id", detail.id);
      const response = await fetch(process.env.REACT_APP_API_KEY + "demo.php", {
        method: "POST",
        body: formdata,
      });
      const res = await response.json();
      setLoading(false);
      if (res.success) {
        store.dispatch(get_product_list());
        setOpen1(false);
        toast.success("Product deleted successfully!");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log("error====", error);
    }
  };

  // Row Change
  const handleRowChange = (event) => {
    setRow(Number(event.target.value));
    setPage(1);
  };

  return (
    <div className="w-full block">
      {/* Component Heading  */}

      <div className="flex justify-between items-center">
        <Heading title={"Products Details"} />
        <Button
          title={"Add"}
          icon={<FiPlus size={20} />}
          onClick={() => {
            navigate("/product/product-details ", {
              state: { type: "add", sub_cat_id: currentTab },
            });
          }}
        />
      </div>

      {/* Component List */}

      {product_loading ? (
        <Loader />
      ) : (
        <Table
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          loading={product_loading}
          row={row}
          onRowChange={handleRowChange}
          total_page={Math.ceil(totalCount / row)}
          page={page}
          setPage={setPage}
          total_value={totalCount}
          pagination={true}
          headData={[
            "S.No.",
            "Item Code",
            "Availability",
            "ItemCategory",
            "Subcategory",
            "Name",
            "Name 1",
            "Name 2",
            "Price",
            "Description",
            "Image",
            "Discount",
            "Quantity Available",
            "Date",
            "Actions",
          ]}
        >
          {product_list.map((item, index) => (
            <tr className="text-center" key={item.id}>
              <LTD>{(page - 1) * row + index + 1}</LTD>
              <LTD>{item.itemcode}</LTD>
              <LTD>{item.availability}</LTD>
              <LTD>{item.category}</LTD>
              <LTD>{item.sub_category}</LTD>
              <LTD>{item.name}</LTD>
              <LTD>{item.nameitem1}</LTD>
              <LTD>{item.nameitem2}</LTD>
              <LTD>{item.price}</LTD>
              <LTD mw={"400px"}>{item.description}</LTD>
              <td>
                {item.image && (
                  <img
                    src={item.image}
                    alt="Product"
                    className="w-60  object-contain  mx-auto"
                  />
                )}
              </td>
              <LTD>{item.discount}</LTD>
              <LTD>{item.qavailable}</LTD>
              <LTD mw={"150px"}>
                {moment(item.created).format("DD-MMM-YYYY hh:mm A")}
              </LTD>
              <LTD>
                <div className="flex gap-2">
                  <FiEye
                    size={20}
                    className="cursor-pointer"
                    onClick={() =>
                      navigate("/product/product-details ", {
                        state: {
                          state: item,
                          type: "view",
                          sub_cat_id: currentTab,
                        },
                      })
                    }
                  />
                  <FiEdit
                    size={20}
                    className="cursor-pointer"
                    color="#2b3478"
                    onClick={() =>
                      navigate("/product/product-details ", {
                        state: {
                          state: item,
                          type: "edit",
                          sub_cat_id: currentTab,
                        },
                      })
                    }
                  />
                  <FiTrash
                    size={20}
                    className="cursor-pointer"
                    color="#d1262b"
                    onClick={() => {
                      setDetail(item);
                      setOpen1(true);
                    }}
                  />
                </div>
              </LTD>
            </tr>
          ))}
        </Table>
      )}

      {/* Custom popup for Delete Modal */}
      <MyPopup
        isOpen={open1}
        setIsOpen={setOpen1}
        title={"Delete"}
        message={"Are you sure? You want to delete data"}
        bname={"Delete"}
        onClick={delete_item}
      />
    </div>
  );
};

export default Product;
