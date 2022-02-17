import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import "./Table.css";
import "./App.css";
import Grid from "@material-ui/core/Grid";
import QualityCell from "./Cellcolor.js";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useHistory } from "react-router-dom";
import { index_metadata } from "./index_config.js";
import Chart from "../static/images/chart.png";
import SelectSearch from "react-select-search";
import "./Search.css"
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

import Fuse from 'fuse.js'

let debug = false
const muiTheme = createTheme({
  overrides: {
    MUIDataTable: {
      responsiveScrollFullHeight: {
        overflowX: 'scroll',

      },
    },
  },
})
const useStyles = makeStyles({
  centeredTableHead: {
    '& > span': {
      justifyContent: 'right',
    }
  },
  alert: {
    minHeight: 50,
  },
  root: {
    flexgrow: 1,
    minHeight: 285,
    maxHeight: 285,
    // maxWidth:350,
    overflow: "scroll",
  },
  paper: {
    padding: 2,
    textAlign: "center",
    color: "white",
  },

  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

function numberWithCommas(x) {
  return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "---";
}
function Table() {
  const travel = (object) => {
    history.push({
      pathname: "/indexes/" + object,
    });
  };
  const travel_mover = (object) => {
    history.push({
      pathname: "/collections/" + object,
    });
  };
  function toFixedNumber(num, digits, base) {
    var pow = Math.pow(base || 10, digits);
    return Math.round(num * pow) / pow;
  }
  const classes = useStyles();
  const [sortObj, setSortObj] = useState(() => {
    // getting stored value
    const saved = JSON.parse(window.localStorage.getItem("sortObj"));
    const initialValue = saved;
    return initialValue || { name: "Floor Cap (ETH)", direction: "desc" };
  });
  const [tabIndex, setTabIndex] = useState(() => {
    // getting stored value
    const saved = JSON.parse(window.localStorage.getItem("index"));
    const initialValue = parseInt(saved);
    return initialValue || 0;
  });
  const [eth_price, setEth] = useState();
  const [total_fpp, setFPP] = useState();
  const [total_avail, setAvail] = useState();
  const [total_fc, setTFC] = useState();
  const [cap_rank, setRank] = useState();
  const [cap_rank_art, setRankArt] = useState();
  const [alias, setAlias] = useState();

  const history = useHistory();
  const [searchOptions, setSearchOptions] = useState();
  const [loading, setLoading] = useState(false);
  const [table_data, setTableData] = useState();
  const [art_blocks_data, setArtBlocks] = useState();
  const [index_data, setIndexData] = useState();
  const [movers_data, setMoversData] = useState([]);

  const loadAsyncData = async () => {
    setLoading(true);
    try {
      const url = debug?"http://localhost:8080/":'https://niftyprice.herokuapp.com'; //"http://localhost:8080/"; //
      const response = await fetch(url);
      var data = await response.json();
      var data_arr = [];
      var art_data_arr = [];
      setEth(data.eth_price);
      setFPP(data.total_fpp);
      setAvail(data.total_avail);
      setTFC(data.total_floor_cap);
      setRank(data.floor_cap_rankings);
      var rankings = {};

      for (let i = 0; i < data.floor_cap_rankings.length; i++) {
        rankings[data.floor_cap_rankings[i][1]] = i + 1;
      }
      setRankArt(data.floor_cap_rankings_art);
      setAlias(data.alias);
      // console.log("ALIAS",data.alias)
      let search_data = []
      for (const element in data.alias){
        let search_format = {}
        search_format["name"] = data.alias[element];
        search_format["value"] = element;
        search_data.push(search_format)

      }
      // console.log(search_data)
      setSearchOptions(search_data)
      setIndexData(data.index);
      for (let i in data.message) {
        let line = data.message[i];
        let map = new Map(Object.entries(line));
        var data_temp = Array.from(map.values());
        let rank = [rankings[data_temp[0]]];
        data_temp[1] = toFixedNumber(parseFloat(data_temp[1]), 2, 10);
        data_temp[2] = toFixedNumber(parseFloat(data_temp[2]), 2, 10);
        data_temp[3] = toFixedNumber(parseFloat(data_temp[3]), 2, 10);
        data_temp[5] = toFixedNumber(parseFloat(data_temp[5]), 2, 10);
        data_temp[7] = toFixedNumber(parseFloat(data_temp[7]), 2, 10);
        data_temp.unshift(rank);
        data_arr.push(data_temp);
      }

      for (let i in data.art_message) {
        let line = data.art_message[i];
        let map = new Map(Object.entries(line));
        var art_data_temp = Array.from(map.values());
        art_data_temp[2] = toFixedNumber(parseFloat(art_data_temp[2]), 2, 10);
        art_data_temp[3] = toFixedNumber(parseFloat(art_data_temp[3]), 2, 10);
        art_data_temp[4] = toFixedNumber(parseFloat(art_data_temp[4]), 2, 10);
        art_data_temp[5] = toFixedNumber(parseFloat(art_data_temp[5]), 2, 10);
        art_data_arr.push(art_data_temp);
      }
      setTableData(data_arr);
      setArtBlocks(art_data_arr);
      var top_art = art_data_arr.sort(function (a, b) {
        return b[3] - a[3];
      });

      var top_os = data_arr.sort(function (a, b) {
        return b[3] - a[3];
      });
      var top_movers = [];
      for (let i = 0; i < 5; i++) {
        top_movers.push([top_art[i][0], top_art[i][2], top_art[i][3]]);
        top_movers.push([top_os[i][1], top_os[i][2], top_os[i][3]]);
      }
      setMoversData(
        top_movers.sort(function (a, b) {
          return b[2] - a[2];
        })
      );

      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };
  const options = {
    tableBodyHeight:"1200px",
    // tableBodyMaxWidth:"100%",
    // fixedHeaderOptions: { xAxis: false, yAxis: false },

responsive: 'scrollFullHeight',
fixedHeader: true,


    searchOpen: true,
    rowsPerPage: 100,
    sortOrder: sortObj.name
      ? sortObj
      : { name: "Floor Cap (ETH)", direction: "desc" },
    setTableProps: () => {
      return {
        size: "small",
      };
    },
    download: false,
    selectableRowsHideCheckboxes: true,
    // responsive: "standard",
    onColumnSortChange: (colData, direction) => {
      setSortObj({
        name: colData,
        direction: direction,
      });
    },
    onRowClick: (rowData, rowMeta) => {
      var name = rowData[rowData.length - 1].includes("artblocks")
        ? art_blocks_data[rowMeta.dataIndex][0]
        : table_data[rowMeta.dataIndex][1];
      for (const element in alias) {
        if (alias[element] == name) {
          name = element;
        }
      }
      // let url = debug?'http://localhost:3000/collections/' + name:'https://niftyprice.io/collections/' + name
      // window.open(url)
      history.push({
        pathname: "/collections/" + name,
      });
    },
  };
  useEffect(() => {
    loadAsyncData();
  }, []);

  useEffect(() => {
    window.localStorage.setItem("index", tabIndex);
  }, [tabIndex]);

  useEffect(() => {
    window.localStorage.setItem("sortObj", JSON.stringify(sortObj));
  }, [sortObj]);
  if (loading || index_data == undefined) {
    return (
      <div class="loading">
        <CircularProgress />
      </div>
    );
  } else {
    var columns = [
      { name: "#" },
      {
        name: "Collection Name",
        options: {
          setCellProps: () => ({
            style: { maxWidth: "300px", minWidth: "190px" },
          }),
          // setCellHeaderProps: () => ({ style: { padding: '10px' } }),

          customBodyRender: (value, tableMeta, updateValue) => {
            var img = tableMeta.rowData[tableMeta.rowData.length - 1];
            console.log(tableMeta.rowData);

            return (
              <>
                <Grid container>
                  <Grid item xs={3}>
                    <img src={img} class="image-snippet" alt="no img"></img>
                  </Grid>
                  <Grid item xs={8}>
                    <Grid container>
                      <Grid item xs={12}>
                        <a href={"https://niftyprice.io/collections/"+tableMeta.rowData[1]}>
                        <Typography variant="subtitle3" align="right">
                          {alias[tableMeta.rowData[1]]
                            ? alias[tableMeta.rowData[1]]
                            : tableMeta.rowData[1]}
                        </Typography></a>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          style={{
                            color: "#787878",
                          }}
                          variant="subtitle3"
                          align="right"
                        >
                          {tableMeta.rowData[5]}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            );
          },
        },
      },
      {
        name: "Floor Price (ETH)",
        options: {
          // hint: 'Lowest price that an NFT in this collection is currently selling for',
          setCellProps: () => ({ align: "right" }), // setCellHeaderProps: () => ({ style: { padding: '0px' } }),
          customBodyRender: (value) => {
            return (
              <>
                <p>{numberWithCommas(value.toFixed(2))}</p>
              </>
            );
          },
        },
      },

      {
        name: "24h%",
        options: {
          // hint: 'Percent change in floor price over the past 24 hours',
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <QualityCell
                value={value}
                index={tableMeta.columnIndex}
                change={(event) => updateValue(event)}
              />
            );
          },
          setCellProps: () => ({ align: "right" }),
          setCellHeaderProps: (value) => ({ style: { align: "right" } }),
        },
      },
      {
        name: "7d%",
        options: {
          // hint: 'Percent change in floor price over the past 7 days',
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <QualityCell
                value={value}
                index={tableMeta.columnIndex}
                change={(event) => updateValue(event)}
              />
            );
          },
          setCellProps: () => ({ align: "right" }), // setCellHeaderProps: () => ({ style: { padding: '0px' } }),
        },
      },

      {
        name: "Total Minted",
        // options: {
        //   hint: "Total number of NFTs that were minted and currently exist",
        //   setCellProps: () => ({ align: "center" }),
        //   customBodyRender: (value) => {
        //     return (
        //       <>
        //         <p>{numberWithCommas(value)}</p>
        //       </>
        //     );
        //   },
        // },
        options: { display: false, viewColumns: false, filter: false },
      },
      {
        name: "Floor Cap (ETH)",
        options: {
          // hint: 'Floor price multiplied by the total supply',
          filter: true,
          sort: true,
          setCellHeaderProps: () => {
            return {
              className: classes.centeredTableHead
            }
          },
          setCellProps: () => ({ align: "right" }), // setCellHeaderProps: () => ({ style: { padding: '0px' } }),
          customBodyRender: (value) => {
            return (
              <>
                <p>{numberWithCommas(parseInt(value))} </p>{" "}
              </>
            );
          },
          sortCompare: (order) => {
            return (obj1, obj2) => {
              let val1 = parseInt(obj1.data, 10);
              let val2 = parseInt(obj2.data, 10);
              return (val1 - val2) * (order === "asc" ? 1 : -1);
            };
          },
        },
      },

      {
        name: "24H Volume",
        options: {
          // hint: 'Daily Volume',
          setCellProps: () => ({ align: "right" }), // setCellHeaderProps: () => ({ style: { padding: '0px' } }),
          customBodyRender: (value) => {
            return (
              <>
                <p>{isNaN(value) || value == null ? "---" : numberWithCommas(value.toFixed(2))}</p>
              </>
            );
          },
          sortCompare: (order) => {
            return (obj1, obj2) => {
              let val1 = parseInt(obj1.data, 10);
              let val2 = parseInt(obj2.data, 10);
              return (val1 - val2) * (order === "asc" ? 1 : -1);
            };
          },
        },
      },
      {
        name: "24H Volume%",
        options: {
          // hint: 'Change in volume within the past 24h hour period',
          setCellProps: () => ({ align: "right" }), // setCellHeaderProps: () => ({ style: { padding: '0px' } }),
          customBodyRender: (value) => {
            return (
              <>
                <p>{isNaN(value) || numberWithCommas(value.toFixed(2)) == null ? "---" : value + "%"}</p>
              </>
            );
          },
          sortCompare: (order) => {
            return (obj1, obj2) => {
              let val1 = parseFloat(obj1.data, 10);
              let val2 = parseFloat(obj2.data, 10);
              return (val1 - val2) * (order === "asc" ? 1 : -1);
            };
          },
          //  display: false, viewColumns: false, filter: false
        },
      },
      {
        name: "24H Sales",
        options: {
          // hint: 'Sales within the past 24h hour period',
          setCellProps: () => ({ align: "right" }), // setCellHeaderProps: () => ({ style: { padding: '0px' } }),
          customBodyRender: (value) => {
            return (
              <>
                <p>{isNaN(value) || numberWithCommas(parseInt(value)) == null ? "---" : value}</p>
              </>
            );
          },
          sortCompare: (order) => {
            return (obj1, obj2) => {
              let val1 = parseInt(obj1.data, 10);
              let val2 = parseInt(obj2.data, 10);
              return (val1 - val2) * (order === "asc" ? 1 : -1);
            };
          },
        },
      },
      {
        name: "24H Owners%",
        options: {
          // hint: 'Number of Unique Owners',
          setCellProps: () => ({ align: "right" }), // setCellHeaderProps: () => ({ style: { padding: '0px' } }),
          customBodyRender: (value) => {
            return (
              <>
                <p>{isNaN(value) || value == null ? "---" : value}%</p>
              </>
            );
          },
          sortCompare: (order) => {
            return (obj1, obj2) => {
              let val1 = parseInt(obj1.data, 10);
              let val2 = parseInt(obj2.data, 10);
              return (val1 - val2) * (order === "asc" ? 1 : -1);
            };
          },
        },
      },
      {
        name: "Listed%",
        options: {
          // hint: 'Percent of total supply that is currently for sale',
          setCellProps: () => ({ align: "right" }), // setCellHeaderProps: () => ({ style: { padding: '0px' } }),
          customBodyRender: (value) => {
            return (
              <>
                <p>{value}%</p>
              </>
            );
          },
          sortCompare: (order) => {
            return (obj1, obj2) => {
              let val1 = parseInt(obj1.data, 10);
              let val2 = parseInt(obj2.data, 10);
              return (val1 - val2) * (order === "asc" ? 1 : -1);
            };
          },
        },
      },

      {
        name: "Links",
        options: {
          sort: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            // console.log("META", tableMeta);
            let link =
              "https://opensea.io/collection/" +
              tableMeta.rowData[1] +
              "?ref=0x5e4c7b1f6ceb2a71efbe772296ab8ab9f4e8582c&collectionSlug=" +
              tableMeta.rowData[1] +
              "&search[sortAscending]=true&search[sortBy]=PRICE&search[toggles][0]=BUY_NOW";
            return (
              <>
                <div class="links">
                  <a class="graph-link"> </a>
                  <a class="opensea-link" href={link}>
                    {" "}
                  </a>
                </div>
              </>
            );
          },
        },
      },
      { options: { display: false, viewColumns: false, filter: false } },
    ];

    var art_columns = [
      {
        name: "Collection Name",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            var img = tableMeta.rowData[tableMeta.rowData.length - 1];
            return (
              <>
                <img src={img} class="image-snippet" alt="no img"></img>
                <a>
                  {alias[tableMeta.rowData[0]]
                    ? alias[tableMeta.rowData[0]]
                    : tableMeta.rowData[0]}
                </a>
              </>
            );
          },
        },
      },
      {
        name: "Category",
        options: { setCellProps: () => ({ align: "right" }) },
      },
      {
        name: "Floor Price (ETH)",
        options: {
          // hint: 'Lowest price that an NFT in this collection is currently selling for',
          setCellProps: () => ({ align: "right" }),
          customBodyRender: (value) => {
            return (
              <>
                <p>{numberWithCommas(value.toFixed(2))}</p>
              </>
            );
          },
        },
      },

      {
        name: "24h%",
        options: {
          setCellProps: () => ({ align: "right" }), // hint: 'Percent change in floor price over the past 24 hours',
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <QualityCell
                value={value}
                index={tableMeta.columnIndex}
                change={(event) => updateValue(event)}
              />
            );
          },
        },
      },
      {
        name: "7d%",
        options: {
          setCellProps: () => ({ align: "right" }), // hint: 'Percent change in floor price over the past 7 days',
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <QualityCell
                value={value}
                index={tableMeta.columnIndex}
                change={(event) => updateValue(event)}
              />
            );
          },
        },
      },
      {
        name: "Total Minted",
        // options: {
        //   hint: "Total number of NFTs that were minted and currently exist",
        //   setCellProps: () => ({ align: "center" }),
        //   customBodyRender: (value) => {
        //     return (
        //       <>
        //         <p>{numberWithCommas(value)}</p>
        //       </>
        //     );
        //   },
        // },
        options: { display: false, viewColumns: false, filter: false },
      },

      {
        name: "Listed%",
        options: {
          // hint: 'Percent of total supply that is currently for sale',
          setCellProps: () => ({ align: "right" }),
          customBodyRender: (value) => {
            return (
              <>
                <p>{value}%</p>
              </>
            );
          },
          sortCompare: (order) => {
            return (obj1, obj2) => {
              let val1 = parseInt(obj1.data, 10);
              let val2 = parseInt(obj2.data, 10);
              return (val1 - val2) * (order === "asc" ? 1 : -1);
            };
          },
        },
      },
      {
        name: "Floor Cap (ETH)",
        options: {
          setCellProps: () => ({ align: "right" }), // hint: 'Floor price multiplied by the total supply',
          filter: true,
          sort: true,

          customBodyRender: (value) => {
            return (
              <>
                <p>{numberWithCommas(value)}</p>
              </>
            );
          },
          sortCompare: (order) => {
            return (obj1, obj2) => {
              let val1 = parseInt(obj1.data, 10);
              let val2 = parseInt(obj2.data, 10);
              return (val1 - val2) * (order === "asc" ? 1 : -1);
            };
          },
        },
      },
      {
        name: "Links",
        options: {
          sort: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            let link_name = tableMeta.rowData[0];

            for (const element in alias) {
              if (alias[element] == tableMeta.rowData[0]) {
                link_name = element;
              }
            }

            let link =
              "https://opensea.io/collection/" +
              link_name +
              "?ref=0x5e4c7b1f6ceb2a71efbe772296ab8ab9f4e8582c&collectionSlug=" +
              link_name +
              "&search[sortAscending]=true&search[sortBy]=PRICE&search[toggles][0]=BUY_NOW";
            return (
              <>
                <div class="links">
                  <a class="graph-link"> </a>
                  <a class="opensea-link" href={link}>
                    {" "}
                  </a>
                </div>
              </>
            );
          },
        },
      },
      { options: { display: false, viewColumns: false, filter: false } },
    ];

    return (
      <>
        <div class="content-wrap">
          <div class="welcome-container">
            <Grid container justifyContent="space-evenly">
              <Grid item xs={12}>
                <Typography align="left" variant="h5">
                  Today’s NFT Floor Prices by Floor Cap
                </Typography>
                <Typography align="left" variant="subtitle1">
                  View additional metrics and historical price charts by
                  clicking on individual collections
                </Typography>
              </Grid>
              {/* <Grid item xs={6}>
                {searchOptions ? (
                  <SelectSearch
                    options={searchOptions}
                    search
                    getOptions ={(query)=>{
                      const options = {
                        // Search in `author` and in `tags` array
                        keys: ['name']
                      }
                      
                      const fuse = new Fuse(searchOptions, options)
                      
                      const result = fuse.search(query)
                      if (result.length>1){
                      setSearchOptions(result)

                      }
                    }}
                    onChange ={(value) => travel_mover(value)}
                    placeholder="Search for a collection"
                  />
                ) : (
                  <></>
                )}
              </Grid> */}
            </Grid>
            {/* <Grid item xs={12} > */}
            <Grid container justifyContent="space-evenly">
              <Grid item xs={12} lg={3}>
                <Card id="prices" className={classes.root} elevation={5}>
                  <CardContent>
                    <div class="index-div">
                      <img src={Chart} class="image-index" alt="no img"></img>
                      <h3 class="index-title">Top Movers</h3>
                    </div>
                    <Grid container justifyContent="space-evenly">
                      <Grid item xs={3}>
                        <Typography variant="subtitle2" align="left">
                          Collection
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="subtitle2" align="center">
                          Floor Price
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="subtitle2" align="center">
                          24H%
                        </Typography>
                      </Grid>
                    </Grid>
                    <hr></hr>
                    {movers_data.map(function (object, i) {
                      return (
                        <>
                          <div onClick={() => travel_mover(object[0])}>
                            <Grid container justifyContent="space-evenly">
                              <Grid
                                item
                                xs={6}
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                }}
                              >
                                <div class="title-box">
                                  <Typography
                                    inline
                                    component="body2"
                                    align="left"
                                    style={{ maxWidth: 120, minWidth: 80 }}
                                  >
                                    {" "}
                                    {alias[object[0]]
                                      ? alias[object[0]]
                                      : object[0]}
                                  </Typography>
                                </div>
                              </Grid>
                              <Grid item xs={3}>
                                <Typography align="left">
                                  {numberWithCommas(
                                    parseFloat(object[1]).toFixed(2)
                                  )}
                                </Typography>
                              </Grid>

                              <Grid item xs={3}>
                                <Typography
                                  align="right"
                                  style={
                                    parseFloat(object[2]) > 0
                                      ? {
                                          color: "#065f46",
                                          backgroundColor: "#D1FAE5",
                                          borderRadius: 12,
                                          textAlign: "center",
                                          float: "right",
                                          maxWidth: 80,
                                          minWidth: 80,
                                          minHeight: 25,
                                        }
                                      : {
                                          color: "#981b1b",
                                          backgroundColor: "#FEE2E2",
                                          borderRadius: 12,
                                          minHeight: 25,
                                          textAlign: "center",
                                          float: "right",
                                          maxWidth: 80,
                                          minWidth: 80,
                                        }
                                  }
                                >
                                  {parseFloat(object[2]).toFixed(2)}%
                                </Typography>
                              </Grid>
                            </Grid>

                            <hr></hr>
                          </div>
                        </>
                      );
                    })}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} lg={3}>
                <Card id="prices" className={classes.root} elevation={5}>
                  <CardContent>
                    <div class="index-div">
                      <img
                        src={index_metadata.Playground.image}
                        class="image-index"
                        alt="no img"
                      ></img>
                      <h3 class="index-title">Art Blocks Stats</h3>
                    </div>
                    <Grid container justifyContent="space-evenly">
                      <Grid item xs={4}>
                        <Typography variant="subtitle2" align="left">
                          Collection
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="subtitle2" align="center">
                          Floor CAP (ETH)
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="subtitle2" align="right">
                          24H%
                        </Typography>
                      </Grid>
                    </Grid>
                    <hr></hr>
                    {Object.keys(index_data).map(function (object, i) {
                      if (object != "blue_chip") {
                        return (
                          <>
                            <div
                              class="index-content"
                              onClick={() => travel(object)}
                            >
                              <Grid container justifyContent="space-evenly">
                                <Grid item xs={4}>
                                  <Typography align="left">{object}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography align="center">
                                    {numberWithCommas(
                                      (
                                        parseFloat(index_data[object].quote) /
                                        index_metadata[object].divisor
                                      ).toFixed(2)
                                    )}
                                  </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography
                                    align="center"
                                    style={
                                      parseFloat(index_data[object].percent) > 0
                                        ? {
                                            color: "#065f46",
                                            backgroundColor: "#D1FAE5",
                                            borderRadius: 12,
                                            textAlign: "center",
                                            float: "right",
                                            maxWidth: 80,
                                            minWidth: 80,
                                            minHeight: 25,
                                          }
                                        : {
                                            color: "#981b1b",
                                            backgroundColor: "#FEE2E2",
                                            borderRadius: 12,
                                            minHeight: 25,
                                            textAlign: "center",
                                            float: "right",
                                            maxWidth: 80,
                                            minWidth: 80,
                                          }
                                    }
                                  >
                                    {parseFloat(
                                      index_data[object].percent.toFixed(2)
                                    )}
                                    %
                                  </Typography>
                                </Grid>
                              </Grid>
                            </div>
                            <hr></hr>
                          </>
                        );
                      }
                    })}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} lg={3}>
                <Card id="prices" className={classes.root} elevation={5}>
                  <CardContent>
                    <div class="index-div">
                      <img
                        src={index_metadata.blue_chip.table_image}
                        class="image-index"
                        alt="no img"
                      ></img>
                      <h3 class="index-title">NFT Indexes</h3>
                    </div>
                    <Grid container justifyContent="space-evenly">
                      <Grid item xs={3}>
                        <Typography variant="subtitle2" align="left">
                          Index
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="subtitle2" align="center">
                          Value
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="subtitle2" align="center">
                          Change
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="subtitle2" align="right">
                          24H%
                        </Typography>
                      </Grid>
                    </Grid>
                    <hr></hr>
                    {Object.keys(index_data).map(function (object, i) {
                      if (object == "blue_chip") {
                        return (
                          <>
                            <div
                              class="index-content"
                              onClick={() => travel(object)}
                            >
                              <Grid container justifyContent="space-evenly">
                                <Grid item xs={3}>
                                  <Typography align="left">
                                    {" "}
                                    {object.replace("_", " ")}
                                  </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                  <Typography align="center">
                                    {numberWithCommas(
                                      (
                                        parseFloat(index_data[object].quote) /
                                        index_metadata[object].divisor
                                      ).toFixed(2)
                                    )}
                                  </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                  <Typography
                                    align="center"
                                    style={
                                      parseFloat(index_data[object].percent) > 0
                                        ? {
                                            color: "#065f46",
                                            textAlign: "center",
                                            float: "right",
                                            maxWidth: 80,
                                            minWidth: 80,
                                          }
                                        : {
                                            color: "#981b1b",
                                            textAlign: "center",
                                            float: "right",
                                            maxWidth: 80,
                                            minWidth: 80,
                                          }
                                    }
                                  >
                                    {(
                                      parseFloat(index_data[object].change) /
                                      index_metadata[object].divisor
                                    ).toFixed(2)}
                                  </Typography>{" "}
                                </Grid>
                                <Grid item xs={3}>
                                  <Typography
                                    align="right"
                                    style={
                                      parseFloat(index_data[object].percent) > 0
                                        ? {
                                            color: "#065f46",
                                            backgroundColor: "#D1FAE5",
                                            borderRadius: 12,
                                            textAlign: "center",
                                            float: "right",
                                            maxWidth: 80,
                                            minWidth: 80,
                                            minHeight: 25,
                                          }
                                        : {
                                            color: "#981b1b",
                                            backgroundColor: "#FEE2E2",
                                            borderRadius: 12,
                                            minHeight: 25,
                                            textAlign: "center",
                                            float: "right",
                                            maxWidth: 80,
                                            minWidth: 80,
                                          }
                                    }
                                  >
                                    {parseFloat(
                                      index_data[object].percent.toFixed(2)
                                    )}
                                    %
                                  </Typography>
                                </Grid>
                              </Grid>

                              <hr></hr>
                            </div>
                          </>
                        );
                      }
                    })}
                  </CardContent>
                </Card>
              </Grid>

              {/* </Grid> */}
            </Grid>
          </div>
          <Tabs
            selectedIndex={tabIndex}
            onSelect={(index) => setTabIndex(index)}
          >
            <TabList>
              <Tab>OpenSea Collections</Tab>
              <Tab>Art Blocks</Tab>
            </TabList>
            <div class="table-container">
              <TabPanel>
                <Grid item xs={12}>
                <ThemeProvider theme={muiTheme}>

                  <MUIDataTable
                    title={"Collections"}
                    data={table_data}
                    columns={columns}
                    options={options}
                  />
                        </ThemeProvider>

                </Grid>
              </TabPanel>
            </div>
            <div class="table-container">
              <TabPanel>
                <Grid item xs={12}>
                <ThemeProvider theme={muiTheme}>
                  <MUIDataTable
                    title={"Art Blocks"}
                    data={art_blocks_data}
                    columns={art_columns}
                    options={options}
                  />
                   </ThemeProvider>
                </Grid>
              </TabPanel>
            </div>
          </Tabs>
        </div>
      </>
    );
  }
}
export default Table;
