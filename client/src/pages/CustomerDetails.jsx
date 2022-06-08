import { Stack, Button } from "@mui/material";
import { TextField } from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../routes/paths";

const CustomerDetails = () => {
  const selectedRow = useSelector((state) => state.selectedEntry);
  //TODO: object to be set with empty values and keys corrosponding to the required data
  const [currentObj, setCurrentObj] = useState({});

  const navigate = useNavigate();
  const handleCancel = () => {
    navigate(PATHS.customers);
  };
  const handleChange = (e) => {
    console.log(e.target.value);
  };

  useEffect(() => {
    const objToBeEdited = async () => {
      const response = await axios.get(
        `http://localhost:3030/api/admin/editCustomer/${selectedRow.id}`
      );
      setCurrentObj(response.data.Message);
    };
    objToBeEdited();
  }, [selectedRow.id]);

  return (
    // needs to be converted to grid
    <Stack spacing={2}>
      {Object.entries(currentObj).map((entry) => (
        <TextField onChange={handleChange} label={entry[0]} value={entry[1]} />
      ))}
      <Stack spacing={2} direction="row">
        <Button onClick={handleCancel}>Cancel</Button>
        <Button>Save</Button>
      </Stack>
    </Stack>
  );
};

export default CustomerDetails;
