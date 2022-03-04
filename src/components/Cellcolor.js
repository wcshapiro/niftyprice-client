import React, { Component } from "react";
import PropTypes from "prop-types";

class QualityCell extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    change: PropTypes.func.isRequired,
  };

  render() {
    const { value, index,tableMeta, change } = this.props;
    const colors = {
      green: "#D1FAE5",
      red: "#FEE2E2",
      black: "#000000",
      grey: "EFF2F5",
    };
    const textColors = {
      green: "#065f46",
      red: "#981b1b",
      black: "#000000",
    };

    let color = colors.grey;
    let textColor = textColors.black;
    // console.log("TABLEMETA",tableMeta?tableMeta.currentTableData[tableMeta.currentTableData[tableMeta.rowIndex].index].data[4]:null);
    var new_value = value
    new_value = tableMeta?tableMeta.currentTableData[tableMeta.currentTableData[tableMeta.rowIndex].index].data[4]:new_value
    if (parseFloat(new_value) > 0) {
      color = colors.green;
      textColor = textColors.green;
    } else if (parseFloat(new_value) < 0) {
      color = colors.red;
      textColor = textColors.red;
    } else if (parseFloat(new_value) === 0) {
      color = colors.grey;
      textColor = textColors.black;
    }
    if (isNaN(new_value)) {
      new_value = 0.0;
    } 

    return (
      <p
        value={value}
        onChange={(event) => change(event.target.value, index)}
        style={{
          color: textColor,
          backgroundColor: color,
          borderRadius: 12,
          textAlign: "center",
          maxWidth: 80,
          minWidth: 80,
        }}
      >
        {new_value.toFixed(2)}%
      </p>
    );
  }
}
export default QualityCell;
