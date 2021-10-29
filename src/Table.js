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

const useStyles = makeStyles({
  alert: {
    minHeight: 50,
  },
  root: {
    flexgrow: 1,
    minHeight: 285,
    maxHeight: 285,
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

  const [loading, setLoading] = useState(false);
  const [table_data, setTableData] = useState();
  const [art_blocks_data, setArtBlocks] = useState();
  const [index_data, setIndexData] = useState();

  const loadAsyncData = async () => {
    setLoading(true);
    try {
      const url = "https://niftyprice.herokuapp.com?"; //"http://localhost:8080"; //
      const response = await fetch(url);
      var data = await response.json();
      var data_arr = [];
      var art_data_arr = [];
      setEth(data.eth_price);
      setFPP(data.total_fpp);
      setAvail(data.total_avail);
      setTFC(data.total_floor_cap);
      setRank(data.floor_cap_rankings);
      setRankArt(data.floor_cap_rankings_art);
      setAlias(data.alias);
      console.log(alias);
      console.log("INDEX INFORMATION" + JSON.stringify(data.index));
      setIndexData(data.index);

      for (let i in data.message) {
        let line = data.message[i];
        let map = new Map(Object.entries(line));
        var data_temp = Array.from(map.values());
        data_temp[1] = toFixedNumber(parseFloat(data_temp[1]), 2, 10);
        data_temp[2] = toFixedNumber(parseFloat(data_temp[2]), 2, 10);
        data_temp[3] = toFixedNumber(parseFloat(data_temp[3]), 2, 10);
        data_temp[5] = toFixedNumber(parseFloat(data_temp[5]), 2, 10);
        data_temp[7] = toFixedNumber(parseFloat(data_temp[7]), 2, 10);
        data_arr.push(data_temp);
      }

      for (let i in data.art_message) {
        let line = data.art_message[i];
        let map = new Map(Object.entries(line));
        var art_data_temp = Array.from(map.values());
        // console.log(art_data_temp);
        art_data_temp[2] = toFixedNumber(parseFloat(art_data_temp[2]), 2, 10);
        art_data_temp[3] = toFixedNumber(parseFloat(art_data_temp[3]), 2, 10);
        art_data_temp[4] = toFixedNumber(parseFloat(art_data_temp[4]), 2, 10);
        art_data_temp[5] = toFixedNumber(parseFloat(art_data_temp[5]), 2, 10);
        art_data_arr.push(art_data_temp);
      }
      setTableData(data_arr);
      console.log(data_arr);
      setArtBlocks(art_data_arr);
      console.log(art_data_arr);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };
  const options = {
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
    responsive: "standard",
    onColumnSortChange: (colData, direction) => {
      setSortObj({
        name: colData,
        direction: direction,
      });
      console.log("CHANGED" + colData + " " + direction);
    },
    onRowClick: (rowData) => {
      console.log(rowData);
      console.log(
        "ROW DATA" + JSON.stringify(rowData[0].props.children[1].props.children)
      );
      var name = rowData[0].props.children[1].props.children;
      for (const element in alias) {
        if (alias[element] == name) {
          name = element;
          console.log("Found match" + element);
        }
      }
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
      {
        name: "Collection Name",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            var img = null;
            if (tableMeta.rowData.length === 9) {
              img = tableMeta.rowData[8];
            } else {
              img = tableMeta.rowData[9];
            }
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
        name: "Floor Price (ETH)",
        options: {
          hint: "Lowest price that an NFT in this collection is currently selling for",
          setCellProps: () => ({ align: "center" }),
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
          hint: "Percent change in floor price over the past 24 hours",
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
        },
      },
      {
        name: "7d%",
        options: {
          hint: "Percent change in floor price over the past 7 days",
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
        },
      },

      {
        name: "Total Minted",
        options: {
          hint: "Total number of NFTs that were minted and currently exist",
          setCellProps: () => ({ align: "center" }),
          customBodyRender: (value) => {
            return (
              <>
                <p>{numberWithCommas(value)}</p>
              </>
            );
          },
        },
      },

      {
        name: "Float%",
        options: {
          hint: "Percent of total supply that is currently for sale",
          setCellProps: () => ({ align: "center" }),
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
          hint: "Floor price multiplied by the total supply",
          filter: true,
          sort: true,

          setCellProps: () => ({ align: "center" }),
          customBodyRender: (value) => {
            return (
              <>
                <p>{numberWithCommas(value)} </p>{" "}
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
            let link = "n";
            if (tableMeta.rowData[0] in alias) {
              link =
                "https://opensea.io/collection/" +
                tableMeta.rowData[0] +
                "?ref=0x5e4c7b1f6ceb2a71efbe772296ab8ab9f4e8582c&collectionSlug=" +
                tableMeta.rowData[0] +
                "&search[sortAscending]=true&search[sortBy]=PRICE&search[toggles][0]=BUY_NOW";
            } else {
              let plural =
                tableMeta.rowData[0].slice(-1) === "s"
                  ? tableMeta.rowData[0]
                  : tableMeta.rowData[0] + "s";
              link =
                "https://opensea.io/assets/" +
                "?ref=0x5e4c7b1f6ceb2a71efbe772296ab8ab9f4e8582c&search[stringTraits][0][name]=" +
                tableMeta.rowData[0] +
                "&search[stringTraits][0][values][0]=All%20" +
                plural +
                "&search[toggles][0]=BUY_NOW&search[sortAscending]=true&search[sortBy]=PRICE";
            }
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
            var img = null;
            if (tableMeta.rowData.length === 9) {
              img = tableMeta.rowData[8];
            } else {
              img = tableMeta.rowData[9];
            }
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
      { name: "Category" },
      {
        name: "Floor Price (ETH)",
        options: {
          hint: "Lowest price that an NFT in this collection is currently selling for",
          setCellProps: () => ({ align: "center" }),
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
          hint: "Percent change in floor price over the past 24 hours",
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
          hint: "Percent change in floor price over the past 7 days",
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
        options: {
          hint: "Total number of NFTs that were minted and currently exist",
          setCellProps: () => ({ align: "center" }),
          customBodyRender: (value) => {
            return (
              <>
                <p>{numberWithCommas(value)}</p>
              </>
            );
          },
        },
      },

      {
        name: "Float%",
        options: {
          hint: "Percent of total supply that is currently for sale",
          setCellProps: () => ({ align: "center" }),
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
          hint: "Floor price multiplied by the total supply",
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
            let link = "n";
            if (tableMeta.rowData[0] in alias) {
              link =
                "https://opensea.io/collection/" +
                tableMeta.rowData[0] +
                "?ref=0x5e4c7b1f6ceb2a71efbe772296ab8ab9f4e8582c&collectionSlug=" +
                tableMeta.rowData[0] +
                "&search[sortAscending]=true&search[sortBy]=PRICE&search[toggles][0]=BUY_NOW";
            } else {
              let plural =
                tableMeta.rowData[0].slice(-1) === "s"
                  ? tableMeta.rowData[0]
                  : tableMeta.rowData[0] + "s";
              link =
                "https://opensea.io/assets/" +
                "?ref=0x5e4c7b1f6ceb2a71efbe772296ab8ab9f4e8582c&search[stringTraits][0][name]=" +
                tableMeta.rowData[0] +
                "&search[stringTraits][0][values][0]=All%20" +
                plural +
                "&search[toggles][0]=BUY_NOW&search[sortAscending]=true&search[sortBy]=PRICE";
            }
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
              <Grid item xs={12} className={classes.alert}></Grid>
              <Grid item xs={12} lg={4}>
                <Card id="prices" className={classes.root} elevation={5}>
                  <CardContent>
                    <div class="index-div">
                      <img
                        src={index_metadata.Playground.image}
                        class="image-index"
                        alt="no img"
                      ></img>
                      <h3 class = "index-title">Art Blocks Stats</h3>
                    </div>
                    <table class="index-table">
                      <tr class="index-row">
                        <th>Collection</th>
                        <th>Floor CAP (ETH)</th>
                        <th>24H%</th>
                        <hr />
                      </tr>
                      {Object.keys(index_data).map(function (object, i) {
                        if (object != "blue_chip") {
                          return (
                            <>
                              <tr class="index-row" >
                                <td class = "index-name">
                                  <a href={"indexes/"+object}>{object}</a>
                                </td>
                                <td>
                                  <p class = "index-quote">
                                    {numberWithCommas(
                                      (
                                        parseFloat(index_data[object].quote) /
                                        index_metadata[object].divisor
                                      ).toFixed(2)
                                    )}
                                  </p>
                                </td>
                                <td>
                                <Typography 
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
                                      minHeight:25,
                                    }
                                  : {
                                      color: "#981b1b",
                                      backgroundColor: "#FEE2E2",
                                      borderRadius: 12,
                                      minHeight:25,
                                      textAlign: "center",
                                      float: "right",
                                      maxWidth: 80,
                                      minWidth: 80,
                                    }
                                  }
                                  >
                                    {parseFloat(
                                      index_data[object].percent.toFixed(2)
                                    )}%
                                  </Typography>
                                </td>
                                
                              </tr>
                            </>
                          );
                        }
                      })}
                    </table>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Card id="prices" className={classes.root} elevation={5}>
                  <CardContent>
                  <div class="index-div">
                      <img
                        src={index_metadata.blue_chip.table_image}
                        class="image-index"
                        alt="no img"
                      ></img>
                      <h3 class = "index-title">NFT Indexes</h3>
                    </div>
                  <table class="index-table">
                  <tr class="index-row">
                        <th>Index</th>
                        <th>Value</th>
                        <th>Change</th>
                        <th>24H%</th>
                        
                      </tr >
                      {Object.keys(index_data).map(function (object, i) {
                        if (object == "blue_chip") {
                          return (
                            <>
                              <tr class="index-row">
                                <td class = "index-name">
                                <a href={"indexes/"+object.replace("_","-")}>{object.replace("_"," ")}</a>
                                </td>
                                <td>
                                  <p class = "index-quote">
                                    {numberWithCommas(
                                      (
                                        parseFloat(index_data[object].quote) /
                                        index_metadata[object].divisor
                                      ).toFixed(2)
                                    )}
                                  </p>

                                </td>
                                <td>
                                  <Typography
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
                                    {(parseFloat(
                                      index_data[object].change
                                    )/(index_metadata[object].divisor)).toFixed(2)}
                                  </Typography>
                                </td>
                                <td>
                                  <Typography 
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
                                      minHeight:25,
                                    }
                                  : {
                                      color: "#981b1b",
                                      backgroundColor: "#FEE2E2",
                                      borderRadius: 12,
                                      minHeight:25,
                                      textAlign: "center",
                                      float: "right",
                                      maxWidth: 80,
                                      minWidth: 80,
                                    }
                                  }
                                  >
                                    {parseFloat(
                                      index_data[object].percent.toFixed(2)
                                    )}%
                                  </Typography>
                                </td>
                              </tr>
                            </>
                          );
                        }
                      })}
                    </table>
                  </CardContent>
                </Card>
              </Grid>
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
              </TabPanel>
            </div>
          </Tabs>
        </div>
      </>
    );
  }
}
export default Table;
