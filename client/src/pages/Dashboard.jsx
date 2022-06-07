import { Grid, Paper, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { startCase } from "lodash";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#ade8ff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const getDashboardData = async () => {
    const response = await axios.get(
      "http://localhost:3030/api/admin/dashboard"
    );
    setDashboardData(response.data);
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
        {dashboardData &&
          dashboardData.map((entry, i) => (
            <Grid key={i} item xs={12} md={6} lg={4}>
              <Item sx={{ height: "30vh", borderRadius: 0 }}>
                <Stack
                  justifyContent={"center"}
                  alignItems="center"
                  height="30vh"
                  spacing={2}
                >
                  <Typography fontWeight={800} variant="h3" component="h5">
                    {Object.entries(entry)[0][1]}
                  </Typography>
                  <Typography fontWeight={700} variant="h6" component="h5">
                    {startCase(Object.entries(entry)[0][0])}
                  </Typography>
                </Stack>
              </Item>
            </Grid>
          ))}
      </Grid>
    </>
  );
};

export default Dashboard;
