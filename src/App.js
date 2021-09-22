import logo from "./logo.svg";
import "./App.css";
import React, { useState } from 'react';
import Table from './Table.js';
import Charts from './Charts.js';
import { AppBar, Toolbar, IconButton, Typography, Button, Grid } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Footer from "./Footer.js"
import image from "./static/images/niftyprice.png"
import Purchase from './Purchase.js'
import About from './About.js'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

function App() {

  return (
    <>
      <Router>
        <div className="App">
          <AppBar position="static" color="inherit">
            <Toolbar>
              <Grid
                justify="flex-start" // Add it here :)
                container
                spacing={5}
              >
                <Grid item>
                  <a id="niftyprice" href="/"></a>
                </Grid>
              </Grid>

              <Grid
                container
                justify="flex-end"
                spacing={5}>

                <Grid item alignItems="center">
                  <Button variant="contained" color="primary" href="/purchase">
                    Get NFT Data
                  </Button>
                </Grid>
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
            </Switch>
          </div>

        </div>
      </Router>
      <Footer />

    </>

  );
}

export default App;
