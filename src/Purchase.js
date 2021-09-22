import React, { useEffect, useState } from 'react';
import Footer from "./Footer.js"
import "./App.css"
import './Purchase.css'
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';




const useStyles = makeStyles({
    root: {
        maxWidth: 300,
        minHeight: 250,
    },


    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});
function Purchase() {
    const [spacing, setSpacing] = useState(2);

    const classes = useStyles();
    const handleChange = (event) => {
        setSpacing(Number(event.target.value));
    };


    return (<>
        <div class="purchase-wrap">
            <div class="top-content">

                <Grid item xs={12}>
                    <Typography variant="h3" component="h2">

                        Prices and Plans
                    </Typography>
                    <hr>
                    </hr>
                    <Typography variant="h5" component="h5">

                        With 10's of thousands of datapoints collected already, and thousands more being added each day, NiftyPrice is the go-to source for NFT Collection historical data and analysis.
                        We offer detailed historical quotes, graphical visualizations, in-depth calculations beyond just pricing. To join and get access to exclusive data streams and notifications, review the packages below.
                    </Typography>
                </Grid>
            </div>
            <div class="mid-content">
                <Grid container spacing={10}
                    justifyContent="center"
                >
                    <Grid item >
                        <Card id="prices" className={classes.root}>
                            <CardContent>
                                <Typography variant="h4" component="h4">
                                    $9.99/month
                                </Typography>
                                <Typography lassName={classes.pos} color="textSecondary">
                                    Access to NFT data downloads for opensea collections excluding artblocks
                                </Typography>

                            </CardContent>
                            <CardActions style={{justifyContent: 'center'}}>
                                    <Button size="small">Purchase</Button>
                                </CardActions>
                        </Card>
                    </Grid>
                    <Grid item >
                        <Card id="prices" className={classes.root}>
                            <CardContent>
                                <Typography variant="h4" component="h4">
                                    $15.99/month
                                </Typography>
                                <Typography assName={classes.pos} color="textSecondary">
                                    Access to NFT Data for Opensea Collections Including Artblocks sub-collections
                                </Typography>

                            </CardContent>
                            <CardActions style={{justifyContent: 'center'}}>
                                    <Button size="small">Purchase</Button>
                                </CardActions>
                        </Card>
                    </Grid>
                    <Grid item >
                        <Card id="prices" className={classes.root}>
                            <CardContent>
                                <Typography variant="h4" component="h4">
                                    $25.99/month
                                </Typography>
                                <Typography assName={classes.pos} color="textSecondary">
                                    Access to all NFT data for Opensea and Solana collections including all artblocks sub-collections
                                </Typography>
                            </CardContent>
                            <CardActions style={{ justifyContent: 'center' }}>
                                <Button size="small">Purchase</Button>
                            </CardActions>


                        </Card>
                    </Grid>

                </Grid>
            </div>



        </div>
    </>

    )

}
export default Purchase;

