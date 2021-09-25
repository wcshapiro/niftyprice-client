import React, { useEffect, useState } from "react";
import "./Footer.css";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}
function Footer() {
  const forceUpdate = useForceUpdate();
  return (
    <div class="footer">
      <hr></hr>
      <Grid container justifyContent="space-evenly">
        <Grid item lg={4} sm={6} xs={12}>
          <Typography variant="h4" component="h4" align="center">
            About
          </Typography>
          <Typography variant="h7" component="h7" align="center">
            <a class="link" href="/about">
              About Us
            </a>
          </Typography>
          <Typography variant="h7" component="h7" align="center">
            <a class="link" href="/purchase">
              Pricing
            </a>
          </Typography>
          <div class="about-content"></div>
        </Grid>
        <Grid item lg={4} sm={6} xs={12}>
          <Typography variant="h4" component="h4" align="center">
            Contact
          </Typography>
          <Typography variant="h7" component="h7" align="center">
            <p>Email: willcshapiro@gmail.com</p>
            <p>© 2021 | niftyprice.io</p>
          </Typography>
          <div class="contact-content"></div>
        </Grid>
        <Grid item lg={4} sm={6} xs={12}>
          <Typography variant="h4" component="h4" align="center">
            Links
          </Typography>
          <Typography variant="h7" component="h7" align="center">
            <a href="https://twitter.com/niftyprice_io" id="twitter"></a>
          </Typography>
        </Grid>
        
      </Grid>
    </div>
  );
}
export default Footer;
