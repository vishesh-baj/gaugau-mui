import React from "react";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Stack, TextField } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";

const ClientsTable = () => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const navigate = useNavigate();

  // * fetch clients data_______________________API
  const getclients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3030/api/admin/clientList"
      );
      console.log(response.data.Data);
      setClients(response.data.Data);
      setFilteredClients(response.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  // * delete clients data_______________________API
  const deleteClients = async (row) => {
    try {
      const response = await axios
        .put(`http://localhost:3030/api/admin/deleteClient/${row.id}`)
        .then((_res) => getclients());
      console.log("CLIENT_DELETED: ", response.data.Message);
    } catch (error) {
      console.log(error);
    }
  };

  // row edit handler
  const handleEditClick = (row) => {
    navigate(PATHS.clientDetails);
    console.log("EDIT ROW: ", row);
  };

  // row delete handle
  const handleDeleteClick = (row) => {
    console.log("DELTE ROW: ", row);
    deleteClients(row);
  };

  useEffect(() => {
    getclients();
  }, []);

  // search filter
  useEffect(() => {
    const result = clients.filter((client) => {
      return (
        // * SEARCH FILTERS
        client.client_name.toLowerCase().match(search.toLowerCase()) ||
        String(client.mobile_number).toLowerCase().match(search.toLowerCase())
      );
    });
    setFilteredClients(result);
  }, [search]);

  const columns = [
    { name: "S.No", selector: (row) => row.id, sortable: true },
    {
      name: "Name",
      selector: (row) => row.client_name,
      sortable: true,
    },

    {
      name: "Description",
      selector: (row) => row.descriptions,
      sortable: true,
    },
    {
      name: "Mobile Number",
      selector: (row) => row.mobile_number,
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
    <DataTable
      title="clients List"
      columns={columns}
      data={filteredClients}
      fixedHeader
      fixedHeaderScrollHeight="450px"
      pagination
      highlightOnHover
      responsive
      subHeader
      subHeaderComponent={
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="standard-basic"
          label="Search"
        />
      }
    />
  );
};
export default ClientsTable;
