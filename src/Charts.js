import React, { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import HighStock from "highcharts/highstock";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useLocation } from "react-router-dom";

import "./Charts.css";
const useStyles = makeStyles({
  root: {
    // display: "flex",
    minHeight: 250,
    // minWidth: 450,
    // maxHeight: 250,
  },
  details_card: {
    // display: "flex-right",
    minHeight: 250,
    // maxHeight: 250,
  },
  //   paper: {
  //     padding: 2,
  //     textAlign: "center",
  //     color: "white",
  //   },

  title: {
    fontSize: 24,
  },
  pos: {
    marginBottom: 12,
  },
  //   content: {
  //     flex: "1 0 auto",
  //   },
  cover: {
    marginTop: 20,
    marginLeft: "15%",
    float: "left",
    minHeight: 200,
    maxHeight: 200,
    minWidth: 200,
    borderRadius: "50%",
    display: "inline",
  },
  //   details: {
  //     // maxWidth: 200,
  //     display: "flex",
  //     flexDirection: "column",
  //   },
});
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function Charts(props) {
  const location = useLocation();
  const [collection_info, setInfo] = useState({
    name: null,
    floor_price: null,
    day_change: null,
    week_change: null,
    total_avail: null,
    float: null,
    link: null,
  });
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [chart_data, setChartData] = useState();
  const [eth_price, setEth] = useState();
  const [image, setImage] = useState();
  const [chart_options, setChartOptions] = useState({
    title: {
      text: "My chart",
    },
    xAxis: {
      categories: null,
    },
    series: [
      {
        data: null,
      },
    ],
  });
  const [fpp_chart_options, setChartOptionsFpp] = useState({
    title: {
      text: "My chart",
    },
    xAxis: {
      categories: null,
    },
    series: [
      {
        data: null,
      },
    ],
  });
  const [error, setError] = useState();

  const loadAsyncData = async () => {
    setLoading(true);
    setError(null);
    try {
      var chart_data_arr = Array();
      var total_for_sale = Array();
      var floor_pp = Array();
      var dates = Array();
      const url = "https://niftyprice.herokuapp.com/charts?";
      console.log("THIS IS COLLECTION NAME" + location.state.row_data);
      // console.log("sending" + this.props.location.chartData)
      const response = await fetch(
        url +
          new URLSearchParams({
            collection: location.state.row_data[0],
          })
      );

      var data = await response.json();
      console.log("recieved");
      // console.log(data.message)
      setEth(data.eth);
      setImage(data.image);

      if (location.state.row_data.length == 9) {
        if (location.state.row_data[1] == "Curated") {
          var type = "art-blocks";
        } else if (location.state.row_data[1] == "Playground") {
          var type = "art-blocks-playground";
        } else {
          var type = "art-blocks-factory";
        }
        var plural = (plural =
          location.state.row_data[0].slice(-1) == "s"
            ? location.state.row_data[0]
            : location.state.row_data[0] + "s");
        setInfo({
          name: location.state.row_data[0],
          floor_price: location.state.row_data[2],
          day_change: location.state.row_data[3],
          week_change: location.state.row_data[4],
          total_avail: location.state.row_data[5],
          float: location.state.row_data[6],
          link:
            "https://opensea.io/assets/" +
            type +
            "?ref=0x5e4c7b1f6ceb2a71efbe772296ab8ab9f4e8582c&search[stringTraits][0][name]=" +
            location.state.row_data[0] +
            "&search[stringTraits][0][values][0]=All%20" +
            plural +
            "&search[toggles][0]=BUY_NOW&search[sortAscending]=true&search[sortBy]=PRICE",
        });
      } else {
        setInfo({
          name: location.state.row_data[0],
          floor_price: location.state.row_data[1],
          day_change: location.state.row_data[2],
          week_change: location.state.row_data[3],
          total_avail: location.state.row_data[4],
          float: location.state.row_data[5],
          link:
            "https://opensea.io/collection/" +
            location.state.row_data[0] +
            "?ref=0x5e4c7b1f6ceb2a71efbe772296ab8ab9f4e8582c&collectionSlug=" +
            location.state.row_data[0] +
            "&search[sortAscending]=true&search[sortBy]=PRICE&search[toggles][0]=BUY_NOW",
        });
      }
      var series_fpp = Array();
      var series_tfs = Array();
      for (let i in data.message) {
        total_for_sale.push(parseFloat(data.message[i].totalforsale));
        floor_pp.push(parseFloat(data.message[i].floorpurchaseprice));
        let element_fpp = Array();
        let element_tfs = Array();
        // chart_data_arr.push(data.message[i]);
        let raw_date = data.message[i].date;
        let temp_date = raw_date.replaceAll("-", "/").split(" ");
        let time = temp_date[1].split(":");
        let formatted_date = temp_date[0] + " " + time[0] + ":" + time[1];

        // console.log(formatted_date);
        element_fpp.push(new Date(formatted_date).getTime());
        element_fpp.push(parseFloat(data.message[i].floorpurchaseprice));
        element_tfs.push(new Date(formatted_date).getTime());
        element_tfs.push(parseFloat(data.message[i].totalforsale));
        series_fpp.push(element_fpp);
        series_tfs.push(element_tfs);
      }
      // console.log(series_fpp)
      setChartOptions({
        title: {
          text: "Supply History",
        },
        series: [
          {
            data: series_tfs,
          },
        ],
      });
      setChartOptionsFpp({
        title: {
          text: " Floor  Price History",
        },
        series: [
          {
            data: series_fpp,
          },
        ],
      });
      setLoading(false);
      // console.log(tableToChart);
      // console.log("!2" + chart_data);
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  };
  useEffect(() => {
    loadAsyncData();
  }, []);
  if (loading)
    return (
      <div class="loading">
        <CircularProgress />
      </div>
    );
  return (
    <>
      <div class="chart-div">
        <div class="content-div">
          <Grid container >
            <Grid item xs={12}>
              <div class="card-div">
                <Grid container  spacing={4}>
                  <Grid item xs={12} lg={6}>
                    <Card id="prices" className={classes.root} elevation={5}>
                      <Grid container>
                        <Grid item xs={12} lg={6}>
                          <div className={classes.details}>
                            <CardContent className={classes.content}>
                              <Grid container>
                                <Grid item xs={12} lg={12}>
                                  <Typography
                                    variant="h5"
                                    component="h5"
                                    align="left"
                                  >
                                    {location.state.row_data[0][0].toUpperCase() +
                                      location.state.row_data[0].substring(1)}
                                  </Typography>
                                  <Typography
                                    variant="h5"
                                    component="h5"
                                    align="left"
                                  >
                                    Floor Cap Rank #{location.state.row_rank}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} lg={12}>
                                  <div class="open-link-continer">
                                    <p class="link-title">OpenSea:</p>
                                    <a
                                      class="opensea-link2"
                                      href={collection_info.link}
                                    ></a>
                                  </div>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </div>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                          <CardMedia
                            image={image}
                            className={classes.cover}
                            title="NFT COLLECTION IMAGE"
                          />
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <Card
                      id="prices"
                      className={classes.details_card}
                      elevation={5}
                    >
                      <CardContent>
                        <Grid container justifyContent="space-between">
                          <Typography
                            inline
                            variant="h5"
                            component="h5"
                            align="left"
                          >
                            Current floor price (ETH):{" "}
                          </Typography>
                          <Typography
                            inline
                            variant="h5"
                            component="h5"
                            align="right"
                          >
                            {collection_info.floor_price}
                          </Typography>
                        </Grid>
                        <Grid container justifyContent="space-between">
                          <Typography
                            inline
                            variant="h5"
                            component="h5"
                            align="left"
                          >
                            24H %:{" "}
                          </Typography>
                          <Typography
                            inline
                            variant="h5"
                            component="h5"
                            align="right"
                            style={
                              parseFloat(collection_info.day_change) > 0
                                ? { color: "#26ad3f" }
                                : { color: "#e04343" }
                            }
                          >
                            {collection_info.day_change}%
                          </Typography>
                        </Grid>
                        <Grid container justifyContent="space-between">
                          <Typography
                            inline
                            variant="h5"
                            component="h5"
                            align="left"
                          >
                            Current floor cap (ETH):
                          </Typography>
                          <Typography
                            inline
                            variant="h5"
                            component="h5"
                            align="right"
                          >
                            {numberWithCommas(
                              (
                                collection_info.floor_price *
                                collection_info.total_avail
                              ).toFixed(2)
                            )}
                          </Typography>
                        </Grid>
                        <Grid container justifyContent="space-between">
                          <Typography
                            inline
                            variant="h5"
                            component="h5"
                            align="left"
                          >
                            Total Minted:{" "}
                          </Typography>
                          <Typography
                            inline
                            variant="h5"
                            component="h5"
                            align="right"
                          >
                            {numberWithCommas(
                              parseInt(collection_info.total_avail)
                            )}
                          </Typography>
                        </Grid>
                        <Grid container justifyContent="space-between">
                          <Typography
                            inline
                            variant="h5"
                            component="h5"
                            align="left"
                          >
                            24H supply %:{" "}
                          </Typography>
                          <Typography
                            variant="h5"
                            component="h5"
                            align="right"
                            style={
                              parseFloat(collection_info.week_change) > 0
                                ? { color: "#26ad3f" }
                                : { color: "#e04343" }
                            }
                          >
                            {collection_info.week_change}%
                          </Typography>
                        </Grid>
                        <Grid container justifyContent="space-between">
                          <Typography
                            inline
                            variant="h5"
                            component="h5"
                            align="left"
                          >
                            Current Float %:{" "}
                          </Typography>
                          <Typography variant="h5" component="h5" align="left">
                            {collection_info.float}%
                          </Typography>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </div>
            </Grid>

            <Grid item xs={12}>
              <p> </p>
            </Grid>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={12}>
                  <HighchartsReact
                    class="chart"
                    containerProps={{ style: { width: "100%" } }}
                    highcharts={HighStock}
                    constructorType={"stockChart"}
                    options={fpp_chart_options}
                  />
                </Grid>
                <Grid item lg={12}>
                  <hr></hr>
                </Grid>
                <Grid item xs={12}>
                  <HighchartsReact
                    class="chart"
                    containerProps={{ style: { width: "100%" } }}
                    highcharts={HighStock}
                    constructorType={"stockChart"}
                    options={chart_options}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
}
export default Charts;
