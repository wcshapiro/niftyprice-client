import detectEthereumProvider from "@metamask/detect-provider";
import React, { useEffect, useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import { compress, decompress } from "compress-json";
import { stringify, parse } from "zipson";
import FancyHeader from "./FancyHeader.js";
import TableHeaders from "./TableHeaders.js"
import "./Wallet.css";
import TraitChart from "./TraitChart";
import { Helmet } from "react-helmet";
import HighchartsReact from "highcharts-react-official";
import HighStock from "highcharts/highstock";
import { Connectors } from "web3-react";
import { useWeb3Context, Web3Consumer } from "web3-react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import Web3Provider from "web3-react";
import Web3 from "web3";
import { ethers } from "ethers";
import { useContractCall } from "@usedapp/core";
import abi from "../contracts/np_abi.json";
import { Table } from "@material-ui/core";
import { isBoolean, isInteger } from "lodash";
import UserTable from "./UserTable.js";
import Portfolio from "./Portfolio";
const { InjectedConnector, NetworkOnlyConnector } = Connectors;
const MetaMask = new InjectedConnector({ supportedNetworks: [1, 4] });
let debug = false;
let current_version = "2.1";
const Infura = new NetworkOnlyConnector({
  providerURL: "https://mainnet.infura.io/v3/...",
});
const connectors = { MetaMask, Infura };
const etherscan_api_token = "VED3AM1CEXYQVZ2RYD3N6J5TPWNNUK6VT1";

const useStyles = makeStyles({
  footerCell: {
    borderBottom: "none",
  },
  header: {
    backgroundColor: "#fff",
    position: "sticky",
    left: 0,
    top: 0,
    background: "white",
    zIndex: 101,
  },
  stickyFooterCell: {
    borderTop: "2px solid black",
    // position: "sticky",
    bottom: 0,
    zIndex: 100,
    color: "black",
    fontWeight: "bold",
    fontSize: 15,
    align: "right",
  },
  alert: {
    minHeight: 50,
  },
  cell: {
    position: "relative",
    height: 160,
  },
  row: {
    maxWidth: 50,
    overflow: "auto",
  },
  root: {
    flexgrow: 1,
    // minHeight: 380,
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
  items: {
    marginBottom: 15,
  },
});

function numberWithCommas(x) {
  return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "---";
}
function Wallet() {
  const opensea_api_token = "c38932a3b50647cbb30d2f5601e81850";
  const ethereum = window.ethereum;
  const [addr, setAddr] = useState(null);
  const context = useWeb3Context();
  if (context.error) {
    console.error("Error!");
  }
  const [refresh_enable, setRefreshEnable] = useState(true);
  const [user_portfolio, setUserPortfolio] = useState({});
  var token_to_asset = {};
  var asset_to_token = {};
  var asset_from_contract = {};
  const [tokenMap, setTokenMap] = useState();
  const [currency, setCurrency] = useState("usd");
  const [valuation, setValuation] = useState("collection");
  const [is_eth, setIsEth] = useState(false);
  const [is_provider, setIsProvider] = useState(false);
  const [eth_provider, setEthProvider] = useState();
  const classes = useStyles();
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState();
  const [wallet_data, setWalletData] = useState([]);
  const [total_eth, setTotalEth] = useState();
  const [eth_price, setEth] = useState(null);
  const [client_data, setClientData] = useState();
  const [num_nft, setNumNFT] = useState();
  const [traits, setTraits] = useState({});
  const [trait_floors, setTraitFloors] = useState({});
  const [profit, setProfit] = useState();
  const [toggle_refresh, setToggleRefresh] = useState(false);
  const [triggerLoad, setTrigger] = useState(false);
  const [floor_map, setFloorMap] = useState({});
  const [rarity, setRarity] = useState();
  const [refresh_date, setRefreshDate] = useState(null);
  const [gwei_price, setGwei] = useState();
  const [user_data, setUser] = useState();
  const [fpp_chart_options, setChartOptionsFpp] = useState();
  const [table_options, setTableOptions] = useState();
  const [fpp_chart, setFloorChartOptionsFpp] = useState();
  const [final_portfolio_values, setFinalPortfolio] = useState({});
  const [day_change, setDayChange] = useState({});
  const [portfolio_loading, setPortfolioLoading] = useState(false);
  const [portfolio_loading_value, setPortfolioLoadingVal] = useState(0);
  const check_expiry = (time) => {
    let current_time = new Date().getTime();
    if (time) {
      let change = (current_time - time) / (1000 * 60 * 60 * 24);
      if (change > 1) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };
  const setParentCurrency = (currency) => {
    setCurrency(currency);
  };
  const setParentValuation = (valuation) => {
    setValuation(valuation);
  };
  const format_wallet = async (unformatted_wallet) => {
    let formatted_wallet = [];

    for (const row of unformatted_wallet) {
      let formatted_row = [...row];
      formatted_row[3] = { eth: row[3], usd: (typeof row[16] == "number") ? row[16] : 0};
      formatted_row[4] = { eth: row[4], usd: (typeof row[20] == "number") ? row[20] :0 };
      formatted_row[5] = { eth: row[5], usd: (typeof row[6] == "number") ? row[6]  :0 };
      formatted_row[7] = {
        eth: row[7],
        usd: isNaN(row[7]) ? 0 : row[7] * row[19],
      };
      formatted_row[9] = {
        eth: row[9],
        usd: isNaN(row[9]) ? 0 : row[9] * row[19],
      };
      formatted_row[11] = row[10]
      formatted_row[12] = { eth: row[12], usd: isNaN(row[14]) ? 0 : row[14] };
      formatted_row[17] = {
        eth: row[17],
        usd: isNaN(row[17]) ? 0 : row[17] * row[19],
      };
      formatted_wallet.push(formatted_row);
      
    }
    return formatted_wallet;
  };
  const pull_from_gcloud = async () => {
    setPortfolioLoading(true);
    setPortfolioLoadingVal(20);
    let url = debug
      ? "http://localhost:8080/load/:" + addr
      : "https://niftyprice.herokuapp.com/load/:" + addr;
    const result = await fetch(url)
      .then((resp) => resp.json())
      .then(async (data) => {
        if (data.status == 200) {
          setPortfolioLoadingVal(50);
          let formatted_wallet = await format_wallet(
            parse(data.message.account_portfolio)
          );
          setWalletData(formatted_wallet);
          // setWalletData(parse(data.message.account_portfolio));
          let loaded_portfolio = parse(data.message.account_data);
          let historical_perf = data.message.historical_perf;
          let last_refresh = data.message.last_refresh;
          loaded_portfolio["day_change"] = data.message.day_change;
          loaded_portfolio["historical_perf"] = historical_perf;
          loaded_portfolio["last_refresh"] = last_refresh;
          setFinalPortfolio(loaded_portfolio);
          setDayChange(data.message.day_change);
          let refresh_date_resp = new Date(
            data.message.created
          ).toLocaleString();
          setRefreshDate(refresh_date_resp);
          setRefreshEnable(true);
          setPortfolioLoadingVal(70);
          window.localStorage.setItem("version",current_version)
          setPortfolioLoading(false);
        } else {
          get_events();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const get_events = async () => {
    return new Promise((resolve, reject) => {
      
      let url = debug
        ? "http://localhost:8080/wallet/:" + addr
        : "https://niftyprice.herokuapp.com/wallet/:" + addr; //"http://localhost:8080/wallet/:" + addr; //
        const eventSource = new EventSource(url);
        eventSource.onmessage = (e) => {
          let status = e.data;
          if (status == "done") {
            eventSource.close();
            
            resolve(true)
          }
        };
        eventSource.onerror = (e) => {
          console.log("ERROR", e);
          eventSource.close();
          reject(false)
        };
      });
  };
  const refresh_events = async () => {
    return new Promise((resolve, reject) => {
      let url = debug
        ? "http://localhost:8080/wallet/:" + addr
        : "https://niftyprice.herokuapp.com/wallet/:" + addr; //"http://localhost:8080/wallet/:" + addr; //
      const response = fetch(url) //https://niftyprice.herokuapp.com/wallet/:
        .then((resp) => resp.json())
        .then((data) => {
          setEth(data.message.eth);
          setToggleRefresh(true);
          setClientData(data.message.info);
          resolve(data.message.info.message);
        })
        .catch((e) => {
          console.log(e);
          console.error(e.stack);
          reject(e);
        });
    });
  };
  const authenticate = async () => {
    var provider = await detectEthereumProvider();
    var address = "0x4ba0fC55646f6c82134CE3dc19aC64d02176e47c";
    var Contract = require("web3-eth-contract");
    Contract.setProvider(provider);
    var contract = new Contract(abi, address);
    if (addr) {
      contract.methods
        .isMember(addr)
        .call({ from: addr })
        .then((value) => {
          let check = isBoolean(value);
          check && setAuth(value);
        });
    }
  };

  const check_ethereum = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      setIsProvider(true);
      setEthProvider(provider);
    }
  };

  const gwei = async () => {
    var url =
      "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=" +
      etherscan_api_token;
    const gwei_data = await fetch(url);
    const gwei_price = await gwei_data.json();
    setGwei(gwei_price.result.ProposeGasPrice);
  };

  const connect_metamask = async () => {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    
    setAddr(accounts[0]); 
    
  };
  const refresh_data = async () => {
    setRefreshEnable(false);
    let url = debug
      ? "http://localhost:8080/refresh/:" + addr
      : "https://niftyprice.herokuapp.com/refresh/:" + addr;
    const eventSource = new EventSource(url);
    eventSource.onmessage = (e) => {
      let status = e.data;
      if (status == "done") {
        eventSource.close();
        

        pull_from_gcloud(); 
      }
    };
    eventSource.onerror = (e) => {
      console.log("ERROR", e);
      eventSource.close();
      return "ERROR";
    };
  };

  const disconnect_metamask = async () => {
    setAddr(null);
  };

  const purchase_premium = async () => {
    var provider = await detectEthereumProvider();
    var web3 = new Web3(provider);
    var address = "0x4ba0fC55646f6c82134CE3dc19aC64d02176e47c";
    var Contract = require("web3-eth-contract");
    Contract.setProvider(provider);
    var contract = new Contract(abi, address);
    if (addr) {
      contract.methods
        .register()
        .send({ from: addr, gas: 100000, value: web3.toWei(0.05, "ether") })
        .then((value) => {});
    }
  };

  const options = {
    fixedHeader: true,
    responsive: "scrollFullHeight",
    customTableBodyFooterRender: function (opts) {
      let numeric_columns = [3, 4, 5, 7, 9, 11, 17];
      let modded_columns = [3, 4, 5, 9];
      let summation_map = {};
      for (let i = 0; i < modded_columns.length; i++) {
        summation_map[modded_columns[i]] = opts.data.reduce((price, item) => {
          return (
            price +
            (parseFloat(
              item.data[modded_columns[i]].props.children[1]
                .toString()
                .replace(",", "")
            ) || 0)
          );
        }, 0);
      }

      summation_map[7] = opts.data.reduce((price, item) => {
        return (
          price +
          parseFloat(
            item.data[7].props.children.props.children[0].props.children.props.children[1]
              .toString()
              .replace(",", "")
          )
        );
      }, 0);
      try{summation_map[11] = opts.data.reduce((price, item) => {
        return (
          price +
          parseFloat(
            item.data[11].props.children.props.children[0].props.children.props.children[1]
              .toString()
              .replace(",", "")
          )
        );
      }, 0);}catch{summation_map[11]=0}
      
      // summation_map[13] = opts.data.reduce((price, item) => {
      //   return (
      //     price +
      //     parseFloat(
      //       item.data[13].props.children.props.children[0].props.children.props.children
      //         .toString()
      //         .replace(",", "")
      //     )
      //   );
      // }, 0);
      summation_map[17] = opts.data.reduce((price, item) => {
        return price + parseFloat(item.data[17].props.children[1].toString()
        .replace(",", ""));
      }, 0);

      return (
        <TableFooter className={classes.stickyFooterCell}>
          <TableRow>
            <TableCell colSpan={3} className={classes.stickyFooterCell}>
              Portfolio Totals:
            </TableCell>
            {opts.columns.map((item, i) => {
              if (numeric_columns.includes(i)) {
                return (
                  <>
                    <TableCell
                      align="right"
                      className={classes.stickyFooterCell}
                    >
                      {numberWithCommas(summation_map[i].toFixed(3))}
                    </TableCell>
                  </>
                );
              } else if (i < 3 || i > 8) {
              }
              // else {
              //   return (
              //     <>
              //       <TableCell
              //         align="right"
              //         className={classes.stickyFooterCell}
              //       >
              //         Coming Soon
              //       </TableCell>
              //     </>
              //   );
              // }
            })}
          </TableRow>
        </TableFooter>
      );
    },
    expandableRowsHeader: false,
    expandableRows: true,
    renderExpandableRow: (rowData, rowMeta) => {
      let data = {
        address: rowData[15].token_address,
        id: rowData[15].token_id,
        token: rowData[15].token_id,
        rowData: rowData,
        trait_data: rowData[15].trait_floors,
      };

      return (
        <>
          <TraitChart data={data} />
        </>
      );
    },
    rowsPerPage: 100,
    // sortOrder: sortObj.name
    //   ? sortObj
    //   : { name: "Floor Cap (ETH)", direction: "desc" },
    setTableProps: () => {
      return {
        size: "small",
      };
    },
    download: true,
    downloadOptions: {
      filterOptions: {
        useDisplayedColumnsOnly: true,
      },
      filename: "niftyprice_user_portfolio.csv",
    },
    selectableRowsHideCheckboxes: true,
  };
  useEffect(() => {
    authenticate();
  }, [addr]);

  useEffect(() => {
    check_ethereum();
  }, []);
  useEffect(() => {
    gwei();
  }, []);

  // useEffect(() => {
  //   get_assets();
  // }, []);
  useEffect(() => {
    if (addr && auth) {
      let version = window.localStorage.getItem("version");
      if (!version || version != current_version) {
        setPortfolioLoading(true);
        get_events().then((res) => {
          pull_from_gcloud();
        });
      } else {
        try {
          pull_from_gcloud().then((res) => {
            refresh_data();
          });
        } catch (e) {
          console.log("ERROR REFRESHING", e);
        }
      }

      // {
      //   pull_from_gcloud();
      // }
    }
  }, [addr, auth]);
  // useEffect(() => {
  //   if (addr && auth) {
  //     load_wallet().then(res=>pull_from_gcloud());
  //   }
  // }, [addr, auth,client_data]);

  if (loading) {
    return (
      <>
        <div class="loading">
          <CircularProgress />
        </div>
      </>
    );
  } else {
    var wallet_cols = [
      {
        name: "NFT",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            var img = tableMeta.rowData[18];
            return (
              <>
                <Grid container justifyContent="space-evenly">
                  <Grid item xs={4}>
                    <img src={img} class="image-snippet" alt="no img"></img>
                  </Grid>
                  <Grid item xs={8}>
                    <Grid container>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" align="left">
                          {tableMeta.rowData[0]}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          style={{
                            color: "#787878",

                            maxWidth: "40",
                          }}
                          variant="subtitle2"
                          align="left"
                        >
                          #{tableMeta.rowData[1].slice(0, 10)}
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
        name: "Token ID",
        options: { display: false, viewColumns: false, filter: false },
      },
      {
        name: "Date Purchased",

        options: {
          customHeadRender: (value, tableMeta) => {
            return (
              <>
                <TableCell className={classes.header}>
                <TableHeaders value={"Date Purchased"}/>
                </TableCell>
              </>
            );
            },
          setCellProps: () => ({ align: "right" }),
          customBodyRender: (value, tableMeta) => {
            let day = new Date(value).getUTCDate();
            let month = new Date(value).getUTCMonth() + 1;
            let year = new Date(value).getUTCFullYear();

            return <>{month + "/" + day + "/" + year}</>;
          },
        },
      },
      {
        name: "Purchase Price",
        options: {
          sortCompare: (order) => {
            return (obj1, obj2) => {
              let val1 = parseInt(obj1.data, 10);
              let val2 = parseInt(obj2.data, 10);
              return (val1 - val2) * (order === "asc" ? 1 : -1);
            };
          },
          customHeadRender: (value, tableMeta) => {
            return (
              <>
                <TableCell className={classes.header}>
                <TableHeaders value={"Purchase Price"}/>
                </TableCell>
              </>
            );
            },
          setCellProps: () => ({ align: "right" }),
          customBodyRender: (value) => {
            return (
              <>
                {currency == "usd" ? "$" : ""}
                {numberWithCommas(value[currency].toFixed(3))}
                {currency == "eth" ? "ETH" : ""}
              </>
            );
          },
        },
      },
      {
        name: "Gas Fee",
        options: {
          customHeadRender: (value, tableMeta) => {
            return (
              <>
                <TableCell className={classes.header}>
                <TableHeaders value={"Gas Fee"}/>
                </TableCell>
              </>
            );
            },
          setCellProps: () => ({ align: "right" }),
          customBodyRender: (value) => {
            return (
              <>
                {currency == "usd" ? "$" : ""}
                {value[currency].toFixed(3)}
                {currency == "eth" ? "ETH" : ""}
              </>
            );
          },
        },
      },
      {
        name: "Total Cost",
        options: {
          customHeadRender: (value, tableMeta) => {
            return (
              <>
                <TableCell className={classes.header}>
                <TableHeaders value={"Total Cost"}/>
                </TableCell>
              </>
            );
            },
          setCellProps: () => ({ align: "right" }),
          customBodyRender: (value) => {
            return (
              <>
                {currency == "usd" ? "$" : ""}
                {numberWithCommas(value[currency].toFixed(3))}
                {currency == "eth" ? "ETH" : ""}
              </>
            );
          },
        },
      },
      {
        name: "Total Cost (USD)",
        options: {
          setCellProps: () => ({ align: "right" }),
          customBodyRender: (value) => numberWithCommas(value.toFixed(2)),
          display: false,
          viewColumns: false,
          filter: false,
        },
      },
      {
        name: "Collection Floor",
        options: {
          customHeadRender: (value, tableMeta) => {
            return (
              <>
                <TableCell className={classes.header}>
                <TableHeaders value={"Collection Floor"}/>
                </TableCell>
              </>
            );
            },
          customBodyRender: (value, tableMeta) => {
            var floor_change = tableMeta.rowData[8];
            return (
              <>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" align="right">
                      {currency == "usd" ? "$" : ""}
                      {value[currency]
                        ? numberWithCommas(Number(value[currency]).toFixed(3))
                        : 0.0}
                      {currency == "eth" ? "ETH" : ""}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      style={
                        parseFloat(floor_change) > 0
                          ? {
                              color: "#065f46",
                              textAlign: "right",
                              float: "right",
                              maxWidth: 80,
                              minWidth: 80,
                              minHeight: 25,
                            }
                          : {
                              color: "#981b1b",
                              minHeight: 25,
                              textAlign: "right",
                              float: "right",
                              maxWidth: 80,
                              minWidth: 80,
                            }
                      }
                      variant="subtitle2"
                      align="right"
                    >
                      {floor_change.toFixed(2)}%
                    </Typography>
                  </Grid>
                </Grid>
              </>
            );
          },
        },
      },
      {
        name: "24H%",
        options: { display: false, viewColumns: false, filter: false },
      },
      {
        name: "Top Trait Floor",
        options: {
          customHeadRender: (value, tableMeta) => {
            return (
              <>
                <TableCell className={classes.header}>
                <TableHeaders value={"Top Trait Floor"}/>
                </TableCell>
              </>
            );
            },
          setCellProps: () => ({ align: "right" }),
          customBodyRender: (value) => {
            return (
              <>
                {currency == "usd" ? "$" : ""}
                {numberWithCommas(value[currency].toFixed(2))}
                {currency == "eth" ? "ETH" : ""}
              </>
            );
          },
        },
      },
      {
        name: "24H%",
        options: { display: false, viewColumns: false, filter: false },
      },

      {
        name: "Total Gain",
        options: {
          customHeadRender: (value, tableMeta) => {
            return (
              <>
                <TableCell className={classes.header}>
                <TableHeaders value={"Total Gain"}/>
                </TableCell>
              </>
            );
            },
          
          customBodyRender: (value, tableMeta) => {
            var gain_percent = tableMeta.rowData[12];
            if (value){
            return (
              <> 
                <Grid container>
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      align="right"
                      style={
                        parseFloat(value.number[currency][valuation]) > 0
                          ? {
                              color: "#065f46",
                              textAlign: "right",
                              float: "right",
                              maxWidth: 80,
                              minWidth: 80,
                              minHeight: 25,
                            }
                          : {
                              color: "#981b1b",
                              minHeight: 25,
                              textAlign: "right",
                              float: "right",
                              maxWidth: 80,
                              minWidth: 80,
                            }
                      }
                    >
                      {currency == "usd" ? "$" : ""}
                      {numberWithCommas(value.number[currency][valuation].toFixed(3))}

                      {currency == "eth" ? "ETH" : ""}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      style={
                        parseFloat(value.percent[currency][valuation]) > 0
                          ? {
                              color: "#065f46",
                              textAlign: "right",
                              float: "right",
                              maxWidth: 80,
                              minWidth: 80,
                              minHeight: 25,
                              fontWeight: "bold",
                            }
                          : {
                              color: "#981b1b",
                              minHeight: 25,
                              textAlign: "right",
                              float: "right",
                              maxWidth: 80,
                              minWidth: 80,
                              fontWeight: "bold",
                            }
                      }
                      variant="subtitle2"
                      align="right"
                    >
                      {numberWithCommas(value.percent[currency][valuation].toFixed(2))}%
                    </Typography>
                  </Grid>
                </Grid>
              </>
            );
          }
          else{return <><Typography variant="subtitle2"
          align="right">{"---"}</Typography></>}
          },
        },
      },
      {
        name: "%Gain (ETH)",
        options: { display: false, viewColumns: false, filter: false },
      },
      {
        name: "Total Gain (USD)",
        options: {
          setCellHeaderProps: () => ({
            style: {
              align: "right",
              right: 0,
            },
          }),
          display: false,
          viewColumns: false,
          filter: false,

          customBodyRender: (value, tableMeta) => {
            var gain_percent_usd = tableMeta.rowData[14];
            return (
              <>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      align="right"
                      style={
                        parseFloat(value) > 0
                          ? {
                              color: "#065f46",
                              textAlign: "right",
                              float: "right",
                              maxWidth: 80,
                              minWidth: 80,
                              minHeight: 25,
                            }
                          : {
                              color: "#981b1b",
                              minHeight: 25,
                              textAlign: "right",
                              float: "right",
                              maxWidth: 80,
                              minWidth: 80,
                            }
                      }
                    >
                      {numberWithCommas(value.toFixed(2))}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      style={
                        parseFloat(value) > 0
                          ? {
                              color: "#065f46",
                              textAlign: "right",
                              float: "right",
                              maxWidth: 80,
                              minWidth: 80,
                              minHeight: 25,
                            }
                          : {
                              color: "#981b1b",
                              minHeight: 25,
                              textAlign: "right",
                              float: "right",
                              maxWidth: 80,
                              minWidth: 80,
                            }
                      }
                      variant="subtitle2"
                      align="right"
                    >
                      {numberWithCommas(gain_percent_usd.toFixed(2))}%
                    </Typography>
                  </Grid>
                </Grid>
              </>
            );
          },
        },
      },
      {
        name: "%Gain (USD)",
        options: { display: false, viewColumns: false, filter: false },
      },
      {
        name: "Traits",
        options: { display: false, viewColumns: false, filter: false },
      },
      {
        name: "Etherscan Link",
        options: { display: false, viewColumns: false, filter: false },
      },
      {
        name: "Niftyprice Estimate",
        options: {
          setCellProps: () => ({ align: "right" }),
          setCellHeaderProps: () => ({
            style: {
              position: "sticky",
              left: 0,
              background: "blue",
              zIndex: 102,
            },
          }),

          customHeadRender: (value, tableMeta) => {
            return (
              <>
                <TableCell className={classes.header}>
                  <FancyHeader />
                </TableCell>
              </>
            );
          },
          customBodyRender: (value, tableMeta) => {
            return (
              <>
                {currency == "usd" ? "$" : ""}
                {numberWithCommas(Number(value[currency]).toFixed(2))}
                {currency == "eth" ? "ETH" : ""}
              </>
            );
          },
        },
      },
      {
        name: "Image",
        options: { display: false, viewColumns: false, filter: false },
      },
      {
        name: "Links",
        options: {
          customBodyRender: (value, tableMeta) => {
            return (
              <>
                <div class="links">
                  {/* <a class="etherscan-link">{tableMeta.rowData.token_address} </a> */}
                  <a
                    class="np-link"
                    target="_blank"
                    href={`https://www.niftyprice.io/collections/${tableMeta.rowData[15].collection_slug}`}
                  ></a>
                  <a
                    class="opensea-link"
                    target="_blank"
                    href={`https://opensea.io/assets/${tableMeta.rowData[15].token_address}/${tableMeta.rowData[15].token_id}`}
                  >
                    {" "}
                  </a>
                </div>
              </>
            );
          },
        },
      },
      {
        name: "Rarity",
        options: { display: false, viewColumns: false, filter: false },
      },
    ];
    return (
      <>
        <Helmet htmlAttributes>
          <html lang="en" />
          <title>NiftyPrice Premium - NFT Portfolio Tracker</title>
          <meta
            name="description"
            content={
              "NiftyPrice’s NFT portfolio tracker allows you to track the profit and loss of your NFT portfolio in real-time. View NFT portfolio value based on collection floor, trait floor, average, or custom. Manage and evaluate your NFT portfolio live."
            }
          />
        </Helmet>
        <Grid item xs={12} style={{ backgroundColor: "#d6ceb6" }}>
          <Typography
            variant="subtitle1"
            style={{
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            {" "}
            Beta Product! We are working quickly to include many new features.
            Just added: Trait floors, Trait rarity, floor price analysis,
            historical portfolio performance and more!
          </Typography>
        </Grid>
        <Grid container justifyContent="space-evenly">
          <div class="wallet-content">
            <div class="wallet-cards">
              <Grid container justifyContent="space-evenly">
                <Grid item xs={12} align="right">
                  {!addr && is_provider ? (
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "#1C72D9", color: "#FFFFFF" }}
                      onClick={connect_metamask}
                      id="menu-button"
                    >
                      Connect to Metamask
                    </Button>
                  ) : (
                    ""
                    // <Button
                    //   variant="contained"
                    //   style={{backgroundColor: '#1C72D9', color: '#FFFFFF'}}
                    //   onClick={disconnect_metamask}
                    //   id="menu-button"
                    // >
                    //   Disconnect
                    // </Button>
                  )}
                </Grid>
              </Grid>
              <Grid container justifyContent="space-evenly" spacing={4}>
                <Grid item xs={12}>
                  <Grid container justifyContent="space-evenly" spacing={2}>
                    {!is_provider ? (
                      <>
                        <Grid item xs={12} align="right">
                          <Button
                            variant="contained"
                            style={{
                              backgroundColor: "#1C72D9",
                              color: "#FFFFFF",
                            }}
                            id="menu-button"
                            href="https://metamask.io/download"
                          >
                            Download metaMask Extension
                          </Button>
                        </Grid>
                      </>
                    ) : !auth && addr ? (
                      <>
                        <Grid item xs={12} align="right">
                          <Button
                            variant="contained"
                            style={{
                              backgroundColor: "#1C72D9",
                              color: "#FFFFFF",
                            }}
                            id="menu-button"
                            onClick={purchase_premium}
                          >
                            Get Premium for .05 ETH
                          </Button>
                        </Grid>
                      </>
                    ) 
                    // : auth && !wallet_data ? (
                    //   <>
                    //     <Grid container justifyContent="space-between">
                    //       <Grid item xs={12} className={classes.items}>
                    //         <CircularProgress />
                    //       </Grid>
                    //     </Grid>
                    //   </>
                    // ) 
                    : !auth ? (
                      <></>
                    ) : 
                    (
                      <>
                        {portfolio_loading || loading || (auth && !wallet_data) ? (
                          <>
                            <Grid container justifyContent="space-between">
                              <Grid item xs={12} className={classes.items}>
                                <LinearProgress
                                  variant="determinate"
                                  value={portfolio_loading_value}
                                />
                                <Typography>
                                  Analyzing portfolio. This might take a few
                                  minutes...
                                </Typography>
                              </Grid>
                            </Grid>
                          </>
                        ) : (
                          <>
                            <Grid item xs={12} align="right">
                              {refresh_date ? (
                                <Typography>
                                  Last Refreshed: {refresh_date}
                                </Typography>
                              ) : (
                                <></>
                              )}

                              <Button
                                variant="contained"
                                style={
                                  !refresh_enable
                                    ? {
                                        backgroundColor: "#D3D3D3",
                                        color: "#FFFFFF",
                                      }
                                    : {
                                        backgroundColor: "#1C72D9",
                                        color: "#FFFFFF",
                                      }
                                }
                                onClick={refresh_data}
                                id="menu-button"
                                disabled={!refresh_enable}
                              >
                                {refresh_enable ? "REFRESH DATA" : "REFRESHING"}
                              </Button>
                            </Grid>
                            <Portfolio
                              portfolio_metrics={final_portfolio_values}
                              setParentCurrency={setParentCurrency}
                              setParentValuation={setParentValuation}
                            />
                            
                          </>
                        )}
                      </>
                    )}
                  </Grid>
                  {/* </CardContent>
                          </Card> */}
                </Grid>
              </Grid>
            </div>
            <Grid item xs={12}>
              <div class="wallet-table">
                <MUIDataTable
                  title={"Wallet"}
                  data={wallet_data}
                  columns={wallet_cols}
                  options={options}
                />
              </div>
            </Grid>
          </div>
        </Grid>
      </>
    );
  }
}
export default Wallet;
