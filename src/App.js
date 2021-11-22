import "./App.css";
import React from "react";
import Table from "./Table.js";
import Charts from "./Charts.js";
import { AppBar, Toolbar, Button, Grid } from "@material-ui/core";
import Footer from "./Footer.js";
import Purchase from "./Purchase.js";
import About from "./About.js";
import Privacy from "./Privacy.js";
import Terms from "./Terms.js";
import Form from "./Form.js";
import Newsletter from "./Newsletter.js";
import Indexes from "./Indexes.js";
import { slide as Menu } from "react-burger-menu";
import Wallet from "./Wallet.js";
import Web3Provider, { useWeb3Context, Web3Consumer } from 'web3-react';
import { Connectors } from 'web3-react'
import { ethers } from "ethers";
import connectors from "./connectors";
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
              <Menu right>
                <Button
                  variant="contained"
                  color="primary"
                  href="/"
                  id="menu-button"
                >
                  Home
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  href="/purchase"
                  id="menu-button"
                >
                  GET PREMIUM ACCESS
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  href="https://blog.niftyprice.io/"
                  id="menu-button"
                >
                  Blog
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  href="/about"
                  id="menu-button"
                >
                  About Us
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  href="/newsletter"
                  id="menu-button"
                >
                  Newsletter
                </Button>
                {/* <Button
                  variant="contained"
                  color="primary"
                  href="/wallet"
                  id="menu-button"
                >
                  Wallet{" "}
                </Button> */}
              </Menu>
              <div class="nav-buttons">
                <Grid container justify="flex-end" spacing={3}>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      href="/purchase"
                    >
                      GET PREMIUM ACCESS
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      href="https://blog.niftyprice.io/"
                    >
                      Blog
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="primary" href="/about">
                      About Us
                    </Button>
                  </Grid>
                  {/* <Grid item>
                    <Button variant="contained" color="primary" href="/wallet">
                      Wallet
                    </Button>
                  </Grid> */}
                  <Grid item>
                    <Button variant="contained" color="primary" href="/newsletter">
                      Newsletter
                    </Button>
                  </Grid>
                </Grid>
              </div>
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
              <Route path="/collections/:collection">
                <Charts />
              </Route>
              <Route path="/indexes/:index">
                <Indexes />
              </Route>
              <Route exact path="/">
                <Table />
              </Route>
              <Route exact path="/privacy">
                <Privacy />
              </Route>
              <Route exact path="/terms">
                <Terms />
              </Route>
              <Route exact path="/newsletter">
                <Newsletter />
              </Route>
              <Route exact path="/wallet">
                <Web3Provider connectors={connectors} libraryName="ethers.js">
                  <Wallet />
                </Web3Provider>
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
