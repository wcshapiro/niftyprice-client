import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import "./Table.css"
import "./App.css"
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import QualityCell from './Cellcolor.js'
import CellLink from './CellLink.js'
import Name from './Name.js'
import eth from "./static/images/eth300.png";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
} from "react-router-dom";
const useStyles = makeStyles({
    root: {
        flexgrow: 1,
        minHeight: 250,
        maxHeight: 360,
    },
    paper: {
        padding: 2,
        textAlign: 'center',
        color: "white"
    },

    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});
const columns = [
    {
        name: "Collection Name", 
        options : {customBodyRender: (value, tableMeta, updateValue) => {
            return (
                <Name   
                        rowData={tableMeta.rowData}
                        index={tableMeta.columnIndex}
                        change={event => updateValue(event)}
                    />
            )
        
        }}
        
    },
{ name: "Floor Price (ETH)", options: { hint: "Lowest Price an NFT in this collection is trading for" ,setCellProps: () => ({align: "center"})} },

{
    name: "24h%", options: {
        hint: "Percent change in floor price over the past 24h",
        customBodyRender: (value, tableMeta, updateValue) => {
            return (
                <QualityCell
                    value={value}
                    index={tableMeta.columnIndex}
                    change={event => updateValue(event)}
                />
            )

        },
        setCellProps: () => ({align: "right"})
    }
},
{
    name: "7d%", options: {
        hint: "Percent change in floor price over the past 7d",
        customBodyRender: (value, tableMeta, updateValue) => {
            return (
                <QualityCell
                    value={value}
                    index={tableMeta.columnIndex}
                    change={event => updateValue(event)}
                />
            )

        },
        setCellProps: () => ({align: "right"})
    }
},

{ name: "Total Minted", options: { hint: "Total number of NFT's in this collection that are available for immediate purchase" ,setCellProps: () => ({align: "center"}),customBodyRender: (value) => {
    return( <><p>{numberWithCommas(value)}</p></>)
}} },

{ name: "Float%", options: { hint: "Percent of total supply that is currently available" ,setCellProps: () => ({align: "center"}),customBodyRender: (value) => {
    return( <><p>{value}%</p></>)
},} },
{
    name: "Floor Cap (ETH)", options: {
        hint: "Floor price multiplied by the total supply", filter: true,
        sort: true,
        sortDirection: 'desc',
        setCellProps: () => ({align: "center"}),
        customBodyRender: (value) => {
            return( <><p>{numberWithCommas(value)} </p> </>)
        },
        sortCompare: (order) => {
            return (obj1, obj2) => {
              console.log(order);
              let val1 = parseInt(obj1.data, 10);
              let val2 = parseInt(obj2.data, 10);
              return (val1 - val2) * (order === 'asc' ? 1 : -1);
            };
          }
    }
},

{
    name: "Links", options: {
        hint: "Percent of total supply that is currently available",
        customBodyRender: (value, tableMeta, updateValue) => {
            return (
                <CellLink
                    rowData={tableMeta.rowData}
                    index={tableMeta.columnIndex}
                    change={event => updateValue(event)}
                />
            )

        }
    }
},
{options: {display: false, viewColumns: false, filter: false}}];

const art_columns = [{ name: "Collection Name" ,options : {customBodyRender: (value, tableMeta, updateValue) => {
    return (
        <Name   
                rowData={tableMeta.rowData}
                index={tableMeta.columnIndex}
                change={event => updateValue(event)}
            />
    )

}}}, { name: "Category" },
{ name: "Floor Price", options: { hint: "Lowest Price an NFT in this collection is trading for" ,setCellProps: () => ({align: "center"})} },


{
    name: "24h%", options: {
        hint: "Percent change in floor price over the past 24h",
        customBodyRender: (value, tableMeta, updateValue) => {
            return (
                <QualityCell
                    value={value}
                    index={tableMeta.columnIndex}
                    change={event => updateValue(event)}
                />
            )

        }
    }
},
{
    name: "7d%", options: {
        hint: "Percent change in floor price over the past 7d",
        customBodyRender: (value, tableMeta, updateValue) => {
            return (
                <QualityCell
                    value={value}
                    index={tableMeta.columnIndex}
                    change={event => updateValue(event)}
                />
            )

        }
    }
},
{ name: "Total Minted", options: { hint: "Total number of NFT's in this collection that are available for immediate purchase" ,setCellProps: () => ({align: "center"}),customBodyRender: (value) => {
    return( <><p>{numberWithCommas(value)}</p></>)
}} },

{ name: "Float%", options: { hint: "Percent of total supply that is currently available",setCellProps: () => ({align: "center"}) } },
{
    name: "Floor Cap", options: {
        hint: "Floor price multiplied by the total supply", filter: true,
        sort: true,
        sortDirection: 'desc',
        customBodyRender: (value) => {
            return( <><p>{numberWithCommas(value)}</p></>)
        },
        sortCompare: (order) => {
            return (obj1, obj2) => {
              console.log(order);
              let val1 = parseInt(obj1.data, 10);
              let val2 = parseInt(obj2.data, 10);
              return (val1 - val2) * (order === 'asc' ? 1 : -1);
            };
          }
    }
},
{
    name: "Links", options: {
        hint: "Percent of total supply that is currently available",
        customBodyRender: (value, tableMeta, updateValue) => {
            return (
                <CellLink
                    
                    rowData={tableMeta.rowData}
                    index={tableMeta.columnIndex}
                    change={event => updateValue(event)}
                />
            )

        }
    }
},
{options: {display: false, viewColumns: false, filter: false}}];


