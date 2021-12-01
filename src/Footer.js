import React from 'react';
import './Footer.css';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Form from './Form.js';

function Footer() {
  return (
    <>
      <hr></hr>
      <div class="footer">
        <Grid container justifyContent="space-evenly">
          <Grid item xs={12}></Grid>
          <Grid item lg={4} sm={6} xs={12}>
            <Typography variant="h5" component="h5" align="left">
              Info
            </Typography>
            <Typography variant="h7" component="h7" align="left">
              <a class="link" href="/about">
                About Us
              </a>
            </Typography>
            <Typography variant="h7" component="h7" align="left">
              <a class="link" href="/purchase">
                Pricing
              </a>
            </Typography>
            <Typography variant="h7" component="h7" align="left">
              <a class="link" href="/privacy">
                Privacy Policy
              </a>
            </Typography>
            <Typography variant="h7" component="h7" align="left">
              <a class="link" href="/terms">
                Terms of use
              </a>
            </Typography>
            <div class="about-content"></div>
          </Grid>
          <Grid item lg={4} sm={6} xs={12}>
            <Typography variant="h5" component="h5" align="left">
              Contact
            </Typography>
            <Typography variant="h7" component="h7" align="left">
              <p>Join today to get news, charts, and more!</p>
              <Form />
              <p>Email: team@niftyprice.io</p>
              <p>© 2021 | niftyprice.io</p>
            </Typography>
            <div class="contact-content"></div>
          </Grid>
          <Grid item lg={4} sm={6} xs={12}>
            <Typography variant="h5" component="h5" align="left">
              Links
            </Typography>
            <Typography variant="h7" component="h7" align="left">
              <a
                href="https://twitter.com/niftyprice_io"
                id="twitter"
                target="_blank"
              >
                {' '}
              </a>
            </Typography>
            <Typography variant="h7" component="h7" align="left">
              <a
                href="https://discord.gg/6szJV3FTjK"
                id="discord"
                target="_blank"
              >
                {' '}
              </a>
            </Typography>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
export default Footer;
