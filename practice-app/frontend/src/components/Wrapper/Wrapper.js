import React, { useState } from "react";
import {
  Container,
  createMuiTheme,
  CssBaseline,
  Paper,
  ThemeProvider,
  makeStyles,
} from "@material-ui/core";

import Header from "../Header";
import Footer from "../Footer";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#e6e5dc",
  },
}));

const Wrapper = ({ pageTitle, children }) => {
  const classes = useStyles();
  const [darkMode, setDarkMode] = useState(false);

  const theme = createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
    },
  });

  const sections = [
    { title: "Ana Sayfa", url: "/" },
    { title: "Profile", url: "/profile" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Paper className={classes.root}>
        <Container maxWidth="lg">
          <Header
            title={pageTitle}
            sections={sections}
            theme={darkMode}
            onChange={(theme) => setDarkMode(!theme)}
          />
          <main>{children}</main>
        </Container>
        <Footer title="Columbus" description="Developed by Cmpe352 Students!" />
      </Paper>
    </ThemeProvider>
  );
};

export default Wrapper;
