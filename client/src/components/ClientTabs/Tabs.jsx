import React, { useState } from "react";
import PropTypes from "prop-types";
import ClientsTable from "../../components/Tables/ClientsTable";
import {
  Stack,
  Typography,
  TextField,
  Box,
  Tab,
  Tabs,
  Button,
} from "@mui/material";
import axios from "axios";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const [clientData, setClientData] = useState({
    client_name: "",
    descriptions: "",
    mobile_number: "",
  });

  //   post client data api call
  const postClient = async () => {
    const response = await axios.post(
      "http://localhost:3030/api/admin/addClient",
      clientData
    );
    console.log(response);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (e) => {
    setClientData({ ...clientData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(clientData);
    clientData &&
      postClient().then((res) =>
        setClientData({ client_name: "", descriptions: "", mobile_number: "" })
      );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="New Client" {...a11yProps(0)} />
          <Tab label="Client View" {...a11yProps(1)} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} width={"30vw"}>
            <Typography variant="h6" fontWeight={700}>
              Add Client
            </Typography>

            <TextField
              name="client_name"
              id="outlined-basic"
              label="Name"
              size="small"
              variant="outlined"
              onChange={handleInputChange}
              value={clientData.client_name}
            />
            <TextField
              name="descriptions"
              id="outlined-basic"
              label="Description"
              size="small"
              variant="outlined"
              onChange={handleInputChange}
              value={clientData.descriptions}
            />
            <TextField
              name="mobile_number"
              id="outlined-basic"
              label="Mobile"
              size="small"
              variant="outlined"
              onChange={handleInputChange}
              value={clientData.mobile_number}
            />

            <Stack marginTop={10} direction="row" spacing={5}>
              <Button
                onClick={() =>
                  setClientData({
                    client_name: "",
                    descriptions: "",
                    mobile_number: "",
                  })
                }
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Add
              </Button>
            </Stack>
          </Stack>
        </form>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ClientsTable />
      </TabPanel>
    </Box>
  );
}
