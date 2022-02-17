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
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
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
    // maxHeight: 450,
    // minHeight: 500,
  },
  portfolioStatRight: {
    float: "right",
  },
  portfolioText: {
    fontWeight: "bold",
    float: "left",
    fontSize: 20,
  },
  portfolioTextRight: {
    float: "right",
    fontSize: 20,
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
  return x || x == 0
    ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : "---";
}
function Portfolio({ portfolio_metrics }) {
  const [toggle, setToggle] = useState("usd");
  const [loading, setLoading] = useState(true);
  const [chartLoading, setchartLoading] = useState(true);
  const classes = useStyles();
  const [valuation, setValuation] = useState("collection");
  const [data, setData] = useState();
  const [fpp_chart_options, setChartOptionsFpp] = useState(null);
  const handleValuation = (event, newValuation) => {
    setValuation(newValuation);
  };
  const handleToggle = (event, newValuation) => {
    setToggle(newValuation);
  };
  const load_chart = async () => {
    setchartLoading(true);
    let totalvals = [];
    let portfolio_val = 0;
    for (const element of portfolio_metrics.data) {
      let entry_date = new Date(element[2]);
      let price = Number(element[7]);
      let vals = [entry_date.getTime(), price];
      totalvals.push(vals);
    }
    let sortedVals = [];
    totalvals.sort(function (a, b) {
      return a[0] - b[0];
    });
    for (const val in totalvals) {
      portfolio_val += totalvals[val][1];
      let sortedVal = [totalvals[val][0], portfolio_val];
      sortedVals.push(sortedVal);
    }

    setChartOptionsFpp({
      tooltip: {
        shared: true,
        pointFormat:
          " {series.options.custom.prefix}{point.y}{series.options.custom.suffix} {series.options.custom.legendName} ",
      },
      legend: {
        enabled: true,
        labelFormatter: function () {
          return this.name + " (click to show)";
        },
      },
      title: {
        text: "Portfolio Value",
      },
      yAxis: [
        {
          // title: {
          //     text: 'Value (USD)'
          // },
          offset: 0,

          lineWidth: 1,
        },
      ],
      series: [
        {
          id: "EF",
          linkedTo: "ET",
          name: "Portfolio Value (ETH)",
          data: portfolio_metrics.historical_perf
            ? portfolio_metrics.historical_perf.eth
            : [],
          color: "#3819D2",
          visible: false,
          custom: {
            prefix: null,
            legendName: "Collection Floor Value",
            suffix: "ETH",
          },
        },
        {
          id: "ET",
          custom: {
            legendName: "Trait Floor Value",
            prefix: null,
            suffix: "ETH",
          },
          // showInLegend:false,

          name: "Portfolio Value (ETH)",
          data: portfolio_metrics.historical_perf
            ? portfolio_metrics.historical_perf.trait.eth
            : [],
          color: "#1974D2",

          visible: false,
        },
        {
          id: "EE",
          custom: {
            legendName: "NP-Estimate Value",
            prefix: null,
            suffix: "ETH",
          },
          // showInLegend:false,
          linkedTo: "ET",

          name: "Portfolio Value (ETH)",
          data: portfolio_metrics.historical_perf
            ? portfolio_metrics.historical_perf.trait.eth
            : [],
          color: "#1974D2",

          visible: false,
        },
        {
          custom: {
            legendName: "Collection Floor Value",
            prefix: "$",
            suffix: null,
          },
          id: "UC",
          linkedTo: "UT",
          name: "Portfolio Value (USD)",
          data: portfolio_metrics.historical_perf
            ? portfolio_metrics.historical_perf.usd
            : [],
          color: "#3819D2",
        },
        {
          custom: {
            legendName: "Trait Floor Value",
            prefix: "$",
            suffix: null,
          },
          id: "UT",
          name: "Portfolio Value (USD)",
          data: portfolio_metrics.historical_perf
            ? portfolio_metrics.historical_perf.trait.usd
            : [],
          color: "#1974D2",
        },
        {
          custom: {
            legendName: "NP-Estimate Value",
            prefix: "$",
            suffix: null,
          },
          id: "UE",
          linkedTo: "UT",

          name: "Portfolio Value (USD)",
          data: portfolio_metrics.historical_perf
            ? portfolio_metrics.historical_perf.estimate.usd
            : [],
          color: "#1974D2",
        },
      ],
      plotOptions: {
        series: {
          events: {
            legendItemClick: function () {
              this.chart.series.forEach(function (s) {
                if (s !== this && s.visible) {
                  s.hide();
                }
              });

              return !this.visible ? true : false;
            },
          },
        },
      },
    });
  };
  const load_metrics = async () => {
    let data = {
      value: {
        collection: portfolio_metrics.value,
        trait: portfolio_metrics.trait_floor_value,
        estimate: { eth: 0, usd: 0 },
      },
      gain: {
        refresh: {
          number: {
            collection: portfolio_metrics.last_refresh.gain.collection,
            trait: portfolio_metrics.last_refresh.gain.trait_val,
            estimate: { eth: 0, usd: 0 },
          },
          percent: {
            collection: portfolio_metrics.last_refresh.percent_gain.collection,
            trait: portfolio_metrics.last_refresh.percent_gain.trait_val,
            estimate: { eth: 0, usd: 0 },
          },
        },
        day: {
          number: {
            collection: {
              usd: portfolio_metrics.day_change.gain_usd,
              eth: portfolio_metrics.day_change.gain_eth,
            },
            trait: {
              usd: portfolio_metrics.day_change.trait_gain_usd,
              eth: portfolio_metrics.day_change.trait_gain_eth,
            },
            estimate: { eth: 0, usd: 0 },
          },
          percent: {
            collection: {
              usd: portfolio_metrics.day_change.percent_gain_usd,
              eth: portfolio_metrics.day_change.percent_gain_eth,
            },
            trait: {
              usd: portfolio_metrics.day_change.trait_percent_gain_usd,
              eth: portfolio_metrics.day_change.trait_percent_gain_eth,
            },
            estimate: { eth: 0, usd: 0 },
          },
        },
        number: {
          collection: portfolio_metrics.gain,
          trait: portfolio_metrics.trait_gain,
          estimate: { eth: 0, usd: 0 },
        },
        percent: {
          collection: portfolio_metrics.gain_percent,
          trait: portfolio_metrics.trait_gain_percent,
          estimate: { eth: 0, usd: 0 },
        },
      },
    };
    setLoading(true);
    portfolio_metrics["refined_data"] = data;
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
  if (loading || !data || !data.last_refresh) {
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
                        <Grid container justifyContent="space-evenly">
                          <Grid item xs={12}>
                            <Grid container justifyContent="space-evenly">
                              <Grid item xs={6}>
                                <Typography variant="h6" align="left">
                                  Current Value:
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="h6" align="right">
                                  {/* Collection Floor */}
                                  <ToggleButtonGroup
                                    exclusive
                                    value={valuation}
                                    onChange={handleValuation}
                                  >
                                    <ToggleButton
                                      disabled={valuation == "collection"}
                                      value="collection"
                                      aria-label="left aligned"
                                      style={
                                        valuation == "collection"
                                          ? {
                                              backgroundColor: "#1C72D9",
                                              color: "#FFFFFF",
                                            }
                                          : {}
                                      }
                                    >
                                      Collection
                                    </ToggleButton>
                                    <ToggleButton
                                      disabled={valuation == "trait"}
                                      value="trait"
                                      aria-label="centered"
                                      style={
                                        valuation == "trait"
                                          ? {
                                              backgroundColor: "#1C72D9",
                                              color: "#FFFFFF",
                                            }
                                          : {}
                                      }
                                    >
                                      Trait
                                    </ToggleButton>
                                    <ToggleButton
                                      disabled={valuation == "estimate"}
                                      value="estimate"
                                      aria-label="right aligned"
                                      style={
                                        valuation == "estimate"
                                          ? {
                                              backgroundColor: "#1C72D9",
                                              color: "#FFFFFF",
                                            }
                                          : {}
                                      }
                                    >
                                      NP-Estimate
                                    </ToggleButton>
                                  </ToggleButtonGroup>
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container justifyContent="space-evenly">
                          <Grid item xs={12}>
                            <Grid
                              container
                              // justifyContent="flex-start"
                              spacing={2}
                            >
                              <Grid item xs={12}>
                              <Grid container justifyContent="space-between">
                          <Grid item xs={6}>
                                <Typography variant="h3" align="left">
                                  {toggle == "usd" ? "$" : ""}
                                  {numberWithCommas(
                                    Number(
                                      data.refined_data.value[valuation][toggle]
                                    ).toFixed(2)
                                  )}
                                  {toggle == "eth" ? "ETH" : ""}
                                </Typography>
                              </Grid>
                              <Grid item xs={6} >
                              <Typography variant="h6" align="right">
                                <ToggleButtonGroup
                                  exclusive
                                  value={toggle}
                                  onChange={handleToggle}
                                >
                                  <ToggleButton
                                    disabled={toggle == "usd"}
                                    value="usd"
                                    aria-label="left aligned"
                                    style={
                                      toggle == "usd"
                                        ? {
                                            backgroundColor: "#1C72D9",
                                            color: "#FFFFFF",
                                          }
                                        : {}
                                    }
                                  >
                                    USD
                                  </ToggleButton>

                                  <ToggleButton
                                    disabled={toggle == "eth"}
                                    value="eth"
                                    aria-label="right aligned"
                                    style={
                                      toggle == "eth"
                                        ? {
                                            backgroundColor: "#1C72D9",
                                            color: "#FFFFFF",
                                          }
                                        : {}
                                    }
                                  >
                                    ETH
                                  </ToggleButton>
                                </ToggleButtonGroup>
                                </Typography>
                              </Grid>
                              
                              </Grid>
                              
                              </Grid>
                              

                              <Grid item xs={12}>
                                <Grid container justifyContent="space-between">
                                  <Grid item xs={6}>
                                    <Typography
                                      variant="h4"
                                      align="left"
                                      className={classes.portfolioText}
                                    >
                                      Total Gain:
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Typography
                                      variant="h4"
                                      align="right"
                                      className={classes.portfolioTextRight}
                                      style={
                                        Number(
                                          data.refined_data.gain.percent[
                                            valuation
                                          ][toggle]
                                        ) > 0
                                          ? { color: "#065f46" }
                                          : { color: "#e04343" }
                                      }
                                    >
                                      {Number(
                                        data.refined_data.gain.percent[
                                          valuation
                                        ][toggle]
                                      ) > 0
                                        ? "+"
                                        : "-"}
                                      {toggle == "usd" ? "$" : ""}

                                      {numberWithCommas(
                                        Math.abs(
                                          data.refined_data.gain.number[
                                            valuation
                                          ][toggle]
                                        ).toFixed(2)
                                      )}{toggle == "eth" ? "ETH" : ""}
                                      (
                                      {numberWithCommas(
                                        data.refined_data.gain.percent[
                                          valuation
                                        ][toggle].toFixed(2)
                                      )}
                                      %)
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item xs={12}>
                                <Grid container justifyContent="space-between">
                                  <Grid item xs={6}>
                                    <Typography
                                      variant="h4"
                                      align="left"
                                      className={classes.portfolioText}
                                    >
                                      24h Gain:
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Typography
                                      variant="h4"
                                      align="right"
                                      className={classes.portfolioTextRight}
                                      style={
                                        Number(
                                          data.refined_data.gain.day.percent[
                                            valuation
                                          ][toggle]
                                        ) > 0
                                          ? { color: "#065f46" }
                                          : { color: "#e04343" }
                                      }
                                    >
                                      {Number(
                                        data.refined_data.gain.day.percent[
                                          valuation
                                        ][toggle]
                                      ) > 0
                                        ? "+"
                                        : "-"}
                                      {toggle == "usd" ? "$" : ""}

                                      {numberWithCommas(
                                        Math.abs(
                                          data.refined_data.gain.day.number[
                                            valuation
                                          ][toggle]
                                        ).toFixed(2)
                                      )}{toggle == "eth" ? "ETH" : ""}
                                      (
                                      {numberWithCommas(
                                        data.refined_data.gain.day.percent[
                                          valuation
                                        ][toggle].toFixed(2)
                                      )}
                                      %)
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item xs={12}>
                                <Grid
                                  container
                                  spacing={1}
                                  justifyContent="space-between"
                                >
                                  <Grid item xs={6}>
                                    <Typography
                                      variant="h4"
                                      align="left"
                                      className={classes.portfolioText}
                                    >
                                      Since refresh:
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Typography
                                      variant="h4"
                                      align="right"
                                      className={classes.portfolioTextRight}
                                      style={
                                        Number(
                                          data.refined_data.gain.refresh
                                            .percent[valuation][toggle]
                                        ) > 0
                                          ? { color: "#065f46" }
                                          : { color: "#e04343" }
                                      }
                                    >
                                      {Number(
                                        data.refined_data.gain.refresh.percent[
                                          valuation
                                        ][toggle]
                                      ) > 0
                                        ? "+"
                                        : "-"}
                                      {toggle == "usd" ? "$" : ""}

                                      {numberWithCommas(
                                        Math.abs(
                                          data.refined_data.gain.refresh.number[
                                            valuation
                                          ][toggle]
                                        ).toFixed(2)
                                      )}
                                      {toggle == "eth" ? "ETH" : ""}
                                      (
                                      {numberWithCommas(
                                        data.refined_data.gain.refresh.percent[
                                          valuation
                                        ][toggle].toFixed(2)
                                      )}
                                      %)
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                          {/* <Grid item xs={2}>
                            <div class="verticalLine"></div>
                          </Grid> */}
                          {/* <Grid item xs={5}>
                            <Grid
                              container
                              // justifyContent="space-evenly"
                              spacing={2}
                            >
                              <Grid item xs={12}>
                                <Grid container>
                                  <Grid item xs={12}>
                                    <Typography
                                      variant="h4"
                                      className={classes.portfolioStatRight}
                                    >
                                      {numberWithCommas(
                                    Number(
                                      data.refined_data.value[valuation].eth
                                    ).toFixed(2)
                                  )}ETH
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item xs={12}>
                                <Grid container spacing={1}>
                                  <Grid item xs={6}>
                                    <Typography
                                      variant="subtitle"
                                      align="left"
                                      className={classes.portfolioText}
                                    >
                                      {" "}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                  <Typography
                                      variant="subtitle"
                                      align="right"
                                      className={classes.portfolioTextRight}
                                      style={
                                        Number(
                                          data.refined_data.value[valuation].eth
                                        ) > 0
                                          ? { color: "#065f46" }
                                          : { color: "#e04343" }
                                      }
                                    >
                                      {Number(
                                        data.refined_data.gain.percent[
                                          valuation
                                        ].eth
                                      ) > 0
                                        ? "+"
                                        : "-"}
                                      
                                      {Number(
                                        Math.abs(
                                          data.refined_data.gain.number[
                                            valuation
                                          ].eth
                                        ).toFixed(2)
                                      )}ETH
                                      (
                                      {numberWithCommas(
                                        
                                          
                                            data.refined_data.gain.percent[
                                              valuation
                                            ].eth
                                          .toFixed(2)
                                        
                                      )}
                                      %)
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item xs={12}>
                                <Grid container spacing={1}>
                                  <Grid item xs={6}>
                                    <Typography
                                      variant="subtitle"
                                      align="left"
                                      className={classes.portfolioText}
                                    >
                                      {" "}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                  <Typography
                                      variant="subtitle"
                                      align="right"
                                      className={classes.portfolioTextRight}
                                      style={
                                        Number(
                                          data.refined_data.gain.day.percent[
                                            valuation
                                          ].eth
                                        ) > 0
                                          ? { color: "#065f46" }
                                          : { color: "#e04343" }
                                      }
                                    >
                                      {Number(
                                        data.refined_data.gain.day.percent[
                                          valuation
                                        ].eth
                                      ) > 0
                                        ? "+"
                                        : "-"}
                                      
                                      {Number(
                                        Math.abs(
                                          data.refined_data.gain.day.number[
                                            valuation
                                          ].eth
                                        ).toFixed(2)
                                      )}ETH
                                      (
                                      {numberWithCommas(
                                        
                                         
                                            data.refined_data.gain.day.percent[
                                              valuation
                                            ].eth
                                          .toFixed(2)
                                        
                                      )}
                                      %)
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>

                              <Grid item xs={12}>
                                <Grid container spacing={1}>
                                  <Grid item xs={12}>
                                  <Typography
                                      variant="subtitle"
                                      align="right"
                                      className={classes.portfolioTextRight}
                                      style={
                                        Number(
                                          data.refined_data.gain.refresh.percent[
                                            valuation
                                          ].eth
                                        ) > 0
                                          ? { color: "#065f46" }
                                          : { color: "#e04343" }
                                      }
                                    >
                                      {Number(
                                        data.refined_data.gain.refresh.percent[
                                          valuation
                                        ].eth
                                      ) > 0
                                        ? "+"
                                        : "-"}
                                      
                                      {Number(
                                        Math.abs(
                                          data.refined_data.gain.refresh.number[
                                            valuation
                                          ].eth
                                        ).toFixed(2)
                                      )}ETH
                                      (
                                      {numberWithCommas(
                                        
                                          
                                            data.refined_data.gain.refresh.percent[
                                              valuation
                                            ].eth
                                          .toFixed(2)
                                        
                                      )}
                                      %)
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid> */}
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
