import React, { Component } from "react";
import PropTypes from 'prop-types';


class QualityCell extends Component {
    static propTypes = {
        value: PropTypes.string.isRequired,
        index: PropTypes.number.isRequired,
        change: PropTypes.func.isRequired
    };

    render() {
        const { value, index, change } = this.props;
        const colors = {
            "green": "#B2FFA1",
            "red": "#FFA1A1",
            "black": "#000000"
        }
        let color = colors.grey;
        if (parseFloat(value) > 0) {
            color = colors.green;
        } else if (parseFloat(value) <= 0) {
            color = colors.red;
        }
        if (isNaN(value)){
            var new_value = 0.00;
        }
        else {
            new_value = value
        }

        return (
            <p
                value={value}
                onChange={event => change(event.target.value, index)}
                style={{
                    color: colors.black,
                    backgroundColor: color,
                    borderRadius: 12,
                    textAlign: 'center',
                    maxWidth: 80,
                    minWidth: 80
                }}>{new_value}%</p>
        )
    }
}
export default QualityCell;