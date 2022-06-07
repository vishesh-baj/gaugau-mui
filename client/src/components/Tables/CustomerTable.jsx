import React from "react";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Stack } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { selectedEntry } from "../../features/selectedEntrySlice";
const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // APIS______________________________________
  const getcustomers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3030/api/admin/customerList"
      );
      console.log(response.data.Message);
      setCustomers(response.data.Message);
      setFilteredCustomers(response.data.Message);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCustomer = async (row) => {
    try {
      const response = await axios
        .put(`http://localhost:3030/api/admin/deleteCustomer/${row.id}`)
        .then((res) => getcustomers());

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  // APIS______________________________________END

  const handleEditClick = (row) => {
    navigate(PATHS.customerDetails);
    console.log("EDIT ROW: ", row);
  };

  const handleDeleteClick = (row) => {
    console.log("DELTE ROW: ", row);
    dispatch(selectedEntry(row));
    deleteCustomer(row);
  };

  useEffect(() => {
    getcustomers();
  }, []);

  useEffect(() => {
    const result = customers.filter((customer) => {
      return (
        //   other search filters to be added
        customer.first_name.toLowerCase().match(search.toLowerCase()) ||
        customer.last_name.toLowerCase().match(search.toLowerCase()) ||
        customer.mobile_number.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilteredCustomers(result);
  }, [search]);

  const columns = [
    { name: "S.No", selector: (row) => row.id, sortable: true },
    {
      name: "Name",
      selector: (row) => row.first_name + " " + row.last_name,
      sortable: true,
    },

    {
      name: "Mobile",
      selector: (row) => row.mobile_number,
      sortable: true,
    },
    {
      name: "No. Of Cattles",
      selector: (row) => row.number_of_cattle_to_buy,
      sortable: true,
    },
    {
      name: "Client",
      selector: (row) =>
        row.campaign_customersref[0] ? (
          row.campaign_customersref[0].clientref.client_name
        ) : (
          <span>empty</span>
        ),
      sortable: true,
    },
    {
      name: "Campaign Title",
      selector: (row) =>
        row.campaign_customersref[0] ? (
          row.campaign_customersref[0].campaignsref.campaign_name
        ) : (
          <span>empty</span>
        ),
      sortable: true,
    },
    {
      name: "State",
      selector: (row) => row.stateref.name,
      sortable: true,
    },
    {
      name: "District",
      selector: (row) => row.districtref.district,
      sortable: true,
    },
    {
      name: "Tehsil",
      selector: (row) => row.tehsilref.tahshil,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <Stack direction={"row"} spacing={2}>
          <CreateIcon
            style={{ cursor: "pointer" }}
            color="primary"
            onClick={() => handleEditClick(row)}
          />
          <DeleteIcon
            style={{ cursor: "pointer" }}
            color="error"
            onClick={() => handleDeleteClick(row)}
          />
        </Stack>
      ),
    },
  ];

  return (
    <div>
      <DataTable
        title="customers List"
        columns={columns}
        data={filteredCustomers}
        fixedHeader
        fixedHeaderScrollHeight="450px"
        pagination
        highlightOnHover
        responsive
        subHeader
        subHeaderComponent={
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        }
      />
    </div>
  );
};

export default CustomerTable;
