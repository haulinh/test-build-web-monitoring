import React from 'react'
import { autobind } from 'core-decorators'
// import styled from 'styled-components'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'
import _ from 'lodash'
// import { translate } from 'hoc/create-lang'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'

import {QAQC_TABLES} from 'constants/qaqc'


@connect((state, ownProps) => ({
  /* states */
}), {
  /* actions */
})
@autobind
export default class QAQCOriginalTable extends React.Component {
  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    measuringList: PropTypes.array.isRequired,
    measuringData: PropTypes.array.isRequired,
  }

  render() {
    let {dataSource, measuringList, measuringData} = this.props
    let columns = this._transformedColumns(measuringList, measuringData)
    let data = this._transformedData(dataSource);
    return <Table dataSource={data} columns={columns}></Table>
  }

  _transformedColumns(measuringList, measuringData) {
    let defaultColumns = [
      {
        title: "STT",
        dataIndex: "stt",
        align: "center",
        width: 50,
      },
      {
        title: "Received At",
        dataIndex: "receivedAt",
        align: "center"
      }
    ];
  
    let measuringColumns = _.map(measuringList, measuringName => {
      let measuringInfo = _.find(
        measuringData,
        itemInfo => itemInfo.key === measuringName
      );
  
      return {
        title: `${measuringInfo.key} (${measuringInfo.unit})`,
        dataIndex: measuringInfo.key,
        align: "center",
        render(text) {
          return text;
        }
      };
    });
  
    return [...defaultColumns, ...measuringColumns];
  }

  _transformedData(data) {
    return _.map(data, (record, recordIndex) => {
      let result = {
        _id: record._id,
        stt: recordIndex + 1,
        receivedAt: moment(record.receivedAt).format(DD_MM_YYYY_HH_MM),
      };
  
      _.forEach(this.props.measuringList, name => {
        result[name] = <div style={{textAlign: 'center'}}>{_.get(record,`measuringLogs[${name}].value`, '')}</div>
      });
  
      return result;
    });
  }
}