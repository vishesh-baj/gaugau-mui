import CustomerTable from "../components/Tables/CustomerTable";
import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
const Table = () => {
  const [countries, setCountries] = useState([]);
  const getCountries = async () => {
    try {
      const response = axios.get("https://restcountries.com/v2/all");
      setCountries((await response).data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCountries();
  }, []);

  const handleEditClick = (row) => {
    console.log("EDIT ROW: ", row);
  };

  const handleDeleteClick = (row) => {
    console.log("DELTE ROW: ", row);
  };

  const columns = [
    { name: "Country Name", selector: (row) => row.name, sortable: true },
    {
      name: "Country Native Name",
      selector: (row) => row.nativeName,
      sortable: true,
    },
    { name: "Country Capital", selector: (row) => row.capital, sortable: true },
    {
      name: "Country Flag",
      selector: (row) => <img width={50} height={50} src={row.flag} />,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <Button
            onClick={() => handleEditClick(row)}
            variant="text"
            color="info"
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDeleteClick(row)}
            variant="text"
            color="warning"
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return <CustomerTable columns={columns} data={countries} />;
};

export default Table;
