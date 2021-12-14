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
import { Helmet } from "react-helmet";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import "./Charts.css";

const useStyles = makeStyles({
  root: {
    minHeight: 270,
  },
  details_card: {
    minHeight: 270,
  },
  title: {
    fontSize: 24,
  },
  pos: {
    marginBottom: 12,
  },
  cover: {
    marginTop: 20,
    marginLeft: "15%",
    float: "left",
    minHeight: 130,
    maxHeight: 130,
    minWidth: 130,
    borderRadius: "50%",
    display: "inline",
    marginBottom: 20,
  },
});
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function rsq(data,slope,intercept){
  let mean = null;
  let mean_price = null;
  let sum_y = null;
  let sum_x = null;
  for (let i = 0; i < data.length-1; i++) {
    let y = Number(data[i][1]);
    let x = Number(data[i][0]);
    sum_y += y
    sum_x += x
  }
  mean = sum_y/(data.length-1)
  mean_price = sum_x/(data.length-1)
  let difference_actual = null;
  let difference_estimated = null;
  for (let i = 0; i < data.length-1; i++) {
    let y_actual = Number(data[i][1]);
    let y_estimated = (Number(data[i][0])*slope + intercept);
    difference_actual += (y_actual - mean )**2
    difference_estimated += (y_estimated - mean )**2
  }
  let r_squared = difference_estimated/difference_actual
  return [r_squared,mean]


}
function get_variance(data) {
  var array = [];
  for (let i = 0; i < data.length-1; i++) {
array.push(data[i][1] )
  }
  const n = array.length
  const mean = array.reduce((a, b) => a + b) / n
  return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}
// function get_variance(data,mean){
//   let variance = null;
//   var diffs = [];
//   let diffs_sum = null;
//   for (let i = 0; i < data.length-1; i++) {
//     let x = data[i][0] 
//     console.log(x)
//     let diff = x - mean
//     let diff_sq = diff ** 2
//     diffs_sum += diff_sq
//     diffs.push(diff_sq) 
//     let diff_mean = diffs_sum/diffs.length
//     console.log("mean",diff_mean)
//     variance = Math.sqrt(diff_mean)
//   }
//   return variance
// }
function regression(data) {
  // console.log(data);
  let sum_x = 0;
  let sum_y = 0;
  let sum_x_sq = 0;
  let sum_xy = 0;
  let max_x = 0;
  let min_x = 99999999;
  for (let i = 0; i < data.length-1; i++) {
    if (data[i][0] < min_x) {
      min_x = data[i][0];
    }
    if (data[i][0] > max_x) {
      max_x = data[i][0];
    }
    let x = Number(data[i][0]);
    let y = Number(data[i][1]);
    let x_sq = x * x;
    let xy = x * y;
    sum_x += x;
    sum_y += y;
    sum_x_sq += x_sq;
    sum_xy += xy;
  }
  let slope =
    (data.length * sum_xy - sum_x * sum_y) /
    (data.length * sum_x_sq - sum_x * sum_x);
  let intercept = (sum_y - slope * sum_x) / data.length;
  let y_start_coord = slope * min_x + intercept;
  let y_end_coord = slope * max_x + intercept;
  let r_squared = rsq(data,slope,intercept)
  // console.log("RSQ",r_squared)
  return [
    [min_x, y_start_coord],
    [max_x, y_end_coord],
    [r_squared]
  ];
}

