import { React, useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import HighchartsReact from "highcharts-react-official";
import "./TraitChart.css";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
let debug = false;
const useStyles = makeStyles({
  root: {
    flexgrow: 1,
    marginTop: 10,
    marginLeft: 10,
  },
});
function TraitChart({ data }) {
  const classes = useStyles();
  const [trait_floors, setTraitFloors] = useState(null);
  const [max_floor, setMaxFloor] = useState(null);
  const [trait_data, setTraitData] = useState(null);
  const [rowData, setRowData] = useState();
  const [supply, setSupply] = useState();
  const [total_rarity, setTotalRarity] = useState();
  const get_trait = async () => {
    setRowData(data.rowData);
    // setTraitFloors(JSON.parse(data.rowData[9]).trait_types)
    let temp_trait_floors = data.trait_data;
    // setTraitData(temp_trait_floors);
    let nft_address = null;
    let nft_token_id = null;
    if(data.address && data.token){
      nft_address  = data.address
      nft_token_id = data.token
    }else{
      nft_address = data.rowData[15].contract_address
      nft_token_id = data.rowData[15].asset.token_id

    }
    let url = debug
      ? `http://localhost:8080/traits/${nft_address}/${nft_token_id}`
      : `https://niftyprice.herokuapp.com/traits/${nft_address}/${nft_token_id}`; //;//
    const trait = await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSupply(data.message.traits.collection.stats.total_supply);
        let rarities = 0;
        for (const trait of data.message.traits.traits) {
          try{
            trait["floor"] = data.message.floors.trait_types[trait.trait_type].values[trait.value]

          }
          catch{trait["floor"]=0}
          rarities += trait.trait_count;
        }
        
          setTraitData(data.message.traits.traits);
        
        // setTraitData(temp_trait_floors);

        setTotalRarity(
          rarities /
            (data.message.traits.collection.stats.total_supply *
              data.message.traits.traits.length)
        );
      })
      .catch((e) => console.log("error ", e));
  };
  useEffect(() => {
    get_trait().catch((e) => {
      console.log("e");
    });
  }, []);
  return (
    <>
      <tr>
        <td colSpan={2}>
          <Card elevation={5} className={classes.root}>
            <CardContent>
              <Typography variant="h5" align="center">
                Rarity Info
              </Typography>
              <hr></hr>
              {trait_data ? (
                <>
                  <table class="trait-table" cellspacing="0" cellpadding="0">
                    <tr>
                      <th>Trait Name</th>
                      <th>Trait Value</th>
                      <th>Rarity Meter</th>
                      <th>Floor</th>
                    </tr>

                    {Object.values(trait_data).map(function (object, i) {
                      return (
                        <>
                          <tr>
                            <td>{object.trait_type}:</td>
                            <td>
                              <span class="trait-value">{object.value} </span>
                              <span class="trait-percent">
                                ({object.trait_count}/{supply})
                              </span>
                            </td>

                            <td>
                              <div class="barchart">
                                <div
                                  class="bar-fill"
                                  style={{
                                    textAlign: "left",
                                    width:
                                      ((object.trait_count / supply) * 100)
                                        .toFixed(2)
                                        .toString() + "%",
                                  }}
                                >
                                  {(
                                    (object.trait_count / supply) *
                                    100
                                  ).toFixed(2)}
                                  %
                                </div>
                              </div>
                            </td>
                            <td>
                              {object.trait_count > 0 &&
                              object.floor != undefined
                                ? object.floor.toFixed(3)
                                : "---"}
                            </td>
                          </tr>
                        </>
                      );
                    })}
                    <tfoot class="total-bar-footer">
                      <td colSpan={2}>Total Rarity Meter</td>

                      <td>
                        <div class="total-barchart">
                          <div
                            class="total-bar-fill"
                            style={{
                              width: total_rarity
                                ? (total_rarity * 100).toFixed(2) + "%"
                                : "0%",
                            }}
                          >
                            {total_rarity
                              ? (total_rarity * 100).toFixed(2)
                              : 0.0}
                            %
                          </div>
                        </div>
                      </td>
                    </tfoot>
                  </table>
                </>
              ) : (
                <CircularProgress />
              )}
            </CardContent>
          </Card>
        </td>
      </tr>
    </>
  );
}
export default TraitChart;
