import React from "react";
import "./App.css";
import "./Demo.css";
import { Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  alert: {
    minHeight: 50,
  },
  root: {
    flexgrow: 1,
    minHeight: 285,
    maxHeight: 600,
  },
});
function Demo() {
  const classes = useStyles();

  return (
    <>
      <div class="Demo-wrap">
        <Grid container spacing={8} justifyContent="space-evenly">
          <Grid item xs={8}>
            <Typography variant = "h3">
                Demo coming soon
            </Typography>

          </Grid>
        </Grid>
      </div>
    </>
  );
}
export default Demo;
