import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { Renderer } from "highcharts";
import LinearProgress from '@material-ui/core/LinearProgress';

import "./Ticker.css"
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
function Ticker() {
  const [prices, setPrices] = useState();
  const [refresh, setRefresh] = useState(0);
  const loadAsyncData = async () => {
    const url = "https://niftyprice.herokuapp.com/stream";
    const response = await fetch(url);
    var data = await response.json();
    // console.log("DATA", data.message);
    setPrices(data.message);
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
if(prices){
    return (
        <>
        
        <div class = "ticker-container">
            <div class = "ticker">
          <Grid container justifyContent="space-evenly" spacing={4}>
            
                <Grid item xs={4}>
                {prices.BTC.name}: ${numberWithCommas(prices.BTC.data)}
              </Grid>
              <Grid item xs={4}>
              GAS: {prices.GWEI.data} {prices.GWEI.name}
              </Grid>
              <Grid item xs={4}>
                {prices.ETH.name}: ${numberWithCommas(prices.ETH.data)}
              </Grid>
    
            
            
          </Grid>
          </div>
          </div>
          
        </>
      );
}
else{return(<><LinearProgress/></>)}
  
}
export default Ticker;
