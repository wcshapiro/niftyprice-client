import React from "react";
import "./App.css";
import "./About.css";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Timeline } from "react-twitter-widgets";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    maxHeight: 450,
  },
});

function About() {
  const classes = useStyles();
  return (
    <>
      <div class="about-wrap">
        <Grid container justifyContent="center">
          <div class="top-section">
            <Grid container justifyContent="space-evenly" spacing={4}>
              <Grid item lg={6} xs={12}>
                <Typography variant="h2" component="h2">
                  What is Niftyprice?
                </Typography>
              </Grid>
              <Grid item lg={6} xs={12}>
                <Typography variant="h5" component="h5">
                  Niftyprice is a new and small team focused on providing the
                  most up to date and comprehensive NFT data in the market
                  today. As you know, this is a fast moving space, so we are
                  working hard to continually push updates, increase our
                  coverage, and enhance our data engine to provide you the best
                  product possible while staying up to speed on all the rapid
                  changes taking place in the NFT world. At the end of the day,
                  we're here for you, the NFT investors and patrons, so please
                  let us know any feedback you have or how we can help solve
                  your burning NFT issues. -NP
                </Typography>
              </Grid>
            </Grid>
          </div>
          <div class="mid-section">
            <Grid container justifyContent="space-evenly">
              <Grid item lg={6} xs={12}>
                <Typography variant="h2" component="h2">
                  What are NFT's?
                </Typography>
              </Grid>
              <Grid item lg={6} xs={12}>
                <Typography variant="h5" component="h5">
                  A non-fungible token is a unit of data stored on a digital
                  ledger, called a blockchain, that certifies a digital asset to
                  be unique and therefore not interchangeable. NFTs can be used
                  to represent items such as photos, videos, audio, and other
                  types of digital files.
                </Typography>
              </Grid>
            </Grid>
          </div>
          <div class="bottom-section">
            <Grid item lg={12}>
              <Typography variant="h2" component="h2">
                Our Twitter{" "}
              </Typography>
            </Grid>
            <div class="card-content">
              <Grid container justifyContent="space-evenly">
                <Grid item xs={12} lg={4}>
                  <Card className={classes.root}>
                    <CardContent>
                      <Timeline // twitter embedded scrollable object
                        dataSource={{
                          sourceType: "url",
                          url: "https://twitter.com/niftyprice_io",
                          screenName: "NiftyPrice.io",
                        }}
                        options={{
                          height: "400",
                          width: "500",
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </div>
          </div>
        </Grid>
      </div>
    </>
  );
}
export default About;
