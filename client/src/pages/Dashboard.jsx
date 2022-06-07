import { Grid, Paper, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#ade8ff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Dashboard = () => {
  return (
    <>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
        <Grid item xs={12} md={6} lg={4}>
          <Item sx={{ height: "30vh", borderRadius: 0 }}>
            <Stack
              justifyContent={"center"}
              alignItems="center"
              height="30vh"
              spacing={2}
            >
              <Typography fontWeight={800} variant="h3" component="h5">
                01
              </Typography>
              <Typography fontWeight={700} variant="h6" component="h5">
                No. Of. Clients
              </Typography>
            </Stack>
          </Item>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Item sx={{ height: "30vh", borderRadius: 0 }}>
            <Stack
              justifyContent={"center"}
              alignItems="center"
              height="30vh"
              spacing={2}
            >
              <Typography fontWeight={800} variant="h3" component="h5">
                01
              </Typography>
              <Typography fontWeight={700} variant="h6" component="h5">
                No. Of. Clients
              </Typography>
            </Stack>
          </Item>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Item sx={{ height: "30vh", borderRadius: 0 }}>
            <Stack
              justifyContent={"center"}
              alignItems="center"
              height="30vh"
              spacing={2}
            >
              <Typography fontWeight={800} variant="h3" component="h5">
                01
              </Typography>
              <Typography fontWeight={700} variant="h6" component="h5">
                No. Of. Clients
              </Typography>
            </Stack>
          </Item>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Item sx={{ height: "30vh", borderRadius: 0 }}>
            <Stack
              justifyContent={"center"}
              alignItems="center"
              height="30vh"
              spacing={2}
            >
              <Typography fontWeight={800} variant="h3" component="h5">
                01
              </Typography>
              <Typography fontWeight={700} variant="h6" component="h5">
                No. Of. Clients
              </Typography>
            </Stack>
          </Item>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Item sx={{ height: "30vh", borderRadius: 0 }}>
            <Stack
              justifyContent={"center"}
              alignItems="center"
              height="30vh"
              spacing={2}
            >
              <Typography fontWeight={800} variant="h3" component="h5">
                01
              </Typography>
              <Typography fontWeight={700} variant="h6" component="h5">
                No. Of. Clients
              </Typography>
            </Stack>
          </Item>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
