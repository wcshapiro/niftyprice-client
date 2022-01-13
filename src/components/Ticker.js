import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { Renderer } from "highcharts";
import LinearProgress from "@material-ui/core/LinearProgress";
import eth_image from "../static/images/eth.png";
import gas_image from "../static/images/gas.png";
import btc_image from "../static/images/bitcoin.png";

import "./Ticker.css";
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function Ticker() {
  const [prices, setPrices] = useState();
  const [refresh, setRefresh] = useState(0);
  const loadAsyncData = async () => {
    const url = "https://niftyprice.herokuapp.com/stream"; //"http://localhost:8080/stream"; //
    const response = await fetch(url).then(res=>res.json()).then(data=>{
      if (data) {

        setPrices(data.message);
      }
    }).catch((e)=>console.log("error",e));
    
  };
  useEffect(() => {
    loadAsyncData();
  }, [refresh]);
  useEffect(() => {
    let refresh_interval = setTimeout(() => {
      let curr_refresh = refresh;
      setRefresh(curr_refresh + 1);
    }, 25000);
  }, [refresh]);
  if (prices) {
    return (
      <>
        <div class="ticker-container">
          <Grid container justifyContent="space-evenly" spacing={4}>
            {prices.BTC.data ? (
              <Grid item xs={4}>
                <img class="icon-image" src={btc_image}></img>
                {prices.BTC.name}: ${numberWithCommas(prices.BTC.data)} <a style={(prices.BTC.change>0)? {
                                          color: "#065f46",
                                          borderRadius: 12,
                                          width:"80px",
                                          textAlign: "center",
                                          display:"inline-block"
                                        }
                                      : {
                                          color: "#981b1b",
                                          borderRadius: 12,
                                          textAlign: "center",
                                          width:"80px",
                                          display:"inline-block"
                                        }}>{prices.BTC.change>0?"+":"-"}{numberWithCommas(Math.abs(prices.BTC.change).toFixed(2))}%</a>
              </Grid>
            ) : (
              <></>
            )}
            {prices.GWEI.data ? (
              <Grid item xs={4}>
                <img class="icon-image" src={gas_image}></img>GAS:{" "}
                {prices.GWEI.data} {prices.GWEI.name} 
              </Grid>
            ) : (
              <></>
            )}
            {prices.ETH.data ? (
              <Grid item xs={4}>
                <img class="icon-image" src={eth_image}></img>
                {prices.ETH.name}: ${numberWithCommas(prices.ETH.data)} <a style={(prices.ETH.change>0)? {
                                          color: "#065f46",
                                          borderRadius: 12,
                                          width:"80px",
                                          textAlign: "center",
                                          display:"inline-block"
                                        }
                                      : {
                                          color: "#981b1b",
                                          borderRadius: 12,
                                          textAlign: "center",
                                          width:"80px",
                                          display:"inline-block"
                                        }}>{prices.ETH.change>0?"+":"-"}{numberWithCommas(Math.abs(prices.ETH.change).toFixed(2))}%</a>
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
        </div>
      </>
    );
  } else {
    return (
      <>
        <LinearProgress />
      </>
    );
  }
}
export default Ticker;
