import { Route, Switch } from "react-router";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} exact />
      <Route path="/profile" component={Profile} />
    </Switch>
  );
}

export default App;
