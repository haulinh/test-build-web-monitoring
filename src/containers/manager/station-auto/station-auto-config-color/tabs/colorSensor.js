import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as _ from "lodash";
import { connectAutoDispatch } from 'redux/connect'
import {
  message,
  // Tabs,
  Button,
  Table,
  Form,
  Input,
  InputNumber,
  Icon,
  Popconfirm,
  Spin
} from "antd";

import { translate } from "hoc/create-lang";

const i18n = {
  // ....
};


@connectAutoDispatch(
  state => ({
    colorSensor: state.config.color.warningLevel.sensor
  })
)
@Form.create({})
export default class WarningLevelColorOfSensor extends React.Component {
  static defaultProps = {}
  static propTypes = {}

  render() {
    return (
      <div>page sensor data</div>
    );
  }
}
