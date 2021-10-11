import "./App.css";
import React from "react";
import Table from "./Table.js";
import Charts from "./Charts.js";
import { AppBar, Toolbar, Button, Grid } from "@material-ui/core";
import Footer from "./Footer.js";
import Purchase from "./Purchase.js";
import About from "./About.js";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <div className="App">
          <AppBar position="static" color="inherit">
            <Toolbar>
              <Grid justify="flex-start" container>
                <Grid item>
                  <a id="niftyprice" href="/">
                    {" "}
                  </a>
                </Grid>
              </Grid>
              <Grid container justify="flex-end" spacing={5}>
                <Grid item>
                  <Button variant="contained" color="primary" href="/about">
                    About Us
                  </Button>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
          <div class="content-wrap">
            <Switch>
              <Route exact path="/purchase">
                <Purchase />
              </Route>
              <Route exact path="/about">
                <About />
              </Route>
              <Route path="/chart">
                <Charts />
              </Route>
              <Route path="/">
                <Table />
              </Route>
              <Route exact path="/privacy">
                <Privacy />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
      <Footer />
    </>
  );
}

export default App;
