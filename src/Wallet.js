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
import HighchartsReact from "highcharts-react-official";
import HighStock from "highcharts/highstock";
import { Connectors } from "web3-react";
import { useWeb3Context, Web3Consumer } from "web3-react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Web3Provider from "web3-react";
import Web3 from "web3";
import { ethers } from "ethers";
import { useContractCall } from "@usedapp/core";
import abi from "./contracts/np_abi.json";
import { Table } from "@material-ui/core";
import { isBoolean } from "lodash";

const { InjectedConnector, NetworkOnlyConnector } = Connectors;
const MetaMask = new InjectedConnector({ supportedNetworks: [1, 4] });

const Infura = new NetworkOnlyConnector({
  providerURL: "https://mainnet.infura.io/v3/...",
});
const connectors = { MetaMask, Infura };
const etherscan_api_token = "VED3AM1CEXYQVZ2RYD3N6J5TPWNNUK6VT1";

const useStyles = makeStyles({
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
    minHeight: 380,
    maxHeight: 380,
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
  // console.log(context);
  if (context.error) {
    console.error("Error!");
  }
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
  const [floor_map, setFloorMap] = useState({});
  const [rarity, setRarity] = useState();
  const [gwei_price, setGwei] = useState();
  const [fpp_chart_options, setChartOptionsFpp] = useState();
  const [fpp_chart, setFloorChartOptionsFpp] = useState();
  const get_eth = async () => {
    return new Promise((resolve, reject) => {
      const response = fetch("https://niftyprice.herokuapp.com/wallet/:" + addr) //https://niftyprice.herokuapp.com/wallet/:
        .then((resp) => resp.json())
        .then((data) => {
          setEth(data.message.eth);
          setClientData(data.message.info);
          resolve(client_data);
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
      // console.log("provider");
      // console.log(provider);
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
    const accounts = await ethereum.send("eth_requestAccounts");
    setAddr(accounts.result[0]);
    // setAddr("0x5e4c7b1f6ceb2a71efbe772296ab8ab9f4e8582c");
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
    // console.log("PURCHASING PREMIUM");
    if (addr) {
      contract.methods
        .register()
        .send({ from: addr, gas: 100000, value: web3.toWei(0.05, "ether") })
        .then((value) => {
          // console.log("RETURN VAL", value);
        });
    }
  };
  const loadAsyncData = async () => {
    // setLoading(true);
    var data = client_data;
    if (ethereum) {
      // console.log("CLIENT", data);
      if (addr != null && data != undefined && data.data) {
        // console.log(accounts.result[0])
        // setAddr(accounts.result[0]);
        // console.log(accounts.result);
        var total_val = 0;
        var profits = 0;
        // 0x197b52e6c70cebe4aaca53537cc93f78b0e1c601
        // let addr = "0x5e4c7b1f6ceb2a71efbe772296ab8ab9f4e8582c";
        var curr_data = [];
        var table_data_object = {};
        var table_data_list = [];
        var token_ids = [];
        // var headers = {
        //   "Access-Control-Allow-Origin": "http, https",
        //   "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTONS",
        //   "Access-Control-Allow-Headers":
        //     "Origin, X-Requested-With, Content-Type, Accept, Authorization",
        //   Accept: "application/json",
        //   "X-API-KEY": opensea_api_token,
        // };
        // var url =
        //   "https://api.opensea.io/api/v1/events?account_address=" +
        //   addr +
        //   "&only_opensea=false&limit=200";
        // const events = await fetch(url, { headers });
        // var data = await events.json();
        var data = data.data;
        // console.log("DATA", data);
        // setNumNFT(data.assets.length);
        // var asset_traits = {};
        var assets = {};
        for (const asset of data.asset_events) {
          if (asset.transaction && asset.event_type == "transfer") {
            if (Object.keys(assets).includes(asset.asset.id.toString())) {
              // console.log("FOUND DUP removing" + Number(asset.asset.id));
              // console.log(table_data_object);
              delete table_data_object[Number(asset.asset.id)];
              // console.log(table_data_object);
            } else {
              assets[asset.asset.id] = true;
              var image = asset.asset.image_thumbnail_url;
              var slug = asset.collection_slug;
              var asset_name = asset.asset.name
                ? asset.asset.name.split("#")[0]
                : asset.asset.collection.name;
              var url =
                slug == "art-blocks-factory" || slug == "art-blocks"
                  ? "https://niftyprice.herokuapp.com/floor/:" + asset_name
                  : "https://api.opensea.io/api/v1/collection/" +
                    slug +
                    "/stats";
              // console.log(slug);
              // console.log(asset_name);
              // console.log(url);
              // console.log(asset);
              var transaction_hash = asset.transaction.transaction_hash;
              // console.log();
              var transaction_date = asset.transaction.timestamp;

              const floor_price = await fetch(url);
              var data = await floor_price.json();
              var collection_floor_price = data.stats.floor_price;
              total_val += parseFloat(collection_floor_price)
                ? parseFloat(collection_floor_price)
                : 0;
              setTotalEth(total_val);

              var params = [transaction_hash];
              const transaction_data = await ethereum.request({
                method: "eth_getTransactionByHash",
                params: params,
              });
              var trans_hash_data = await transaction_data;
              // console.log("HASH");
              // console.log(trans_hash_data);
              var paid_price =
                parseFloat(Number(trans_hash_data.value), 16) /
                1000000000000000000;
              // console.log(paid_price);
              var gas_used = (
                parseFloat(Number(trans_hash_data.gas, 16)) *
                0.000000001 *
                parseFloat(Number(trans_hash_data.gasPrice, 16)) *
                0.000000001
              ).toFixed(4);
              var profit =
                collection_floor_price -
                paid_price -
                parseFloat(Number(trans_hash_data.gas, 16)) *
                  0.000000001 *
                  parseFloat(Number(trans_hash_data.gasPrice, 16)) *
                  0.000000001;
              profits += profit;
              var asset_url =
                "https://api.opensea.io/api/v1/asset/" +
                asset.contract_address +
                "/" +
                asset.asset.token_id +
                "/";
              const asset_data = await fetch(asset_url);
              const asset_response = await asset_data.json();
              // console.log(asset_response);
              var total_supply = asset_response.collection.stats.total_supply;
              var total_rarity = 0;
              var index = 0;
              for (const element of asset_response.traits) {
                // console.log(element);
                total_rarity += element.trait_count / total_supply;
                index += 1;
              }
              total_rarity = total_rarity / index;
              // setRarity(total_rarity);
              table_data_object[asset.asset.id] = {
                name: asset_name,
                token_id: asset.asset.token_id,
                cost: paid_price.toFixed(4),
                collection_floor: collection_floor_price,
                gas_used: gas_used,
                profit: profit.toFixed(4),
                traits: asset_response.traits,
                etherscan_transaction: null,
                opensea_link: asset_response.permalink,
                date: transaction_date,
                total: total_supply,
                clean_name: asset_name,
                total_rarity: total_rarity,
                image: image,
              };
            }
          }
        }
        let series_list = [];
        var floor_vals_map = {};
        for (const nft of Object.values(table_data_object)) {
          let date = new Date(Object.values(nft)[9]);
          let url =
            "https://niftyprice.herokuapp.com/collections/:" + Object.values(nft)[0]; // https://niftyprice.herokuapp.com/wallet/:
          var response = await fetch(url);
          var nft_data = await response.json();
          // console.log(nft_data);
          var nft_vals = [];
          var floor_vals = [];

          for (const entry of nft_data.message) {
            let entry_date = new Date(entry.date);
            let totalvals = [
              entry_date.getTime(),
              parseFloat(entry.floorpurchaseprice),
            ];
            floor_vals.push(totalvals);
            if (entry_date > date) {
              let curr_val = parseFloat(entry.floorpurchaseprice) * eth_price;
              let vals = [entry_date.getTime(), curr_val];
              nft_vals.push(vals);
            }
          }
          series_list.push({ name: Object.values(nft)[0], data: nft_vals });
          let temp_floor_map = floor_map;
          temp_floor_map[Object.values(nft)[0]] = floor_vals;
          setFloorMap(temp_floor_map);
          table_data_list.push(Object.values(nft));
          // console.log(Object.entries(nft_history));
        }
        setChartOptionsFpp({
          title: {
            text: "Portfolio Value",
          },
          series: series_list,
        });
        setNumNFT(table_data_list.length);
        // setTokenMap(token_to_asset);
        // setTraits(asset_traits);

        setProfit(profits);
        setWalletData(table_data_list);
        // console.log("OBJECT AHAH");
      } else {
        setWalletData([]);
      }
      ethereum.on("accountsChanged", function (accounts) {
        // console.log(accounts[0]);
        setAddr(accounts[0]);
      });
    }
  };

  const options = {
    expandableRowsHeader: false,
    expandableRows: true,
    renderExpandableRow: (rowData, rowMeta) => {
      // console.log(rowData, rowMeta);
      // console.log("CHECKING", rowData[rowData.length - 2]);

      // console.log(traits);
      // console.log(tokenMap);
      // console.log(tokenMap[rowData[1]]);
      return (
        <>
          <tr>
            <td colSpan={6}>
              <table class="trait-table">
                <tr>
                  <th>Trait Name</th>
                  <th>Trait Value</th>
                  <th># of NFTs With Trait</th>
                  <th>Rarity %</th>
                  <th>Rarity Meter</th>
                </tr>
                {Object.values(rowData[6]).map(function (object, i) {
                  return (
                    <>
                      <tr>
                        <td>{object.trait_type}</td>
                        <td>{object.value}</td>
                        <td>{object.trait_count}</td>
                        <td>
                          {((object.trait_count / rowData[10]) * 100).toFixed(
                            2
                          )}
                          %
                        </td>
                        <td>
                          <div class="barchart">
                            <div
                              class="bar-fill"
                              style={{
                                width:
                                  ((object.trait_count / rowData[10]) * 100)
                                    .toFixed(2)
                                    .toString() + "%",
                              }}
                            >
                              {(
                                (object.trait_count / rowData[10]) *
                                100
                              ).toFixed(2)}
                              %
                            </div>
                          </div>
                        </td>
                      </tr>
                    </>
                  );
                })}
                <tfoot>
                  <td>Total Rarity Meter</td>

                  <td colSpan={rowData[6].length}>
                    <div class="total-barchart">
                      <div
                        class="total-bar-fill"
                        style={{
                          width:
                            (rowData[rowData.length - 2] * 100).toFixed(2) +
                            "%",
                        }}
                      >
                        {(rowData[rowData.length - 2] * 100).toFixed(2)}%
                      </div>
                    </div>
                  </td>
                </tfoot>

                {/* <TableRow className={classes.row}>
                  {Object.values(rowData[6]).map(function (object, i) {
                    return (
                      <>
                        <TableCell className={classes.cell}>
                          {object.value} <br></br>
                          {object.trait_count}/{rowData[10]} <br></br>
                          <p>% with traits:</p>
                          <div class="barchart">
                            <div
                              class="bar-fill"
                              style={{
                                width:
                                  ((object.trait_count / rowData[10]) * 100)
                                    .toFixed(2)
                                    .toString() + "%",
                              }}
                            >
                              {(
                                (object.trait_count / rowData[10]) *
                                100
                              ).toFixed(2)}
                              %
                            </div>
                          </div>
                        </TableCell>
                      </>
                    );
                  })}
                </TableRow> */}
              </table>
            </td>
          </tr>
          <tr>
            {floor_map[rowData[rowData.length - 3]].length > 1 ? (
              <td colSpan={4}>
                <HighchartsReact
                  class="chart"
                  containerProps={{ style: { width: "100%" } }}
                  highcharts={HighStock}
                  constructorType={"stockChart"}
                  options={{
                    title: {
                      text: "Floor Price History",
                    },

                    series: [
                      {
                        name: "Price (ETH)",
                        data: floor_map[rowData[rowData.length - 3]],
                      },
                    ],
                  }}
                />
              </td>
            ) : (
              ""
            )}
          </tr>
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
    get_eth();
  }, [addr, auth]);
  useEffect(() => {
    if (addr && auth) {
      loadAsyncData();
    }
  }, [addr, auth,client_data]);

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
            // console.log(tableMeta.rowData);
            var img = tableMeta.rowData[tableMeta.rowData.length - 1];
            return (
              <>
                <Grid container justifyContent="space-evenly">
                  <Grid item xs={3}>
                    <img src={img} class="image-snippet" alt="no img"></img>
                  </Grid>
                  <Grid item xs={8}>
                    <Grid container>
                      <Grid item xs={12}>
                        <Typography variant="subtitle3" align="right">
                          {tableMeta.rowData[0]}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          style={{
                            color: "#787878",
                            "text-decoration": "underline",
                          }}
                          variant="subtitle3"
                          align="right"
                        >
                          {tableMeta.rowData[1]}
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
      { name: "Paid Price (ETH)" },
      { name: "Collection Floor (ETH)" },
      { name: "Gas Cost (ETH)" },
      { name: "P/L (ETH)" },
      // { name: "Current Value (USD)" },
      // { name: "Traits Floor" },
      {
        name: "Traits",
        options: { display: false, viewColumns: false, filter: false },
      },
      {
        name: "Etherscan Link",
        options: { display: false, viewColumns: false, filter: false },
      },
      {
        name: "Opensea Link",
        options: {
          customBodyRender: (value, tableMeta) => {
            // console.log("VAL", value);
            return (
              <a class="opensea-link" href={value}>
                {" "}
              </a>
            );
          },
        },
      },
      {
        name: "Date",
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
        name: "Rarity Name",
        options: { display: false, viewColumns: false, filter: false },
      },
    ];
    return (
      <>
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
                      style={{backgroundColor: '#1C72D9', color: '#FFFFFF'}}
                      onClick={connect_metamask}
                      id="menu-button"
                    >
                      Connect to Metamask
                    </Button>
                  ) : (""
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
                                  style={{backgroundColor: '#1C72D9', color: '#FFFFFF'}}
                                  id="menu-button"
                                  href="https://metamask.io/download"
                                >
                                  Download metaMask Extension
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ) : (!auth && addr )? (
                          <>
                            <Grid
                              container
                              justifyContent="space-evenly"
                              spacing={4}
                            >
                              <Grid item>
                                <Button
                                  variant="contained"
                                  style={{backgroundColor: '#1C72D9', color: '#FFFFFF'}}
                                  id="menu-button"
                                  onClick={purchase_premium}
                                >
                                  Get Premium for .05 ETH
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ) : auth && addr && !wallet_data ? (
                          <>
                            <Grid container justifyContent="space-between">
                              <Grid item xs={12} className={classes.items}>
                                <CircularProgress />
                              </Grid>
                            </Grid>
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
                            <Grid container justifyContent="space-between">
                              <Grid item xs={6} className={classes.items}>
                                <Typography
                                  inline
                                  variant="subtitle1"
                                  align="left"
                                >
                                  Value (USD)
                                </Typography>
                              </Grid>
                              <Grid item xs={6} className={classes.items}>
                                <Typography
                                  inline
                                  variant="subtitle1"
                                  align="right"
                                >
                                  {total_eth
                                    ? "$" +
                                      numberWithCommas(
                                        (eth_price * total_eth).toFixed(2)
                                      )
                                    : "---"}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Grid container justifyContent="space-between">
                              <Grid item xs={6} className={classes.items}>
                                <Typography
                                  inline
                                  variant="subtitle1"
                                  align="left"
                                >
                                  Value (ETH)
                                </Typography>
                              </Grid>
                              <Grid item xs={6} className={classes.items}>
                                <Typography
                                  inline
                                  variant="subtitle1"
                                  align="right"
                                >
                                  {total_eth
                                    ? numberWithCommas(
                                        total_eth.toFixed(2) + "ETH"
                                      )
                                    : "---"}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Grid container justifyContent="space-between">
                              <Grid item xs={6} className={classes.items}>
                                <Typography
                                  inline
                                  variant="subtitle1"
                                  align="left"
                                >
                                  # NFTs
                                </Typography>
                              </Grid>
                              <Grid item xs={6} className={classes.items}>
                                <Typography
                                  inline
                                  variant="subtitle1"
                                  align="right"
                                >
                                  {num_nft || "---"}
                                </Typography>
                              </Grid>
                            </Grid>

                            <Grid container justifyContent="space-between">
                              <Grid item xs={6} className={classes.items}>
                                <Typography
                                  inline
                                  variant="subtitle1"
                                  align="left"
                                >
                                  Total P/L (USD)
                                </Typography>
                              </Grid>
                              <Grid item xs={6} className={classes.items}>
                                <Typography
                                  inline
                                  variant="subtitle1"
                                  align="right"
                                >
                                  {profit
                                    ? numberWithCommas(
                                        (eth_price * profit).toFixed(2)
                                      )
                                    : "---"}
                                </Typography>
                              </Grid>
                            </Grid>
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
