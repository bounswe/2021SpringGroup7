import React, { useEffect, useState } from "react";
import Wrapper from "../../components/Wrapper";
import {
  Paper,
  Avatar,
  Container,
  Box,
  CircularProgress,
  Typography,
  DialogTitle,
  Dialog,
  makeStyles,
} from "@material-ui/core";
import { useNavigate  } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  name: {
    flex: 4,
  },
  toolbarSecondary: {
    justifyContent: "flex-end",
    overflowX: "auto",
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
  emptyBody: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 680,
    backgroundColor: "white",
  },
  emptyPost: {
    marginTop: 16,
  },
}));

function Profile(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);

  const renderEmptyPost = () => {
    return (
      <Box className={classes.emptyPost}>
        <Typography>You do not shared story yet!</Typography>
      </Box>
    );
  };

  if (loading) {
    return (
      <Wrapper>
        <Box className={classes.emptyBody}>
          <CircularProgress />
        </Box>
      </Wrapper>
    );
  }
  return (
    <div>
      <Wrapper>
        <Paper
          elevation={3}
          style={{
            width: "100%",
            minHeight: 1090,
            padding: "4%",
            borderRadius: 10,
            marginBottom: 40,
          }}
        >
        </Paper>
      </Wrapper>
    </div>
  );
}

export default Profile;
