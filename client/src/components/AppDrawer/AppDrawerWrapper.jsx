import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
// DrawerHeader styled component
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));
const AppDrawerWrapper = ({ children }) => {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, height: "100vh" }}>
      <DrawerHeader />

      {/* ROUTING WILL BE IMPLEMENTED HERE */}
      {children}
    </Box>
  );
};

export default AppDrawerWrapper;