function combine_data(X, Y) {
  var full_combo = {};
  for (let i = 0; i < X.length; i++) {
    let date = new Date(X[i][0]).setMinutes(0, 0, 0);
    if (full_combo[date]) {
      full_combo[date][0] = X[i][1];
    } else {
      full_combo[date] = [X[i][1], null];
    }
  }
  for (let i = 0; i < Y.length; i++) {
    let date = new Date(Y[i][0]).setMinutes(0, 0, 0);
    if (full_combo[date]) {
      full_combo[date][1] = Y[i][1];
    } else {
      full_combo[date] = [null, Y[i][1]];
    }
  }
  // console.log("REMOVING",full_combo)
  for (const element in full_combo) {
    let coords = full_combo[element]
    if (!(coords[1] && coords[0])) {
      delete full_combo[element]
      // console.log("removed" + full_combo[i]);
      
    }
  }
  // console.log("REMOVED")
  // console.log(full_combo)
  return Object.values(full_combo);
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
  const [stats, setStats] = useState(null);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState();
  const [alias, setAlias] = useState();
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
  const [owners_chart_options, setOwnersChartOptions] = useState();
  const [volume_chart_options, setVolumeChartOptions] = useState();
  const [r_sq_val,setRSQ] = useState();
  const [reg_chart_options, setRegChartOptions] = useState();
  const [fpp_chart_options, setChartOptionsFpp] = useState();
  const get_stats = async (ab_alias) => {
    var collection_path = ab_alias || location.pathname.replace(
      "/collections/",
      "collections/:"
    );
// console.log("PATH",collection_path)
    var collection_name = ab_alias || collection_path.split("/")[1].replace(":", "");
    // console.log("SENDING",collection_name)
    var url =
      "https://api.opensea.io/api/v1/collection/" + collection_name + "/stats";
    var headers = {
      Accept: "application/json",
      "X-API-KEY": "c38932a3b50647cbb30d2f5601e81850",
    };
    const resp = await fetch(url, { headers });
    // console.log("COLLECTION STATS");
    var data = await resp.json();
    // console.log(data);
    if (data.stats!= undefined){
      setStats({
        "1d Volume": numberWithCommas(data.stats.one_day_volume.toFixed(2)),
        "1d Volume Change %": data.stats.one_day_change.toFixed(2),
        "7d Volume": numberWithCommas(data.stats.seven_day_volume.toFixed(2)),
        "7d Volume Change %": data.stats.seven_day_change.toFixed(2),
        "30d Volume": numberWithCommas(data.stats.thirty_day_volume.toFixed(2)),
        "30d Volume Change %": data.stats.thirty_day_change.toFixed(2),
        "1d Sales": numberWithCommas(data.stats.one_day_sales),
        "# Owners": numberWithCommas(data.stats.num_owners),
      });
    }
    
  };
  // useEffect(() => {
  //   get_stats();
  // }, []);
  const loadAsyncData = async () => {
    // console.log("PROPS" + JSON.stringify(location.pathname));
    setLoading(true);
    try {
      var total_for_sale = [];
      var floor_pp = [];
      let collection_path = location.pathname.replace(
        "/collections/",
        "collections/:"
      );
      let collection_name = collection_path.split("/")[1].replace(":", "");
      // console.log("NAME" + collection_name);
      // console.log("PATH" + collection_path);
      const url = "https://niftyprice.herokuapp.com/"+collection_path;//"http://localhost:8080/" + collection_path; //"https://niftyprice.herokuapp.com/"+collection_path; //
      const response = await fetch(
        url
        // +
        //   new URLSearchParams({
        //     collection: "cryptopunks"//location.state.row_data[0],
        //   })
      );
      var data = await response.json();
      // console.log("DATA");
      // console.log("DATA",data.ab_alias);
      // console.log(collection_name,data.ab_alias[collection_name])

      setImage(data.image);
      // console.log(data.table.collections);

      // console.log("INFO" + JSON.stringify(data.alias));
      setAlias(data.alias);
      var rank = data.rank;
      // console.log("RANKINGS" + rank);
      var plural = (plural =
        collection_name.slice(-1) === "s"
          ? collection_name
          : collection_name + "s");
      for (const element of data.table.collections) {
        if (element["Collection Name"] == collection_name) {
          get_stats(null);
          setInfo({
            rank: rank,
            name: element["Collection Name"],
            floor_price: element["Floor Purchase Price"],
            day_change: element["24h%"],
            week_change: element["7d%"],
            supply_change: element["24h supply%"],
            total_avail: element["Total Float"],
            float: element["%Float"],
            link:
              "https://opensea.io/collection/" +
              collection_name +
              "?ref=0x5e4c7b1f6ceb2a71efbe772296ab8ab9f4e8582c?search[sortAscending]=true&search[sortBy]=PRICE&search[toggles][0]=BUY_NOW",
          });
        } else {
          // console.log("no match");
        }
      }
      for (const element of data.table.art_blocks) {
        if (element["Collection Name"] == collection_name) {
          var type = element["Category"];
          // console.log("matched");
          get_stats(data.ab_alias[collection_name] || null)
          setInfo({
            name: element["Collection Name"],
            type: type,
            rank: rank,
            floor_price: element["Floor Purchase Price"],
            day_change: element["24h%"],
            week_change: element["7d%"],
            supply_change: element["24h supply%"],
            total_avail: element["Total Float"],
            float: element["%Float"],
            link:
              "https://opensea.io/assets/" +
              type +
              "?ref=0x5e4c7b1f6ceb2a71efbe772296ab8ab9f4e8582c&search[stringTraits][0][name]=" +
              element["Collection Name"] +
              "&search[stringTraits][0][values][0]=All%20" +
              plural +
              "&search[toggles][0]=BUY_NOW&search[sortAscending]=true&search[sortBy]=PRICE",
          });
          // https://opensea.io/collection/0x5f3e321623d141681as1a?search[sortAscending]=true&search[sortBy]=PRICE&search[toggles][0]=BUY_NOW
        } else {
          // console.log("no match");
        }
      }
      // console.log(data.table.collections);

      var series_fpp = [];
      var series_tfs = [];
      var series_owners = [];
      var series_volume = [];
      for (let i in data.message) {
        total_for_sale.push(parseFloat(data.message[i].totalforsale));
        floor_pp.push(parseFloat(data.message[i].floorpurchaseprice));
        let element_fpp = [];
        let element_tfs = [];
        let element_owners = [];
        let element_volume = [];

        let raw_date = data.message[i].date;
        let temp_date = raw_date.replaceAll("-", "/").split(" ");
        let time = temp_date[1].split(":");
        let formatted_date = temp_date[0] + " " + time[0] + ":" + time[1];

        element_fpp.push(new Date(formatted_date).getTime());
        element_fpp.push(parseFloat(data.message[i].floorpurchaseprice));
        if (data.message[i].volume != null && data.message[i].owners != null) {
          element_owners.push(new Date(formatted_date).getTime());
          element_owners.push(parseInt(data.message[i].owners));
          element_volume.push(new Date(formatted_date).getTime());
          element_volume.push(parseInt(data.message[i].volume));
        }

        if (data.message[i].totalforsale != null) {
          element_tfs.push(new Date(formatted_date).getTime());
          element_tfs.push(parseFloat(data.message[i].totalforsale));
          series_tfs.push(element_tfs);
        }
        series_fpp.push(element_fpp);
        if(element_owners.length>1){series_owners.push(element_owners);}
        
        if(element_volume.length>1){series_volume.push(element_volume);}
        
      }
      var reg_dataset = combine_data( series_tfs,series_fpp);
      var regression_data = regression(reg_dataset);
      var regression_line = [regression_data[0],regression_data[1]]
      var r_squared = regression_data[2][0][0]
      
      var mean = regression_data[2][0][1]
      var variance = get_variance(reg_dataset)
      // console.log(variance,mean)
      setRSQ({"rsq":r_squared,"slope":regression_data[0],"intercept":regression_data[1],"mean":mean,"variance":variance})
      // console.log("pushing data");
      if (series_volume.length>1) {
        setVolumeChartOptions({
          title: {
            text: "Volume History",
          },
          series: [
            {
              name: " Volume",
              data: series_volume,
            },
          ],
        });
      }
      if (series_owners.length>1) {
        setOwnersChartOptions({
          title: {
            text: "Owner History",
          },
          series: [
            {
              name: "# Owners",
              data: series_owners,
            },
          ],
        });
      }

      setChartOptions({
        title: {
          text: "Supply History",
        },
        series: [
          {
            name: " Supply",
            data: series_tfs,
          },
        ],
      });
      setChartOptionsFpp({
        title: {
          text: "Floor  Price History",
        },
        yAxis: [{
          labels: {
              align: 'left'
          },
          height: '80%',
          resize: {
              enabled: true
          }
      }, {
          labels: {
              align: 'left'
          },
          top: '80%',
          height: '20%',
          offset: 0
      }],
        series: [
          {
            name: "Floor Price (ETH)",
            data: series_fpp,
          },
          {
            type: 'column',
            name: 'Volume',
            // id: 'volume',
            data: series_volume,
            yAxis: 1,
            dataGrouping: {
              approximation: "average"
            }
        }
        ],
      });
      if (reg_dataset) {
        setRegChartOptions({
          chart: {
            type: "scatter",
          },
          title: {
            text: "Linear Regression Floor Price vs. Supply",
          },
          yAxis: {
            reversed: false,
          },
          plotOptions: {
            scatter: {
              marker: {
                radius: 2,
                states: {
                  hover: {
                    enabled: true,
                    lineColor: "rgb(100,100,100)",
                  },
                },
              },
              states: {
                hover: {
                  marker: {
                    enabled: false,
                  },
                },
              },
              tooltip: {
                headerFormat: "<b>{series.name}</b><br>",
                pointFormat: "{point.x} , {point.y} ",
              },
            },
          },
          series: [
            {
              type: "line",

              name: "Regression line",
              data: regression_line,
            },
            {
              type: "scatter",
              name: "Ratio of floor price to supply",
              data: reg_dataset,
            },
          ],
        });
      }
    } catch (e) {
      console.log("ERROR: " + e);
      setLoading(false);
    }
    setLoading(false);
  };
  useEffect(() => {
    loadAsyncData();
  }, []);
  if (loading || alias == null) {
    return (
      <div class="loading">
        <CircularProgress />
      </div>
    );
  } else {
    var name = alias[collection_info.name]
      ? alias[collection_info.name]
      : collection_info.name;
    var description =
      "View real-time NFT floor prices and charts for " +
      name +
      " Track your portfolio profit and loss, set price alerts, and track other market metrics.";
    return (
      <>
        <Helmet htmlAttributes>
          <html lang="en" />
          <title>
            {alias[collection_info.name]
              ? alias[collection_info.name]
              : collection_info.name}{" "}
            live floor price tracking and charts
          </title>
          <meta name="description" content={description} />
        </Helmet>
        <div class="chart-div">
          <div class="content-div">
            <Grid container>
              <Grid item xs={12}>
                <div class="card-div">
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={6} lg={stats ? 4 : 6}>
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
                                      {alias[collection_info.name]
                                        ? alias[collection_info.name]
                                        : collection_info.name}
                                    </Typography>
                                    <Typography
                                      variant="h5"
                                      component="h5"
                                      align="left"
                                    >
                                      Floor Cap Rank {collection_info.rank}
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
                    <Grid item lg={stats ? 4 : 6} md={6} xs={12}>
                      <Card
                        id="prices"
                        className={classes.details_card}
                        elevation={5}
                      >
                        <CardContent>
                          <Grid container justifyContent="space-between">
                            <Grid item xs={12}>
                              <Typography variant="h5" component="h5">
                                Quick Stats
                              </Typography>
                            </Grid>

                            <Typography
                              inline
                              variant="h6"
                              component="h6"
                              align="left"
                            >
                              floor price (ETH):{" "}
                            </Typography>
                            <Typography
                              inline
                              variant="h6"
                              component="h6"
                              align="right"
                            >
                              {collection_info.floor_price}
                            </Typography>
                          </Grid>
                          <Grid container justifyContent="space-between">
                            <Typography
                              inline
                              variant="h6"
                              component="h6"
                              align="left"
                            >
                              24H %:{" "}
                            </Typography>
                            <Typography
                              inline
                              variant="h6"
                              component="h6"
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
                              variant="h6"
                              component="h6"
                              align="left"
                            >
                              floor cap (ETH):
                            </Typography>
                            <Typography
                              inline
                              variant="h6"
                              component="h6"
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
                              variant="h6"
                              component="h6"
                              align="left"
                            >
                              Total Minted:{" "}
                            </Typography>
                            <Typography
                              inline
                              variant="h6"
                              component="h6"
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
                              variant="h6"
                              component="h6"
                              align="left"
                            >
                              24H supply %:{" "}
                            </Typography>
                            <Typography
                              variant="h6"
                              component="h6"
                              align="right"
                              style={
                                collection_info.supply_change
                                  ? parseFloat(collection_info.supply_change) >
                                    0
                                    ? { color: "#e04343" }
                                    : { color: "#26ad3f" }
                                  : { color: "#000000" }
                              }
                            >
                              {collection_info.supply_change
                                ? collection_info.supply_change + "%"
                                : "---"}
                            </Typography>
                          </Grid>
                          <Grid container justifyContent="space-between">
                            <Typography
                              inline
                              variant="h6"
                              component="h6"
                              align="left"
                            >
                              Float %:{" "}
                            </Typography>
                            <Typography
                              variant="h6"
                              component="h6"
                              align="left"
                            >
                              {collection_info.float}%
                            </Typography>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                    {stats ? (
                      <Grid item xs={12} md={12} lg={4}>
                        <Card
                          id="prices"
                          className={classes.root}
                          elevation={5}
                        >
                          <CardContent>
                            {Object.keys(stats).map(function (object, i) {
                              return (
                                <>
                                  <Grid
                                    container
                                    justifyContent="space-between"
                                  >
                                    <Typography
                                      inline
                                      variant="h6"
                                      component="h6"
                                      align="left"
                                    >
                                      {object}
                                    </Typography>
                                    <Typography
                                      variant="h6"
                                      component="h6"
                                      align="left"
                                      style={
                                        object.includes("%")
                                          ? parseFloat(stats[object]) >
                                            0
                                            ? { color: "#26ad3f" }
                                            : { color: "#e04343" }
                                          : { color: "#000000" }
                                      }
                                    >
                                      {stats[object]}
                                    </Typography>
                                  </Grid>
                                </>
                              );
                            })}
                          </CardContent>
                        </Card>
                      </Grid>
                    ) : (
                      ""
                    )}
                  </Grid>
                </div>
              </Grid>
              

              <Grid item xs={12}>
                <p> </p>
              </Grid>
              <Grid item xs={12}>
                  <Tabs>
                    <TabList>
                      <Tab>Historical Charts</Tab>
                      <Tab>Data Analysis</Tab>
                    </TabList>
                    <TabPanel>
                      <Grid container justifyContent="space-evenly" spacing={5}>
                      <Grid item xs={12} lg={6}>
                        <HighchartsReact
                          class="chart"
                          containerProps={{ style: { width: "100%" } }}
                          highcharts={HighStock}
                          constructorType={"stockChart"}
                          options={fpp_chart_options}
                        />
                      </Grid>

                      <Grid item xs={12} lg={6}>
                        <HighchartsReact
                          class="chart"
                          containerProps={{ style: { width: "100%" } }}
                          highcharts={HighStock}
                          constructorType={"stockChart"}
                          options={chart_options}
                        />
                      </Grid>
                      {volume_chart_options?(
                        <Grid item xs={12} lg={6}>
                        <HighchartsReact
                          class="chart"
                          containerProps={{ style: { width: "100%" } }}
                          highcharts={HighStock}
                          constructorType={"stockChart"}
                          options={volume_chart_options}
                        />
                      </Grid>
                      ):(
                        <>
                        </>
                      )}
                      
                      {owners_chart_options?(
                      <Grid item xs={12} lg={6}>
                        <HighchartsReact
                          class="chart"
                          containerProps={{ style: { width: "100%" } }}
                          highcharts={HighStock}
                          constructorType={"stockChart"}
                          options={owners_chart_options}
                        />
                      </Grid>
                      ):(
                        <>
                        </>
                      )}
                      {/* <Grid item lg={6}>
                        <hr></hr>
                      </Grid> */}
                      </Grid>
                    </TabPanel>
                    <TabPanel>
                      <Grid container justifyContent="space-evenly">
                      <Grid item xs={8}>
                        <HighchartsReact
                          class="chart"
                          containerProps={{ style: { width: "100%" } }}
                          options={reg_chart_options}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <Card id="prices" className={classes.root} elevation={5}>
                          <CardContent>
                            <Grid container justifyContent="space-evenly">
                            <Grid item xs={6}>
                                <Typography align="left">
                                  R^2
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography align="right">
                                  {parseFloat(r_sq_val.rsq).toFixed(2)}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography align="left">
                              Slope
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography align="right">
                                  {parseFloat(r_sq_val.slope).toFixed(2)}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography align="left">
                                  Intercept
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography align="right">
                                  {parseFloat(r_sq_val.intercept).toFixed(2)}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography align="left">
                                  Mean
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography align="right">
                                  {parseFloat(r_sq_val.mean).toFixed(2)}
                                </Typography>
                              </Grid>
                              {/* <Grid item xs={8}>
                                <Typography align="left">
                                  Std Dev from Mean
                                </Typography>
                              </Grid>
                              <Grid item xs={4}>
                                <Typography align="right">
                                  {parseFloat(r_sq_val.variance).toFixed(2)}
                                </Typography>
                              </Grid> */}
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                        </Grid>
                      
                      {/* <Grid item xs={12}>
                        <HighchartsReact
                          class="chart"
                          containerProps={{ style: { width: "100%" } }}
                          options={reg_chart_options}
                        />
                      </Grid> */}
                    </TabPanel>
                  </Tabs>
                
              </Grid>
            </Grid>

            {/* </Grid> */}
          </div>
        </div>
      </>
    );
  }
}
export default Charts;
