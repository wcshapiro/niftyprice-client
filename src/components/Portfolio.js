import { React, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import "../components/Portfolio.css";
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
    maxHeight: 400,
    // minHeight: 500,
  },
  portfolioStatRight: {
    float: "right",
  },
  portfolioText: {
    fontWeight: "bold",
    float: "left",
    fontSize: 18,
  },
  portfolioTextRight: {
    float: "right",
    fontSize: 18,
  },
  portfolioTextRightBold: {
    float: "right",
    fontWeight: "bold",

    fontSize: 18,
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
  const [toggle, setToggle] = useState(true);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setchartLoading] = useState(true);
  const classes = useStyles();
  const [data, setData] = useState();
  const [fpp_chart_options, setChartOptionsFpp] = useState(null);

  const load_chart = async () => {
    setchartLoading(true);
    let totalvals = [];
    let portfolio_val = 0;
    // console.log("METRICS",portfolio_metrics)
    for (const element of portfolio_metrics.data) {
      let entry_date = new Date(element[2]);
      let price = Number(element[7]);
      let vals = [entry_date.getTime(), price];
      totalvals.push(vals);
    }
    let sortedVals = []
    totalvals.sort(function (a, b) {
      return a[0] - b[0];
    })
    for (const val in totalvals){
      portfolio_val +=totalvals[val][1]
      let sortedVal = [totalvals[val][0],portfolio_val]
      sortedVals.push(sortedVal)
    }

    setChartOptionsFpp({
      title: {
        text: "Portfolio Value",
      },
      series: [
        {
          name: "Value (ETH)",
          data: sortedVals,
        },
      ],
    });
  };
  const load_metrics = async () => {
    setLoading(true);

    setData(portfolio_metrics);
  };

  useEffect(() => {
    if (Object.keys(portfolio_metrics).length > 0) {
      load_metrics();
    }
  }, [portfolio_metrics]);
  useEffect(() => {
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
              <Grid item xs={12} lg={5}>
                <Card className={classes.portfolioCover} elevation={5}>
                  <CardContent>
                    <Typography variant="h4" align="center">
                      Portfolio Stats
                    </Typography>
                    <Typography variant="subtitle1" align="center">
                      {data.user ? <> {data.user.addr}</> : "---"}
                    </Typography>
                    <hr></hr>

                    <Grid container justifyContent="space-evenly" spacing={2}>
                      <Grid item xs={12}>
                        <Grid container>
                          <Grid item xs={6}>
                            <Typography variant="h6" align="left">
                              Current Value:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="h6" align="right">
                              Collection Floor
                              <Switch
                                color="primary"
                                onClick={() => {
                                  setToggle(!toggle);
                                }}
                              ></Switch>
                              Trait Floor
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container justifyContent="space-evenly">
                          <Grid item xs={5}>
                            <Grid
                              container
                              justifyContent="flex-start"
                              spacing={1}
                            >
                              <Grid item xs={12}>
                                <Typography variant="h4" align="left">
                                  $
                                  {toggle
                                    ? numberWithCommas(
                                        data.value.usd.toFixed(2)
                                      )
                                    : numberWithCommas(
                                        data.trait_floor_value.usd.toFixed(2)
                                      )}
                                </Typography>
                              </Grid>

                              <Grid item xs={12}>
                                <Grid container justifyContent="space-between" >
                                  <Grid item xs={6}>
                                    <Typography
                                      variant="subtitle"
                                      align="left"
                                      className={classes.portfolioText}
                                    >
                                       Gain:
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Typography
                                      variant="subtitle"
                                      align="right"
                                      className={classes.portfolioTextRight}
                                      style={ toggle?
                                        (parseFloat(data.gain_percent) > 0
                                          ? { color: "#065f46" }
                                          : { color: "#e04343" }):
                                          (parseFloat(data.trait_gain_percent) > 0
                                          ? { color: "#065f46" }
                                          : { color: "#e04343" })
                                      }
                                    >
                                      {(toggle)?(data.gain.usd > 0 ? "+" : "-"):(data.trait_gain.usd > 0 ? "+" : "-")}$
                                      {toggle?numberWithCommas(
                                        Math.abs(data.gain.usd.toFixed(2))
                                      ):numberWithCommas(
                                        Math.abs(data.trait_gain.usd.toFixed(2))
                                      )}
                                      (
                                      {numberWithCommas(
                                        toggle?data.gain_percent.toFixed(2):data.trait_gain_percent.toFixed(2)
                                      )}
                                      %)
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={2}>
                            
                            <div class="verticalLine"></div>
                          </Grid>
                          <Grid item xs={5}>
                            <Grid
                              container
                              justifyContent="space-evenly"
                              spacing={1}
                            >
                              <Grid item xs={12}>
                                <Typography
                                  variant="h4"
                                  className={classes.portfolioStatRight}
                                >
                                  {toggle
                                    ? data.value.eth.toFixed(2)
                                    : numberWithCommas(
                                        data.trait_floor_value.eth.toFixed(2)
                                      )}
                                  ETH
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography
                                  variant="subtitle"
                                  className={classes.portfolioTextRight}
                                  style={ toggle?
                                    (parseFloat(data.gain_percent) > 0
                                      ? { color: "#065f46" }
                                      : { color: "#e04343" }):
                                      (parseFloat(data.trait_gain_percent) > 0
                                      ? { color: "#065f46" }
                                      : { color: "#e04343" })
                                  }
                                >
                                  {(toggle)?(data.gain.eth > 0 ? "+" : "-"):(data.trait_gain.eth > 0 ? "+" : "-")}
                                      {toggle?numberWithCommas(
                                        Math.abs(data.gain.eth.toFixed(2))
                                      ):numberWithCommas(
                                        Math.abs(data.trait_gain.eth.toFixed(2))
                                      )}ETH
                                      (
                                      {numberWithCommas(
                                        toggle?data.gain_percent.toFixed(2):data.trait_gain_percent.toFixed(2)
                                      )}
                                      %)
                                </Typography>
                              </Grid>
                              <Grid item xs={10}></Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <hr></hr>
                    <Grid item xs={12}>
                      <Grid container justifyContent="space-evenly">
                        <Grid item xs={6}>
                          <Grid
                            container
                            justifyContent="space-evenly"
                            spacing={2}
                          >
                            <Grid item xs={12}>
                              <Typography
                                variant="subtitle"
                                align="left"
                                className={classes.portfolioText}
                              >
                                Total NFTs Owned:
                              </Typography>
                            </Grid>
                            
                            <Grid item xs={12}>
                              <Typography
                                variant="subtitle"
                                align="left"
                                className={classes.portfolioText}
                              >
                                Total gas spent:
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography
                                variant="subtitle"
                                align="left"
                                className={classes.portfolioText}
                              >
                                Total cost, incl. gas:
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={6}>
                          <Grid
                            container
                            justifyContent="space-evenly"
                            spacing={2}
                          >
                            <Grid item xs={12}>
                              <Typography
                                variant="subtitle"
                                className={classes.portfolioTextRight}
                              >
                                {data.nft_count}
                              </Typography>
                            </Grid>
                            
                            <Grid item xs={12}>
                              <Typography
                                variant="subtitle"
                                className={classes.portfolioTextRight}
                              >
                                $
                                {numberWithCommas(data.gas_cost.usd.toFixed(2))}
                                (
                                {numberWithCommas(data.gas_cost.eth.toFixed(2))}{" "}
                                ETH)
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography
                                variant="subtitle"
                                className={classes.portfolioTextRightBold}
                              >
                                $
                                {numberWithCommas(
                                  data.total_cost.usd.toFixed(2)
                                )}
                                (
                                {numberWithCommas(
                                  data.total_cost.eth.toFixed(2)
                                )}{" "}
                                ETH)
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} lg={6}>
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
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }
}
export default Portfolio;
