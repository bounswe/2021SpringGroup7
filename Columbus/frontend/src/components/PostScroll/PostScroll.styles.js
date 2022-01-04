import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  body: {
    display: "flex",
    flexDirection: "column",
    minHeight: 680,
    backgroundColor: "#dddcd0",
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

