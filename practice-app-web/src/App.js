import { Route, Switch } from "react-router";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import OtherProfiles from "./pages/OtherProfiles";

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} exact />
      <Route path="/profile" exact component={Profile} />
      <Route path="/profile/:username" exact component={OtherProfiles} />
    </Switch>
  );
}

export default App;
