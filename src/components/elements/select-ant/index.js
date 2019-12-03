import React from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { connect } from "react-redux";
import * as _ from 'lodash'

@connect(state => ({
  language: _.get(state, "language.locale")
}))
export default class SelectAnt extends React.PureComponent {
  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        name: PropTypes.string
      })
    ),
    isAll: PropTypes.bool
  };

  static defaultProps = {
    options: []
  };

  getRealValue() {
    if (this.props.mode === "multiple") {
      if (!Array.isArray(this.props.value)) return [];
    }
    return this.props.value;
  }

  render() {
    const { options, language, isAll, ...otherProps } = this.props;
    return (
      <Select {...otherProps} value={this.getRealValue()}>
        {isAll && (
          <Select.Option key={"all"} value={"all"}>
            {language === "en" ? "All" : "Tất cả"}
          </Select.Option>
        )}
        {options.length > 0 &&
          options.map(option => (
            <Select.Option key={option.value} value={option.value}>
              {option.name}
            </Select.Option>
          ))}
      </Select>
    );
  }
}
