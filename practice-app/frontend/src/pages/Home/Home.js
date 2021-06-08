import React from "react";
import { Box, makeStyles } from "@material-ui/core";

import Wrapper from "../../components/Wrapper/Wrapper";

const useStyles = makeStyles((theme) => ({
  body: {
    display: "flex",
    flexDirection: "column",
    minHeight: 680,
    backgroundColor: theme.palette.primary.main,
  },
}));

function Home() {
  const classes = useStyles();

  return (
    <Wrapper>
      <Box className={classes.body}>Columbus home</Box>
    </Wrapper>
  );
}

export default Home;
