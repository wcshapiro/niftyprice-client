import React, { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import HighStock from "highcharts/highstock";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./Indexes.css";
import {index_metadata} from "./index_config.js"
import { useLocation } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    minHeight: 270,
  },
  details_card: {
    minHeight: 270,
  },
  title: {
    fontSize: 24,
    paddingTop: 20,
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
  return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "---";
}
function Indexes() {
  
  const location = useLocation();
  const [indexMap, setIndexMap] = useState(null);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [index_options, setIndexOptions] = useState({
    title: {
      text: "Index Price History",
    },
    series: [
      {
        data: null,
      },
    ],
  });


  const loadAsyncData = async () => {
    setLoading(true);
    try {
      let index_path = location.pathname.replace("/indexes/", "indexes/:");
      let index_name = index_path.split("/")[1].replace(":", "").replace("-","_");
      // console.log("NAME  :" + index_path);
      const url =  "http://localhost:8080/" + index_path; //"https://niftyprice.herokuapp.com/" + index_path; //
      // console.log("SENDING TO INDEXES");
      const response = await fetch(url);
      // console.log("RESPONSE");
      // console.log(response);
      var data = await response.json();
      // console.log("INDEX" + JSON.stringify(data.message.index_stats));
      var series_index = [];
      for (const key in data.message.index) {
        var chart_datapoint = null;
        // console.log("KEY" + key + "VALUE" + data.message.index[key]);

        if (data.message.index[key] != null) {
          if (index_name == "blue_chip") {
            chart_datapoint = parseFloat(data.message.index[key]) / 1000000;
          } else {
            chart_datapoint = parseFloat(data.message.index[key]);
          }
          series_index.push([
            new Date(parseInt(key)).getTime(),
            chart_datapoint,
          ]);
        }

        // console.log([new Date(day[0]).getTime(),parseInt(data.message[i][1])/1000])
      }
      setIndexOptions({
        title: {
          text: "Index Price History",
        },
        series: [
          {
            name: " ETH",
            data: series_index.sort(),
          },
        ],
      });
      setIndexMap({
        metadata: index_metadata[index_name],
        quote: data.message.index_stats.quote/index_metadata[index_name].divisor,
        change: data.message.index_stats.change/index_metadata[index_name].divisor,
        percent: data.message.index_stats.percent,
      });
      // console.log("INDEXMAP: " + indexMap);
      // console.log("TIHS IS SERIES INDEX:" + series_index);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      // console.log("THERE WAS AN ERROR: " + e);
    }
  };
  useEffect(() => {
    loadAsyncData();
  }, []);
  if (loading || indexMap == null)
    return (
      <div class="loading">
        <CircularProgress />
      </div>
    );
  return (
    <>
      <div class="chart-div">
        <div class="content-div">
          <Grid container justifyContent="space-evenly">
            <Grid item xs={12}>
              <div class="card-div">
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Typography variant="h6" align="left">
                      NFT Indexes - historical price stats and charts
                    </Typography>
                    <hr></hr>
                  </Grid>
                  <Grid item xs={12} md={4} lg={4}>
                    <Card id="prices" className={classes.root} elevation={5}>
                      <Grid container>
                        <Grid item xs={12} lg={12} className={classes.title}>
                          <Typography
                            variant="h6"
                            component="h6"
                            align="center"
                          >
                            {indexMap.metadata.title}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} lg={6}>
                          <CardContent className={classes.content}>
                            <Grid container>
                              <Grid item xs={12} lg={12}>
                                {indexMap.metadata.description && 
                                  <p class="description-font">
                                    {indexMap.metadata.description}
                                  </p>
                                }
                                {indexMap.metadata.image && 
                                <CardMedia
                                image={indexMap.metadata.image}
                                className={classes.cover}
                                title="NFT COLLECTION IMAGE"
                              />
                                }
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Grid>
                        <Grid item xs={6} lg={6}>
                          <CardContent className={classes.content}>
                            <Grid container>
                              <Grid item xs={12} lg={12}>
                                <Typography align="right">
                                  Current quote (24h)
                                </Typography>
                                <Typography
                                  variant="h6"
                                  align="right"
                                  style={{ color: "blue" }}
                                >
                                  {numberWithCommas(indexMap.quote.toFixed(2)) +
                                    " " +
                                    indexMap.metadata.suffix}
                                </Typography>
                                <Typography align="right">
                                  {numberWithCommas(
                                    indexMap.change.toFixed(2)
                                  ) +
                                    " " +
                                    indexMap.metadata.suffix}
                                </Typography>
                                <Typography
                                  align="right"
                                  style={
                                    parseFloat(indexMap.percent) > 0
                                      ? {
                                          color: "#065f46",
                                          backgroundColor: "#D1FAE5",
                                          borderRadius: 12,
                                          textAlign: "center",
                                          float: "right",
                                          maxWidth: 80,
                                          minWidth: 80,
                                        }
                                      : {
                                          color: "#981b1b",
                                          backgroundColor: "#FEE2E2",
                                          borderRadius: 12,
                                          textAlign: "center",
                                          float: "right",
                                          maxWidth: 80,
                                          minWidth: 80,
                                        }
                                  }
                                >
                                  {indexMap.percent.toFixed(2)}%
                                </Typography>
                              </Grid>
                              <Grid item xs={12} lg={12}></Grid>
                            </Grid>
                          </CardContent>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6} lg={8}>
                    <Grid container>
                      <Grid item xs={12}>
                        <HighchartsReact
                          class="chart"
                          containerProps={{ style: { width: "100%" } }}
                          highcharts={HighStock}
                          constructorType={"stockChart"}
                          options={index_options}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
}
export default Indexes;
