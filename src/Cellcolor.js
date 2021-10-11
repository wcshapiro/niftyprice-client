import React, { Component } from "react";
import PropTypes from "prop-types";

class QualityCell extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    change: PropTypes.func.isRequired,
  };

  render() {
    const { value, index, change } = this.props;
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
    if (parseFloat(value) > 0) {
      color = colors.green;
      textColor = textColors.green;
    } else if (parseFloat(value) < 0) {
      color = colors.red;
      textColor = textColors.red;
    } else if (parseFloat(value) === 0) {
      color = colors.grey;
      textColor = textColors.black;
    }
    if (isNaN(value)) {
      var new_value = 0.0;
    } else {
      new_value = value;
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
        {new_value}%
      </p>
    );
  }
}
export default QualityCell;
