import React, {  } from 'react';
import "./App.css"
import "./Newsletter.css"
import Form from "./Form.js"
import { Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles({
    alert: {
      minHeight: 50,
    },
    root: {
      flexgrow: 1,
      minHeight: 285,
      maxHeight: 285,
    },});
function Newsletter() {
    
        const classes = useStyles();

    return (<>
        <div class="newsletter-wrap">
            <Card elevation={5} className={classes.root}>
            <CardContent>
            <Grid container>
                <Grid item xs={12}>
                    <div class = "title-content">
                <Typography variant="h2" align="center" fontWeight="Bold">
                            Get Latest NFT News!
                          </Typography>
                          <div class = "subtitle-content">
                          <Typography variant="subtitle3" align="center" >
                            Sign up for our newsletter to get the latest charts, analysis and project annonucements sent directly to you!
                          </Typography>
                          </div>
                          
                          </div>
                    </Grid>
                <Grid item xs={12}>
            <Form/>
            </Grid>
            </Grid>
            </CardContent>
            </Card>
        </div>
    </>)}
export default Newsletter;

