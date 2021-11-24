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
  console.log(context);

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
  const [num_nft, setNumNFT] = useState();
  const [traits, setTraits] = useState({});
  const [profit, setProfit] = useState();
  const [gwei_price, setGwei] = useState();
  const [fpp_chart_options, setChartOptionsFpp] = useState({
    title: {
      text: "Portfolio Value",
    },
    xAxis: {
      categories: null,
    },
    series: [
      {
        data: [0],
      },
    ],
  });
  var get_eth = () => {
    return new Promise((resolve, reject) => {
      const response = fetch("https://niftyprice.herokuapp.com/wallet")
        .then((resp) => resp.json())
        .then((data) => {
          setEth(data.message.eth);
          resolve(data.message.eth);
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
  };

  const loadAsyncData = async (eth) => {
    // setLoading(true);
    if (ethereum) {
      if (addr != null) {
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
        var headers = {
          "Access-Control-Allow-Origin": "http, https",
          "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTONS",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept, Authorization",
          Accept: "application/json",
          "X-API-KEY": opensea_api_token,
        };
        var url =
          "https://api.opensea.io/api/v1/events?account_address=" +
          addr +
          "&only_opensea=false&limit=200";
        const events = await fetch(url, { headers });
        var data = await events.json();
        // console.log(data);
        // setNumNFT(data.assets.length);
        // var asset_traits = {};
        var assets = {};
        for (const asset of data.asset_events) {
          if (asset.transaction && asset.event_type == "transfer") {
            if (Object.keys(assets).includes(asset.asset.id.toString())) {
              console.log("FOUND DUP removing" + Number(asset.asset.id));
              console.log(table_data_object);
              delete table_data_object[Number(asset.asset.id)];
              console.log(table_data_object);
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
              console.log(slug);
              console.log(asset_name);
              console.log(url);
              console.log(asset);
              var transaction_hash = asset.transaction.transaction_hash;
              // console.log(transaction_hash);

              const floor_price = await fetch(url);
              var data = await floor_price.json();
              var collection_floor_price = data.stats.floor_price;
              total_val += parseFloat(collection_floor_price)
                ? parseFloat(collection_floor_price)
                : 0;
              setTotalEth(total_val);
              setChartOptionsFpp({
                title: {
                  text: "Portfolio Value",
                },
                
                series: [
                  {
                    name:"Portfolio Value USD",
                    data: [[Date.now(),total_val]],
                  },
                ],
              })
              
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
              var asset_url = "https://api.opensea.io/api/v1/asset/"+asset.contract_address+"/"+asset.asset.token_id+"/"
              const asset_data = await fetch(asset_url)
              const asset_response = await asset_data.json()
              console.log(asset_response)
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
                image: image,
              };
            }
          }
        }
        for (const nft of Object.values(table_data_object)) {
          table_data_list.push(Object.values(nft));
        }
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
      // console.log(traits);
      console.log(rowData);
      // console.log(tokenMap);
      // console.log(tokenMap[rowData[1]]);
      return (
        <>
          <tr>
            <td colSpan={6}>
              <table>
                <TableRow className={classes.row}>
                  {Object.values(rowData[6]).map(function (
                    object,
                    i
                  ) {
                    return (
                      <>
                        <TableCell>{object.trait_type}</TableCell>
                      </>
                    );
                  })}
                </TableRow>
                <TableRow className={classes.row}>
                  {Object.values(rowData[6]).map(function (
                    object,
                    i
                  ) {
                    return (
                      <>
                        <TableCell>{object.value}</TableCell>
                      </>
                    );
                  })}
                </TableRow>
              </table>
            </td>
          </tr>
        </>
      );

      // return <>{

      //   traits[rowData[1]].entries()||"NOTHIN"
      //   }
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
    get_eth().then((res) => {
      loadAsyncData(res);
    });
  }, [addr, auth]);
  // if (!auth && addr) {
  //   return (
  //     <>
  //       <div class="loading">
  //         This is a paid website feature!
  //         <br></br>
  //         If you have not paid, please deposit .141ETH into
  //         0x64b2C1C1686D9A78f11A5fD625FcBaBf9238f886 to unlock this feature
  //         <br></br>
  //         <CircularProgress />
  //       </div>
  //     </>
  //   );
  // } else
  if (loading || eth_price == null) {
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
                <Grid container>
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
        options: { display: false, viewColumns: false, filter: false },
      },
      {
        name: "Image",
        options: { display: false, viewColumns: false, filter: false },
      },
    ];
    return (
      <>
        <Grid item xs={12} style={{ backgroundColor: "#d6ceb6", height: 50 }}>
          <Typography
            variant="subtitle1"
            style={{
              paddingTop: 10,
            }}
          >
            {" "}
            Beta Product! We are working quickly to include additional charts,
            analysis, historical portfolio performance and more!
          </Typography>
        </Grid>
        <Grid container justifyContent="space-evenly">
          <div class="wallet-content">
            <div class="wallet-cards">
              <Grid container justifyContent="flex-end">
                <Grid item xs={4}>
                  {!addr && is_provider ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={connect_metamask}
                      id="menu-button"
                    >
                      Connect to Metamask
                    </Button>
                  ) : (
                    ""
                  )}
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    variant="subtitle1"
                    style={{
                      color: "#787878",
                    }}
                  >
                    Gas Price: {gwei_price} (GWEI)
                  </Typography>
                </Grid>
              </Grid>
              <Grid container justifyContent="space-evenly">
                <Grid item xs={5}>
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
                                  color="primary"
                                  id="menu-button"
                                  href="https://metamask.io/download"
                                >
                                  Download metaMask Extension
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ) : !auth && addr ? (
                          <>
                            <Grid
                              container
                              justifyContent="space-evenly"
                              spacing={4}
                            >
                              <Grid item xs={12}>
                                <Typography variant="h6">Register for Premium via smart contract!</Typography>
                                <Typography>Price is .05 ETH</Typography>

                              </Grid>
                              <Grid item>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  id="menu-button"
                                  href="https://etherscan.io/address/0x4ba0fC55646f6c82134CE3dc19aC64d02176e47c#writeContract"
                                >
                                  Sign Up for Premium
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ) : (auth && addr && !wallet_data)?(<>
                        <Grid container justifyContent="space-between">
                              <Grid item xs={12} className={classes.items}>

                        <CircularProgress />
                        </Grid>
                        </Grid>

                        </>):(
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
                                  24H%
                                </Typography>
                              </Grid>
                              <Grid item xs={6} className={classes.items}>
                                <Typography
                                  inline
                                  variant="subtitle1"
                                  align="right"
                                >
                                  ---
                                  {/* {numberWithCommas(
                                (eth_price * profit).toFixed(2)
                              )} */}
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
                <Grid item xs={5}>
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
