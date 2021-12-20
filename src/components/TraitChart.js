import { React, useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import HighchartsReact from "highcharts-react-official";
import "./TraitChart.css";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    flexgrow: 1,
    marginTop: 10,
    marginLeft: 10,
  },
});
function TraitChart({ data }) {
  const classes = useStyles();

  const [trait_data, setTraitData] = useState(null);
  const [rowData, setRowData] = useState();
  const [supply, setSupply] = useState();
  const [total_rarity, setTotalRarity] = useState();
  const get_trait = async () => {
    setRowData(data.rowData);
    // console.log("TRAIT ROWDATA", data.rowData);
    let url = `https://niftyprice.herokuapp.com/traits/${data.address}/${data.token}`//`http://localhost:8080/traits/${data.address}/${data.token}`;
    const trait = await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // console.log("data", data);
        setSupply(data.message.collection.stats.total_supply);
        setTraitData(data.message.traits);
        let rarities = 0;
        for (const element of data.message.traits) {
        //   console.log("element", element.trait_count);
          rarities += element.trait_count;
        }
        setTotalRarity(
          rarities /
            (data.message.collection.stats.total_supply *
              data.message.traits.length)
        );
      })
      .catch((e) => console.log("error ", e));
  };
  useEffect(() => {
    get_trait();
  }, []);
  return (
    <>
      <tr>
        <td colSpan={2}>
          <Card elevation={5} className={classes.root}>
            <CardContent>
                <Typography variant="h5" align="center">Rarity Info</Typography>
                <hr></hr>
              {trait_data ? (
                <>
                  <table class="trait-table" cellspacing="0" cellpadding="0">
                    <tr>
                      <th>Trait Name</th>
                      <th>Trait Value</th>
                      <th>Rarity Meter</th>
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
                              width: (total_rarity * 100).toFixed(2) + "%",
                            }}
                          >
                            {(total_rarity * 100).toFixed(2)}%
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
