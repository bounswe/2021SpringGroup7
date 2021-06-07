import React, { useState } from "react";
import {
  Container,
  createMuiTheme,
  CssBaseline,
  Paper,
  ThemeProvider,
} from "@material-ui/core";

import useStyles from "./Wrapper.style";
import Header from "../Header";
import Footer from "../Footer";

const Wrapper = ({ children }) => {
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
      <Paper
        className={classes.root}
        style={{ backgroundColor: theme.palette.background.default }}
      >
        <Container maxWidth="lg">
          <Header
            title="Home Page"
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
