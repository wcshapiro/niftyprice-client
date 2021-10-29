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
    minHeight: 200,
    maxHeight: 200,
    minWidth: 200,
    borderRadius: "50%",
    display: "inline",
    marginBottom: 20,
  },
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
  const [image, setImage] = useState();
  const [alias,setAlias]=useState()
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

  const loadAsyncData = async () => {
    console.log("PROPS"+JSON.stringify(location.pathname))
    setLoading(true);
    try {
      var total_for_sale = [];
      var floor_pp = [];
      let collection_path = location.pathname.replace("/collections/","collections/:")
      let collection_name = collection_path.split("/")[1].replace(":","")
      console.log(("NAME"+collection_name))
      console.log("PATH"+collection_path)
      const url = "http://localhost:8080/"+collection_path; //"https://niftyprice.herokuapp.com/charts?";
      const response = await fetch(url
        // +
        //   new URLSearchParams({
        //     collection: "cryptopunks"//location.state.row_data[0],
        //   })
      );
      var data = await response.json();
      setImage(data.image);
      console.log(data.table.collections)
      console.log(data.message)
      console.log("INFO"+JSON.stringify(data.alias))
      setAlias(data.alias);
      var rank = data.rank
      console.log("RANKINGS"+rank)
      var plural = (plural =
        collection_name.slice(-1) === "s"
          ? collection_name
          : collection_name + "s");
      for(const element of data.table.collections){
        if (element['Collection Name'] ==  collection_name){
          console.log("matched")
          setInfo({
            rank:rank,
            name: element['Collection Name'],
            floor_price: element['Floor Purchase Price'],
            day_change: element['24h%'],
            week_change: element['7d%'],
            supply_change:element['24h supply%'],
            total_avail: element['Total Float'],
            float: element['%Float'],
            link: "https://opensea.io/collection/"+collection_name+"?ref=0x5e4c7b1f6ceb2a71efbe772296ab8ab9f4e8582c?search[sortAscending]=true&search[sortBy]=PRICE&search[toggles][0]=BUY_NOW"
          });

        }
        else {
          console.log("no match")
        }
      }
      for(const element of data.table.art_blocks){
        
        if (element['Collection Name'] ==  collection_name){
          

          var type = element['Category']
          console.log("matched")
          setInfo({
            name: element['Collection Name'],
            type: type,
            rank:rank,
            floor_price: element['Floor Purchase Price'],
            day_change: element['24h%'],
            week_change: element['7d%'],
            supply_change:element['24h supply%'],
            total_avail: element['Total Float'],
            float: element['%Float'],
            link:
              "https://opensea.io/assets/" +
              type +
              "?ref=0x5e4c7b1f6ceb2a71efbe772296ab8ab9f4e8582c&search[stringTraits][0][name]=" +
              element['Collection Name'] +
              "&search[stringTraits][0][values][0]=All%20" +
              plural +
              "&search[toggles][0]=BUY_NOW&search[sortAscending]=true&search[sortBy]=PRICE",
          });
          // https://opensea.io/collection/0x5f3e321623d141681as1a?search[sortAscending]=true&search[sortBy]=PRICE&search[toggles][0]=BUY_NOW
        }
        else {
          console.log("no match")
        }
      }
      console.log(data.table.collections)

      var series_fpp = [];
      var series_tfs = [];
      for (let i in data.message) {
        total_for_sale.push(parseFloat(data.message[i].totalforsale));
        floor_pp.push(parseFloat(data.message[i].floorpurchaseprice));
        let element_fpp = [];
        let element_tfs = [];
        let raw_date = data.message[i].date;
        let temp_date = raw_date.replaceAll("-", "/").split(" ");
        let time = temp_date[1].split(":");
        let formatted_date = temp_date[0] + " " + time[0] + ":" + time[1];

        element_fpp.push(new Date(formatted_date).getTime());
        element_fpp.push(parseFloat(data.message[i].floorpurchaseprice));
        element_tfs.push(new Date(formatted_date).getTime());
        element_tfs.push(parseFloat(data.message[i].totalforsale));
        series_fpp.push(element_fpp);
        series_tfs.push(element_tfs);
      }
      console.log("pushing data")
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
        series: [
          {
            name: "Floor Price (ETH)",
            data: series_fpp,
          },
        ],
      });
      setLoading(false);
    } catch (e) {
      console.log("ERROR: "+e)
      setLoading(false);
    }
  };
  useEffect(() => {
    loadAsyncData();
  }, []);
  if (loading || alias==null)
    {return (
      <div class="loading">
        <CircularProgress />
      </div>
    );}
    else{
      return (
        <>
          <div class="chart-div">
            <div class="content-div">
              <Grid container>
                <Grid item xs={12}>
                  <div class="card-div">
                    <Grid container spacing={4}>
                      <Grid item xs={12} md={6} lg={6}>
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
                      <Grid item lg={6} md={6} xs={12}>
                        <Card
                          id="prices"
                          className={classes.details_card}
                          elevation={5}
                        >
                          <CardContent>
                            <Grid container justifyContent="space-between">
                              <Grid xs={12}>
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
                                  parseFloat(collection_info.supply_change) > 0
                                    ? { color: "#e04343" }
                                    : { color: "#26ad3f" }
                                }
                              >
                                {collection_info.supply_change}%
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
                              <Typography variant="h6" component="h6" align="left">
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
  
}
export default Charts;
