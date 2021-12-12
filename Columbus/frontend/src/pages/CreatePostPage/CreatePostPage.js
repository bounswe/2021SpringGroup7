import { Container, makeStyles, Paper } from "@material-ui/core";

import CreateEditPostComponent from "../../components/CreateEditPostComponent";
import Wrapper from "../../components/Wrapper/Wrapper";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#FFFFF",
  },
  Box: {
    margin: "10 10 10 10",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#FFFFF",
  },
}));

export default function CreatePostPage({ setSnackBarMessage, setOpenSnackBar}) {
  return (
    <Wrapper>
      <Paper className={useStyles.root} elevation={4} square>
        <Container maxWidth='md'>
         <CreateEditPostComponent setSnackBarMessage={setSnackBarMessage} setOpenSnackBar={setOpenSnackBar} />
        </Container>
      </Paper>
    </Wrapper>
  );
}
