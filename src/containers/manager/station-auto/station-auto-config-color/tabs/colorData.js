import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as _ from "lodash";
import { connectAutoDispatch } from 'redux/connect'
import { getWarningLevelColors } from 'redux/actions/config'
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
    colorData: state.config.color.warningLevel.data
  })
)
@Form.create({})
export default class WarningLevelColorOfData extends React.Component {
  static defaultProps = {}
  static propTypes = {}

  state = {
    isLoaded: false,
    isSubmit: false,
    dataSource: []
  };

  render() {
    return (
      <div>page color data</div>
    );
  }
}
