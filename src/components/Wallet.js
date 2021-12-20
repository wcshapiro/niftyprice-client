import detectEthereumProvider from "@metamask/detect-provider";
import React, { useEffect, useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
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
const { InjectedConnector, NetworkOnlyConnector } = Connectors;
const MetaMask = new InjectedConnector({ supportedNetworks: [1, 4] });

const Infura = new NetworkOnlyConnector({
  providerURL: "https://mainnet.infura.io/v3/...",
});
const connectors = { MetaMask, Infura };
const etherscan_api_token = "VED3AM1CEXYQVZ2RYD3N6J5TPWNNUK6VT1";

const useStyles = makeStyles({
  footerCell: {
    borderBottom: "none",
  },
  stickyFooterCell: {
    position: "sticky",
    bottom: 0,
    zIndex: 100,
    color: "black",
    fontWeight: "bold",
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
  const [user_portfolio, setUserPortfolio] = useState({});
  var token_to_asset = {};
  var asset_to_token = {};
  var asset_from_contract = {};
  const [tokenMap, setTokenMap] = useState();
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
  const [profit, setProfit] = useState();
  const [triggerLoad,setTrigger]=useState(false)
  const [floor_map, setFloorMap] = useState({});
  const [rarity, setRarity] = useState();
  const [gwei_price, setGwei] = useState();
  const [fpp_chart_options, setChartOptionsFpp] = useState();
  const [table_options, setTableOptions] = useState();
  const [fpp_chart, setFloorChartOptionsFpp] = useState();
  const [final_portfolio_values, setFinalPortfolio] = useState({});
  const [portfolio_loading,setPortfolioLoading]=useState(false)
  const get_events = async () => {
    setPortfolioLoading(true)
    console.log("grabbing wallet_data");
    var saved_table = JSON.parse(window.localStorage.getItem("wallet_data"));
    var saved_portfolio = JSON.parse(
      window.localStorage.getItem("final_portfolio")
    );
    console.log("saved data", saved_table);
    console.log("saved_portfolio", saved_portfolio);
    if ((!saved_table)||(!saved_portfolio)) {
      return new Promise((resolve, reject) => {
        let url ="https://niftyprice.herokuapp.com/wallet/:" + addr; // "http://localhost:8080/wallet/:" + addr; //
        const response = fetch(url) //https://niftyprice.herokuapp.com/wallet/:
          .then((resp) => resp.json())
          .then((data) => {
            setEth(data.message.eth);
            setClientData(data.message.info);
            resolve(data.message.info);
            console.log("client data", data.message.info);
          })
          .catch((e) => {
            console.log(e);
            console.error(e.stack);
            reject(e);
          });
      });
    } else {
      setWalletData(saved_table);
      setFinalPortfolio(saved_portfolio);
      setPortfolioLoading(false)

    }
  };

  // const get_assets = async () => {
  //   return new Promise((resolve, reject) => {
  //     let url = "http://localhost:8080/portfolio/:" + addr; //"https://niftyprice.herokuapp.com/wallet/:" + addr; //
  //     const response = fetch(url) //https://niftyprice.herokuapp.com/wallet/:
  //       .then((resp) => resp.json())
  //       .then((data) => {
  //         setEth(data.message.eth);
  //         setClientData(data.message.info);
  //         resolve(client_data);
  //       })
  //       .catch((e) => {
  //         console.log(e);
  //         console.error(e.stack);
  //         reject(e);
  //       });
  //   });
  // };

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
          console.log("AUTH",value)
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
  const [userTable, setUserTable] = useState(() => {
    // getting stored value
    const saved = JSON.parse(window.localStorage.getItem("userTable"));
    const initialValue = saved;
    return initialValue || {};
  });

  const gwei = async () => {
    var url =
      "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=" +
      etherscan_api_token;
    const gwei_data = await fetch(url);
    const gwei_price = await gwei_data.json();
    setGwei(gwei_price.result.ProposeGasPrice);
  };

  const connect_metamask = async () => {
    const accounts = await ethereum.send("eth_requestAccounts");
    setAddr(accounts.result[0]);
    // setAddr("0x52e14e8dfc87e8875ce5e9a94019f497b82b3e01") // me
    // setAddr("0x64b2C1C1686D9A78f11A5fD625FcBaBf9238f886") //np_auth
    // setAddr("0x5e4c7b1f6ceb2a71efbe772296ab8ab9f4e8582c"); //chris
    // setAddr("0x13d33c9f2F3E7F8f14B1ee0988F4DC929Ee87a92"); // brojack

    setTrigger(true)
  };
  const refresh_data = async () => {
    window.localStorage.setItem("wallet_data", JSON.stringify(null));
    window.localStorage.setItem("final_portfolio", JSON.stringify(null));
    setWalletData([])
    setFinalPortfolio({});
    setClientData(null);
    setTrigger(true)


  };

  const disconnect_metamask = async () => {
    setAddr(null);
    // setAddr("0x5e4c7b1f6ceb2a71efbe772296ab8ab9f4e8582c");
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
  const load_wallet = async () => {
    console.log("checking to run with ", client_data);
    if (client_data && client_data.data) {
      var data = client_data.data.asset_events;
      let full_portfolio = { current: {}, past: {} };
      for (const element of data) {
        let asset = element.asset;
        if (element.transaction) {
          var params = [element.transaction.transaction_hash];
          const transaction_data = await ethereum.request({
            method: "eth_getTransactionByHash",
            params: params,
          });
          var trans_hash_data = await transaction_data;
          element["transaction_info"] = trans_hash_data;

          if (Object.keys(full_portfolio.current).includes(asset.id.toString())) {
            full_portfolio.past[asset.id] = [
              full_portfolio.current[asset.id],
              asset,
            ];
            delete full_portfolio.current[asset.id]
          } else {
            full_portfolio.current[asset.id] = element;
          }
        }
      }
      let temp_wallet = [];
      let collection_map = {};
      for (const nft of Object.values(full_portfolio.current)) {
        let floor = null;
        let change = null;
        let slug = nft.asset.collection.slug;
        let collection_url =
          "https://api.opensea.io/api/v1/collection/" + slug + "/stats";
        if (collection_map[slug]) {
          floor = collection_map[slug].floor;
          change = collection_map[slug].change;
        } else {
          floor = await fetch(collection_url)
            .then((resp) => resp.json())
            .then((data) => {
              collection_map[slug] = {
                floor: data.stats.floor_price,
                change: data.stats.one_day_change,
              };
            })
            .catch((e) => console.log("error", e));
        }
        let paid_price =
          parseFloat(Number(nft.transaction_info.value), 16) /
          1000000000000000000;
        let gas_fee =
          parseFloat(Number(nft.transaction_info.gas, 16)) *
          0.000000001 *
          parseFloat(Number(nft.transaction_info.gasPrice, 16)) *
          0.000000001;
        temp_wallet.push([
          nft.asset.name ||nft.asset.collection.name|| 0,
          nft.asset.token_id || 0,
          nft.transaction.timestamp || 0,
          paid_price || 0,
          gas_fee || 0,
          gas_fee + paid_price || 0,
          gas_fee + paid_price * eth_price || 0,
          collection_map[slug].floor || 0,
          collection_map[slug].change || 0,
          "Coming Soon" || 8,
          "Coming Soon" || 9,
          collection_map[slug].floor - (paid_price + gas_fee) || 10,
          ((collection_map[slug].floor - (paid_price + gas_fee)) /
            (paid_price + gas_fee)) *
            100 || 11,
          (collection_map[slug].floor - (paid_price + gas_fee)) * eth_price ||
            12,
          ((collection_map[slug].floor - (paid_price + gas_fee)) /
            (paid_price + gas_fee)) *
            100 || 13,
          nft || null,
          "etherscan" || 15,
          200 || 16, //total
          nft.asset.image_thumbnail_url || 17,
          "clean name" || 18,
          200 || 19, //rarity
        ]);
      }
      setWalletData(temp_wallet);
      // console.log("WALLET", wallet_data);
      window.localStorage.setItem("wallet_data", JSON.stringify(temp_wallet));
      let summation_map = {};
      let numeric_columns = [3, 4, 5, 6, 7, 11, 13];

      for (let i = 0; i < numeric_columns.length; i++) {
        summation_map[numeric_columns[i]] = temp_wallet.reduce(
          (price, item) => {
            return price + parseFloat(item[numeric_columns[i]]);
          },
          0
        );
      }
      let final_portfolio = {
        "Value (USD)": summation_map[7] * eth_price,
        "Value (ETH)": summation_map[7],
        "# NFTs": temp_wallet.length,
        "Total Cost (USD)": summation_map[6],
        "Gain (ETH)": summation_map[7],
        "Gain (USD)": summation_map[13],
        "%Gain": summation_map[11],
      };
      window.localStorage.setItem(
        "final_portfolio",
        JSON.stringify(final_portfolio)
      );
      setPortfolioLoading(false)
      setFinalPortfolio(final_portfolio);


    }
    // if (false) {
    //   if (addr != null && data != undefined && data.data) {
    //     var total_val = 0;
    //     var profits = 0;
    //     var curr_data = [];
    //     var table_data_object = {};
    //     var table_data_list = [];
    //     var token_ids = [];
    //     var data = data.data;
    //     var assets = {};
    //     for (const asset of data.asset_events) {
    //       if (asset.transaction && asset.event_type == "transfer") {
    //         if (Object.keys(assets).includes(asset.asset.id.toString())) {
    //           delete table_data_object[Number(asset.asset.id)];
    //         } else {
    //           assets[asset.asset.id] = true;
    //           var image = asset.asset.image_thumbnail_url;
    //           var slug = asset.collection_slug;
    //           var asset_name = asset.asset.name
    //             ? asset.asset.name.split("#")[0]
    //             : asset.asset.collection.name;
    //           var url =
    //             slug == "art-blocks-factory" || slug == "art-blocks"
    //               ? "https://niftyprice.herokuapp.com/floor/:" + asset_name
    //               : "https://api.opensea.io/api/v1/collection/" +
    //                 slug +
    //                 "/stats";
    //
    //           var transaction_hash = asset.transaction.transaction_hash;
    //           var transaction_date = asset.transaction.timestamp;

    //           const floor_price = await fetch(url);
    //           var data = await floor_price.json();
    //           var collection_floor_price = data.stats.floor_price;
    //           total_val += parseFloat(collection_floor_price)
    //             ? parseFloat(collection_floor_price)
    //             : 0;
    //           setTotalEth(total_val);

    //           var params = [transaction_hash];
    //           const transaction_data = await ethereum.request({
    //             method: "eth_getTransactionByHash",
    //             params: params,
    //           });
    //           var trans_hash_data = await transaction_data;
    //
    //           var paid_price =
    //             parseFloat(Number(trans_hash_data.value), 16) /
    //             1000000000000000000;
    //           var gas_used = (
    //             parseFloat(Number(trans_hash_data.gas, 16)) *
    //             0.000000001 *
    //             parseFloat(Number(trans_hash_data.gasPrice, 16)) *
    //             0.000000001
    //           ).toFixed(4);
    //           var profit_percent =
    //             (parseFloat(collection_floor_price) /
    //               (paid_price + parseFloat(gas_used))) *
    //             100;
    //           var profit =
    //             collection_floor_price -
    //             paid_price -
    //             parseFloat(Number(trans_hash_data.gas, 16)) *
    //               0.000000001 *
    //               parseFloat(Number(trans_hash_data.gasPrice, 16)) *
    //               0.000000001;
    //           profits += profit;
    //           var asset_url =
    //             "https://api.opensea.io/api/v1/asset/" +
    //             asset.contract_address +
    //             "/" +
    //             asset.asset.token_id +
    //             "/";
    //           const asset_data = await fetch(asset_url);
    //           const asset_response = await asset_data.json();
    //           console.log("ASSET", asset_response);
    //           var total_supply = asset_response.collection.stats.total_supply;
    //           var floor_day_change = 0;
    //           var trait_floor = "Coming Soon";
    //           var trait_day_change = "Coming Soon";
    //           var total_rarity = 0;
    //           var index = 0;
    //           for (const element of asset_response.traits) {
    //             // console.log(element);
    //             total_rarity += element.trait_count / total_supply;
    //             index += 1;
    //           }
    //           total_rarity = total_rarity / index;
    //           // setRarity(total_rarity);
    //           table_data_object[asset.asset.id] = {
    //             name: asset_name,
    //             token_id: asset.asset.token_id,
    //             date: transaction_date,
    //             cost: paid_price.toFixed(4),
    //             gas_used: gas_used,
    //             total_cost: parseFloat(gas_used) + parseFloat(paid_price),
    //             total_cost_usd:
    //               (parseFloat(gas_used) + parseFloat(paid_price)) * eth_price,
    //             collection_floor: collection_floor_price,
    //             floor_day_change: floor_day_change,
    //             trait_floor: trait_floor,
    //             trait_day_change: trait_day_change,
    //             gain_eth: profit.toFixed(4),
    //             gain_eth_percent: profit_percent.toFixed(2),
    //             gain_usd: profit.toFixed(4) * eth_price.toFixed(2),
    //             gain_usd_percent: profit_percent.toFixed(2),
    //             profit: profit.toFixed(4),
    //             traits: asset_response.traits,
    //             total: total_supply,
    //             clean_name: asset_name,
    //             total_rarity: total_rarity,
    //             image: image,
    //           };
    //         }
    //       }
    //     }
    //     let series_list = [];
    //     var floor_vals_map = {};
    //     for (const nft of Object.values(table_data_object)) {
    //       console.log("VALUES", Object.values(nft));
    //       let date = new Date(Object.values(nft)[2]);
    //       let url =
    //         "https://niftyprice.herokuapp.com/collections/:" +
    //         Object.values(nft)[0]; // https://niftyprice.herokuapp.com/wallet/:
    //       var response = fetch(url)
    //         .then((response) => {
    //           response.json().then((res) => {
    //             if (res.status == 200 && res.message) {
    //               var nft_data = res;
    //               console.log(nft_data.message);
    //               // console.log(nft_data);
    //               var nft_vals = [];
    //               var floor_vals = [];

    //               for (const entry of nft_data.message) {
    //                 let entry_date = new Date(entry.date);
    //                 let totalvals = [
    //                   entry_date.getTime(),
    //                   parseFloat(entry.floorpurchaseprice),
    //                 ];
    //                 floor_vals.push(totalvals);
    //                 if (entry_date > date) {
    //                   let curr_val =
    //                     parseFloat(entry.floorpurchaseprice) * eth_price;
    //                   let vals = [entry_date.getTime(), curr_val];
    //                   nft_vals.push(vals);
    //                 }
    //               }
    //               console.log("pushing list");
    //               series_list.push({
    //                 name: Object.values(nft)[0],
    //                 data: nft_vals,
    //               });
    //               let temp_floor_map = floor_map;
    //               temp_floor_map[Object.values(nft)[0]] = floor_vals;
    //               setFloorMap(temp_floor_map);
    //               table_data_list.push(Object.values(nft));
    //             }
    //           });
    //         })
    //         .catch((error) => console.log("error", error));

    //       // console.log(Object.entries(nft_history));
    //     }
    //     setChartOptionsFpp({
    //       title: {
    //         text: "Portfolio Value",
    //       },
    //       series: series_list,
    //     });
    //     console.log("chart set", series_list);
    //     setNumNFT(table_data_list.length);
    //     // setTokenMap(token_to_asset);
    //     // setTraits(asset_traits);

    //     setProfit(profits);
    //     setWalletData(table_data_list);
    //     // console.log("OBJECT AHAH");
    //   } else {
    //     setWalletData([]);
    //     console.log("set blank wallet");
    //   }
    //   ethereum.on("accountsChanged", function (accounts) {
    //     // console.log(accounts[0]);
    //     setAddr(accounts[0]);
    //     // setAddr("0x52e14e8dfc87e8875ce5e9a94019f497b82b3e01")
    //   });
    // }
  };

  const options = {
    customTableBodyFooterRender: function (opts) {
      let numeric_columns = [3, 4, 5, 6, 7, 11, 13];
      let summation_map = {};
      console.log("OPTS", opts);
      for (let i = 0; i < numeric_columns.length; i++) {
        summation_map[numeric_columns[i]] = opts.data.reduce((price, item) => {
          return price + parseFloat(item.data[numeric_columns[i]]);
        }, 0);
      }

      summation_map[7] = opts.data.reduce((price, item) => {
        return (
          price +
          parseFloat(
            item.data[7].props.children.props.children[0].props.children.props
              .children
          )
        );
      }, 0);
      summation_map[11] = opts.data.reduce((price, item) => {
        return (
          price +
          parseFloat(
            item.data[11].props.children.props.children[0].props.children.props
              .children
          )
        );
      }, 0);
      summation_map[13] = opts.data.reduce((price, item) => {
        return (
          price +
          parseFloat(
            item.data[13].props.children.props.children[0].props.children.props
              .children
          )
        );
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
                      <p>{numberWithCommas(summation_map[i].toFixed(3))}</p>
                    </TableCell>
                  </>
                );
              } else if (i < 3 || i > 8) {
              } else {
                return (
                  <>
                    <TableCell
                      align="right"
                      className={classes.stickyFooterCell}
                    >
                      Coming Soon
                    </TableCell>
                  </>
                );
              }
            })}
          </TableRow>
        </TableFooter>
      );
    },
    expandableRowsHeader: false,
    expandableRows: true,
    renderExpandableRow: (rowData, rowMeta) => {
      console.log("WALLET ROWDATA", rowData[15]);
      let data = {
        address: rowData[15].asset.asset_contract.address,
        token: rowData[15].asset.token_id,
        rowData: rowData,
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
    download: false,
    selectableRowsHideCheckboxes: true,
    responsive: "standard",
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
  useEffect(() => {
    if (addr && triggerLoad && auth) {
      get_events();
      setTrigger(false)
    }
  }, [auth,addr,triggerLoad]);

  // useEffect(() => {
  //   get_assets();
  // }, []);
  useEffect(() => {
    if (addr && auth) {
      load_wallet();
    }
  }, [addr, auth, client_data]);

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
                            "text-decoration": "underline",
                            maxWidth: "40",
                          }}
                          variant="subtitle2"
                          align="left"
                        >
                          {tableMeta.rowData[1].slice(0, 10)}
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
          setCellProps: () => ({ align: "right" }),
          customBodyRender: (value, tableMeta) => {
            let day = new Date(value).getUTCDate();
            let month = new Date(value).getUTCMonth();
            let year = new Date(value).getUTCFullYear();

            return <>{day + "/" + month + "/" + year}</>;
          },
        },
      },
      {
        name: "Purchase Price (ETH)",
        options: {
          setCellProps: () => ({ align: "right" }),
          customBodyRender: (value) => value.toFixed(3),
        },
      },
      {
        name: "Gas Fee (ETH)",
        options: {
          setCellProps: () => ({ align: "right" }),
          customBodyRender: (value) => value.toFixed(3),
        },
      },
      {
        name: "Total Cost (ETH)",
        options: {
          setCellProps: () => ({ align: "right" }),
          customBodyRender: (value) => value.toFixed(3),
        },
      },
      {
        name: "Total Cost (USD)",
        options: {
          setCellProps: () => ({ align: "right" }),
          customBodyRender: (value) => value.toFixed(3),
        },
      },
      {
        name: "Collection Floor (ETH)",
        options: {
          customBodyRender: (value, tableMeta) => {
            var floor_change = tableMeta.rowData[8];
            return (
              <>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" align="right">
                      {value.toFixed(3)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      style={{
                        color: "#787878",
                        "text-decoration": "underline",
                      }}
                      variant="subtitle2"
                      align="right"
                    >
                      {floor_change.toFixed(3)}%
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
        name: "Top Trait Floor (ETH)",
        options: { setCellProps: () => ({ align: "right" }) },
      },
      {
        name: "24H%",
        options: { display: false, viewColumns: false, filter: false },
      },

      {
        name: "Total Gain (ETH)",
        options: {
          customBodyRender: (value, tableMeta) => {
            var gain_percent_eth = tableMeta.rowData[12];
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
                      {numberWithCommas(value.toFixed(3))}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      style={
                        parseFloat(gain_percent_eth) > 0
                          ? {
                              color: "#065f46",
                              textAlign: "center",
                              float: "right",
                              maxWidth: 80,
                              minWidth: 80,
                              minHeight: 25,
                              "text-decoration": "underline",
                            }
                          : {
                              color: "#981b1b",
                              minHeight: 25,
                              textAlign: "center",
                              float: "right",
                              maxWidth: 80,
                              minWidth: 80,
                              "text-decoration": "underline",
                            }
                      }
                      variant="subtitle2"
                      align="right"
                    >
                      {numberWithCommas(gain_percent_eth.toFixed(3))}%
                    </Typography>
                  </Grid>
                </Grid>
              </>
            );
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
                      {value.toFixed(3)}
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
                              "text-decoration": "underline",
                            }
                          : {
                              color: "#981b1b",
                              minHeight: 25,
                              textAlign: "right",
                              float: "right",
                              maxWidth: 80,
                              minWidth: 80,
                              "text-decoration": "underline",
                            }
                      }
                      variant="subtitle2"
                      align="right"
                    >
                      {numberWithCommas(gain_percent_usd.toFixed(3))}%
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
        name: "Total",
        options: { display: false, viewColumns: false, filter: false },
      },
      {
        name: "Image",
        options: { display: false, viewColumns: false, filter: false },
      },
      {
        name: "Clean Name",
        options: { display: false, viewColumns: false, filter: false },
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
              "NiftyPrice’s portfolio tracker allows you to track the profit and loss of your NFT portfolio in real-time. View value by collection floor, trait floor, average, or custom."
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
            Just added: rarity tracking, floor price analysis, historical
            portfolio performance and more!
          </Typography>
        </Grid>
        <Grid container justifyContent="space-evenly">
          <div class="wallet-content">
            <div class="wallet-cards">
              <Grid container justifyContent="center">
                <Grid item xs={4}>
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
                <Grid item xs={12} lg={5}>
                  <Card className={classes.root} elevation={5}>
                    <CardContent>
                      <Grid container justifyContent="space-between">
                        <Grid item xs={12} className={classes.items}>
                          <Typography variant="h4" align="center">
                            Portfolio Stats
                          </Typography>
                          <hr></hr>
                        </Grid>
                        {!is_provider ? (
                          <>
                            <Grid
                              container
                              justifyContent="space-evenly"
                              spacing={4}
                            >
                              <Grid item xs={12}>
                                Please download metamask extension to enable
                                this feature!
                              </Grid>
                              <Grid item xs={12}>
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
                            </Grid>
                          </>
                        ) : (!auth && addr) ? (
                          <>
                            <Grid
                              container
                              justifyContent="space-evenly"
                              spacing={4}
                            >
                              <Grid item>
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
                            </Grid>
                          </>
                        ) : auth && !wallet_data ? (
                          <>
                            <Grid container justifyContent="space-between">
                              <Grid item xs={12} className={classes.items}>
                                <CircularProgress />
                              </Grid>
                            </Grid>
                          </>
                        ) : !auth ? (
                          <>
                            
                          </>
                        ) : (
                          <>
                            <Grid container justifyContent="space-between">
                              <Grid item xs={12} className={classes.items}>
                                <Typography
                                  inline
                                  variant="subtitle1"
                                  align="center"
                                >
                                  Wallet Address
                                </Typography>
                              </Grid>
                              <Grid item xs={12} className={classes.items}>
                                <Typography
                                  inline
                                  variant="subtitle2"
                                  align="center"
                                >
                                  {addr || "---"}
                                </Typography>
                              </Grid>
                            </Grid>
                            {portfolio_loading?(<>
                              <Grid container justifyContent="space-between">
                              <Grid item xs={12} className={classes.items}>
                                <CircularProgress />
                              </Grid>
                            </Grid>
                            </>)
                            :(<>
                            <Grid item xs={12}>
                            <Button
                              variant="contained"
                              style={{
                                backgroundColor: "#1C72D9",
                                color: "#FFFFFF",
                              }}
                              onClick={refresh_data}
                              id="menu-button"
                            >
                              Refresh Data
                            </Button>
                            </Grid>
                            {Object.keys(final_portfolio_values).map(
                              (object, index) => {
                                return (
                                  <>
                                    <Grid
                                      container
                                      justifyContent="space-between"
                                    >
                                      <Grid
                                        item
                                        xs={6}
                                        className={classes.items}
                                      >
                                        <Typography
                                          inline
                                          variant="subtitle1"
                                          align="left"
                                        >
                                          {object}
                                        </Typography>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        className={classes.items}
                                      >
                                        <Typography
                                          inline
                                          variant="subtitle1"
                                          align="right"
                                        >
                                          {isInteger(
                                            final_portfolio_values[object]
                                          )
                                            ? numberWithCommas(
                                                final_portfolio_values[object]
                                              )
                                            : numberWithCommas(
                                                final_portfolio_values[
                                                  object
                                                ].toFixed(3)
                                              )}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </>
                                );
                              }
                            )}
                            </>)
                            }
                            
                          </>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} lg={5}>
                  <HighchartsReact
                    class="chart"
                    containerProps={{ style: { width: "100%" } }}
                    highcharts={HighStock}
                    constructorType={"stockChart"}
                    options={fpp_chart_options}
                  />
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
