import React, { PureComponent } from "react";
import { Select } from "antd";
import PropTypes from "prop-types";
import CategoryApi from "api/CategoryApi";
import { get as _get } from "lodash";
import { autobind } from "core-decorators";
import { translate, removeAccents } from "hoc/create-lang";
import { connect } from "react-redux";

@connect(state => ({
  language: _get(state, "language.locale")
}))
@autobind
export default class SelectStationType extends PureComponent {
  static propTypes = {
    query: PropTypes.object,
    label: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
    isShowAll: PropTypes.bool,
    isAuto: PropTypes.bool,
    getRef: PropTypes.func
  };

  static defaultProps = {
    isAuto: true
  };

  state = {
    stationTypes: [],
    value: ""
  };

  async componentDidMount() {
    let query = { isAuto: this.props.isAuto };
    const stationTypes = await CategoryApi.getStationTypes({}, query);
    if (stationTypes.success)
      this.setState({
        stationTypes: stationTypes.data || [],
        value: this.props.value
      });

    if (this.props.getRef) this.props.getRef(this);
  }

  getFirstValue() {
    if (this.state.stationTypes.length > 0) return this.state.stationTypes[0];
  }

  setFirstValue() {
    if (this.state.stationTypes.length > 0)
      this.setState({
        value: this.state.stationTypes[0].key
      });
  }

  onChange(value) {
    let res = this.state.stationTypes.find(item => item.key === value);
    this.setState({
      value: value
    });
    if (this.props.onHandleChange) this.props.onHandleChange(res, this);
    if (this.props.onChange) this.props.onChange(value);
  }

  render() {
    const { language } = this.props;

    return (
      <Select
        showSearch
        style={{ width: "100%" }}
        {...this.props}
        onChange={this.onChange}
        value={this.state.value}
      >
        {this.props.isShowAll && (
          <Select.Option value={""}>
            {translate("dataSearchFrom.form.all")}
          </Select.Option>
        )}
        {this.state.stationTypes.map(stationType => (
          <Select.Option key={stationType.key} value={stationType.key}>
            {removeAccents(language, stationType.name)}
          </Select.Option>
        ))}
      </Select>
    );
  }
}
