import { React, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CardMedia from "@material-ui/core/CardMedia";
import Image from "../static/images/usr.png";
import HighchartsReact from "highcharts-react-official";
import HighStock from "highcharts/highstock";

import { isNull, isUndefined } from "lodash";
import { CircularProgress } from "@material-ui/core";
const useStyles = makeStyles({
  root: {
    flexgrow: 1,
    marginTop: 10,
    marginLeft: 10,
  },
  nftCount: {
    flexgrow: 1,
    height: "100%",
  },
  portfolioCover: {
    flexgrow: 1,
    height: "100%",
    // minHeight: 500,
  },
  portfolioVal: {
    maxWidth: 200,
    maxHeight: 200,
    minWidth: 120,
    minHeight: 120,
  },
  cover: {
    marginTop: 20,
    marginLeft: "24%",
    // float: "left",
    minHeight: 250,
    maxHeight: 250,
    minWidth: 250,
    maxWidth: 250,
    borderRadius: "50%",
    // display: "inline",
    // marginBottom: 50,
  },
});
function numberWithCommas(x) {
  return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "---";
}
function Portfolio({ portfolio_metrics }) {
  const [loading, setLoading] = useState(true);
  const [chartLoading, setchartLoading] = useState(true);
  const classes = useStyles();
  const [data, setData] = useState();
  const [fpp_chart_options, setChartOptionsFpp] = useState(null);
  console.log("metrics", portfolio_metrics, data);

  const load_chart = async () => {
    setchartLoading(true);
    let totalvals = [];
    let portfolio_val = 0;
    for (const element of portfolio_metrics.data) {
      let entry_date = new Date(element[2]);
      portfolio_val +=Number(element[7])
      let vals = [entry_date.getTime(), portfolio_val];
      totalvals.push(vals);
    }

    console.log("vals", totalvals);
    setChartOptionsFpp({
      title: {
        text: "Portfolio Value",
      },
      series: [
        {
          name: "Value (ETH)",
          data: totalvals.sort(),
        },
      ],
    });
  };
  const load_metrics = async () => {
    setLoading(true);

    setData(portfolio_metrics);
    console.log("METRICS", portfolio_metrics);
  };

  useEffect(() => {
    if (Object.keys(portfolio_metrics).length > 0) {
      load_metrics();
    }
  }, [portfolio_metrics]);
  useEffect(() => {
    console.log(
      "portfolio_metrics,data chart",
      portfolio_metrics,
      data,
      Object.keys(portfolio_metrics).length,
      fpp_chart_options
    );
    if (data) {
      setLoading(false);
    }

    if (fpp_chart_options) {
      setchartLoading(false);
    }
  }, [data, fpp_chart_options]);
  useEffect(() => {
    if (Object.keys(portfolio_metrics).length > 0) {
      load_chart();
    }
  }, [portfolio_metrics]);
  if (loading || !data) {
    return (
      <>
        <CircularProgress />
      </>
    );
  } else {
    return (
      <>
        <Grid container justifyContent="space-evenly" spacing={2}>
          <Grid item xs={12}>
            <Grid container justifyContent="space-evenly" spacing={2}>
              <Grid item xs={12} lg={4}>
                <Card className={classes.portfolioCover} elevation={5}>
                  <CardContent>
                    <Typography variant="h4" align="center">
                      {data.user ? <>Welcome, {data.user.username}</> : "---"}
                    </Typography>
                  </CardContent>
                  <Grid container justifyContent="space-between">
                    <Grid item xs={12}>
                      <CardMedia
                        image={data.user ? data.user.img : Image}
                        className={classes.cover}
                        title="User"
                      />
                    </Grid>
                  </Grid>
                  <CardContent>
                    <Typography variant="subtitle1" align="center">
                      {data.user ? <> {data.user.addr}</> : "---"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} lg={8}>
                <Card className={classes.portfolioCover} elevation={5}>
                  <CardContent>
                    {!fpp_chart_options ? (
                      <CircularProgress />
                    ) : (
                      <HighchartsReact
                        class="chart"
                        highcharts={HighStock}
                        constructorType={"stockChart"}
                        options={fpp_chart_options}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container justifyContent="space-evenly" spacing={2}>
              <Grid item xs={4}>
                <Card className={classes.nftCount} elevation={5}>
                  <CardContent>
                    <Grid container justifyContent="space-evenly" spacing={2}>
                      <Grid item xs={12}>
                        <Grid
                          container
                          justifyContent="space-evenly"
                          spacing={2}
                        >
                          <Grid item xs={2}>
                          <Typography variant="h4" align="left">
                          Value
                        </Typography>
                          </Grid>
                          <Grid item xs={10}>
                        <Typography variant="h4" align="right">
                          ${numberWithCommas(data.value.usd.toFixed(2))}/Ξ
                          {data.value.eth.toFixed(2)}
                        </Typography>
                      </Grid>
                        </Grid>
                        
                      </Grid>

                      
                      <Grid item xs={6}>
                        <Typography variant="h4" align="left">
                          Items
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h4" align="right">
                          {data.nft_count}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card className={classes.nftCount} elevation={5}>
                  <CardContent>
                    <Grid container justifyContent="space-evenly" spacing={2}>
                      <Grid item xs={2}>
                        <Grid
                          container
                          justifyContent="space-evenly"
                          spacing={2}
                        >
                          <Grid item xs={12}>
                            <Typography variant="h4" align="left">
                              Gain
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={10}>
                        <Grid item xs={12}>
                          <Typography variant="h4" align="right">
                            {(data.gain.usd)>0?"":"-"}${numberWithCommas(Math.abs(data.gain.usd.toFixed(2)))}/
                            {(data.gain.eth)>0?"":"-"}Ξ{numberWithCommas(Math.abs(data.gain.eth.toFixed(2)))}
                          </Typography>
                        </Grid>
                        <Typography
                          variant="h4"
                          align="right"
                          style={
                            parseFloat(data.gain_percent) > 0
                              ? { color: "#26ad3f" }
                              : { color: "#e04343" }
                          }
                        >
                          {numberWithCommas(data.gain_percent.toFixed(2))}%
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card className={classes.nftCount} elevation={5}>
                  <CardContent>
                    <Grid container justifyContent="space-evenly" spacing={2}>
                      <Grid item xs={2}>
                        <Typography variant="h4" align="left">
                          Cost
                        </Typography>
                      </Grid>
                      <Grid item xs={10}>
                        <Typography variant="h4" align="right">
                          ${numberWithCommas(data.total_cost.usd.toFixed(2))}/Ξ
                          {numberWithCommas(data.total_cost.eth.toFixed(2))}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }
}
export default Portfolio;