function numberWithCommas(x) {
    return x? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):"---";
}
function Table() {
    function toFixedNumber(num, digits, base){
        var pow = Math.pow(base||10, digits);
        return Math.round(num*pow) / pow;
      }
    const classes = useStyles();
    const [eth_price, setEth] = useState();
    const [total_fpp, setFPP] = useState();
    const [total_avail, setAvail] = useState();
    const [total_fc, setTFC] = useState();
    const [cap_rank, setRank] = useState();
    const [cap_rank_art, setRankArt] = useState();
    const [alias,setAlias] = useState();


    const history = useHistory();
    const [chartData, setChartData] = useState();
    const tableToChart = (data) => {
        setChartData(data)
    }
    const [loading, setLoading] = useState(false);
    const [table_data, setTableData] = useState();
    const [art_blocks_data, setArtBlocks] = useState();
    const [error, setError] = useState();

    const loadAsyncData = async () => {
        setLoading(true);
        setError(null);
        try {
            var context = this;
            const url = "https://niftyprice.herokuapp.com?";
            const response = await fetch(url);
            // console.log(response);
            var data = await response.json();
            // console.log(data)
            var data_arr = new Array()
            var art_data_arr = new Array()
            setEth(data.eth_price);
            setFPP(data.total_fpp);
            setAvail(data.total_avail);
            setTFC(data.total_floor_cap);
            setRank(data.floor_cap_rankings);
            setRankArt(data.floor_cap_rankings_art);
            setAlias(JSON.stringify(data.alias));
            console.log("ALIAS DDD "+JSON.stringify(data.alias))

            for (let i in data.message) {
                let line = data.message[i];
                let map = new Map(Object.entries(line));
                var data_temp = Array.from(map.values())
                console.log("TEMP" + data_temp)
                data_temp[1] = toFixedNumber(parseFloat(data_temp[1]),2,10);
                data_temp[2] = toFixedNumber(parseFloat(data_temp[2]),2,10);
                data_temp[3] = toFixedNumber(parseFloat(data_temp[3]),2,10);
                data_temp[5] = toFixedNumber(parseFloat(data_temp[5]),2,10); 
                data_temp[7] = toFixedNumber(parseFloat(data_temp[7]),2,10);
                // t = data_temp[8]
                // data_temp[8] = data_temp[7];
                // data_temp[7] = t;
                data_arr.push(data_temp);
                console.log("Altered TEMP")
                console.log(data_temp)
            }
            
            for (let i in data.art_message) {
                let line = data.art_message[i];
                let map = new Map(Object.entries(line));
                var data_temp = Array.from(map.values())
                data_temp[2] = toFixedNumber(parseFloat(data_temp[2]),2,10);
                data_temp[5] = toFixedNumber(parseFloat(data_temp[5]),2,10);
                art_data_arr.push(data_temp);
            }
            console.log(art_data_arr);
            console.log(data_arr)
            setTableData(data_arr);
            setArtBlocks(art_data_arr);
            setLoading(false);
        } catch (e) {
            setError(e);
            setLoading(false);
        }
    }
    const options = {
        setTableProps: () => {
            return {
                size: 'small',
            };
        },
        download: false,
        selectableRowsHideCheckboxes: true,
        responsive:'standard',
        onRowClick: rowData => {
            // console.log(cap_rank)
            console.log("ROW-DATA"+rowData[0].props.rowData);  
            var row_data = rowData[0].props.rowData
            var rank = null;
            var i = 0
            for (const arr of cap_rank){
                if (arr[1] == row_data[0]){
                    rank = i+1
                }
                i+=1;
            }
            var j = 0
            for (const arr of cap_rank_art){
                // console.log("comparing "+arr[1]+ " With "+ row_data[0])
                if (arr[1] == row_data[0]){
                    rank = j+1
                }
                j+=1;
            }
            // console.log("RANK IS "+rank)
            console.log("LENGTH OF ROWDATA" + rowData.length)
            if (row_data.length == 10){
                var supply_change = row_data[8]
            }
            else{

                var supply_change = row_data[7]
            }
            console.log("THIS IS ROWDATA")
            console.log(row_data[0])
            history.push({
                pathname: '/chart',
                search: '?query=' + row_data[0],
                state: { row_data: row_data,
                row_rank:rank,
            supply_change:supply_change }
            })
            // console.log(chartData);
        },


    };
    useEffect(() => {
        loadAsyncData();
    }, []);

    if (loading) return (<div class="loading"><CircularProgress /></div>);
    return (<>
        <div class="content-wrap">
            <div class="welcome-container">
                <Grid container justifyContent="space-evenly">
                    <Grid item xs={12} lg={4}>
                        <Card id="prices" className={classes.root} elevation={5}>
                            <CardContent>
                                <Typography variant="h5" component="h5">
                                    Live NFT Floor Prices and Performance
                                </Typography>
                                <Typography className={classes.pos} color="textSecondary">
                                    Currently Tracking and providing historical data for over 140 NFT collections. Join to get exclusive access to all historical data
                                </Typography>

                            </CardContent>
                            <CardActions style={{ justifyContent: 'center' }}>
                                <Button variant="contained" color="primary" href="/purchase">GET EXCLUSIVE NFT DATA</Button>

                            </CardActions>
                        </Card>


                    </Grid>
                    <Grid item xs={12} lg={4}>

                        <Card id="prices" className={classes.root} elevation={5}>
                            <CardContent>
                                <Typography variant="h5" component="h5">
                                    Quick Stats
                                </Typography>
                                <div class="stat-spacer">
                                    <Grid container justifyContent="space-between">
                                        <Typography inline variant="h6" component="h6"  align="left">Total floor Price (ETH):</Typography>
                                        <Typography inline variant="h6" component="h6"  color="inherit" align="right">{numberWithCommas(parseFloat(total_fpp).toFixed(2))}</Typography>
                                    </Grid>
                                </div>
                                <div class="stat-spacer">
                                    <Grid container justifyContent="space-between">
                                        <Typography inline variant="h6" component="h6"  align="left">Total NFT's Available:</Typography>
                                        <Typography inline variant="h6" component="h6"  color="inherit" align="right">{numberWithCommas(parseFloat(total_avail))}</Typography>
                                    </Grid>
                                </div>
                                <div class="stat-spacer">
                                    <Grid container justifyContent="space-between">
                                        <Typography inline variant="h6" component="h6"  align="left">Ethereum price (USD):</Typography>
                                        <Typography inline variant="h6" component="h6"  color="inherit" align="right">${numberWithCommas(parseFloat(eth_price))}</Typography>
                                    </Grid>
                                </div>
                                <div class="stat-spacer">
                                    <Grid container justifyContent="space-between">
                                        <Typography inline variant="h6" component="h6"  align="left">Total floor cap (USD):</Typography>
                                        <Typography inline variant="h6" component="h6"  color="inherit" align="right">${numberWithCommas((eth_price*total_fc / 1000000000).toFixed(2))}B</Typography>
                                    </Grid>
                                </div>

                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
            <Tabs>
                <TabList>
                    <Tab>OpenSea Collections</Tab>
                    <Tab>Art Blocks</Tab>
                </TabList>
                <div class="table-container">
                    <TabPanel>

                        <Grid item xs={12}>
                            <MUIDataTable
                                title={"Collections"}
                                data={table_data}
                                columns={columns}
                                options={options}
                            />
                        </Grid>
                    </TabPanel>
                </div>
                <div class="table-container">
                    <TabPanel>
                        <Grid item xs={12}>
                            <MUIDataTable
                                title={"Art Blocks"}
                                data={art_blocks_data}
                                columns={art_columns}
                                options={options}
                            />
                        </Grid>
                    </TabPanel></div>
            </Tabs>

        </div>
    </>

    )

}
export default Table;

