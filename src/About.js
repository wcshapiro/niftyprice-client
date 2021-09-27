import React, { useEffect, useState } from "react";
import "./App.css";
import "./About.css";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import chris from "./static/images/chris.jpeg";
import { Timeline } from "react-twitter-widgets";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    maxHeight : 400
  },
  media: {
    height: 137,
    paddingTop: "56.25%", // 16:9
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

function About() {
  const classes = useStyles();

  return (
    <>
      <div class="about-wrap">
        <Grid container justifyContent="center">
          <div class="top-section">
            <Grid container justifyContent="space-evenly">
              <Grid item lg={6} xs={12}>
                <Typography variant="h5" component="h5">
                  Guys, we’re just getting started. We’re a small team, but
                  we’re focused and dedicated to be the best source of NFT data
                  in the market. This is a fast moving space as you all know, so
                  bare with us as we get our arms and systems around everything.
                  In the meantime, drop us an email on the Feedback page and let
                  us know how we can help solve your major issues as an NFT
                  investor. -NP
                </Typography>
              </Grid>
              <Grid item lg={6} xs={12}>
                <Typography variant="h2" component="h2">
                  What is Niftyprice?
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
                The Team{" "}
              </Typography>
            </Grid>
            <div class="card-content">
              <Grid container justifyContent="space-evenly">
                <Grid item xs={12} lg={3} id="people">
                  <Card className={classes.root}>
                    <CardMedia
                      className={classes.media}
                      image={chris}
                      title="Chris Kelly"
                    />
                    <CardContent>
                      <Typography variant="h5" component="h2">
                        Chris Kelly
                      </Typography>
                      <Typography className={classes.pos} color="textSecondary">
                        Founder
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} lg={3}>
                <Card className={classes.root}>
                    <CardContent>
                    <Timeline
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
