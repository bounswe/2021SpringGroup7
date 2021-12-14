
import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
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
  profilePaper: {
    width: "98%",
    minHeight: 1090,
    padding: "4%",
    margin: "1%",
    borderRadius: 0,
  },
  personalInfo: {
    height: '60vh', 
    boxShadow: 3,
  },
  buttonText: {
    textTransform: 'none',
  }
}));