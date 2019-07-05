import React from 'react'
import { autobind } from 'core-decorators'
// import styled from 'styled-components'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment-timezone'
// import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'

@connect((state, ownProps) => ({
  /* states */
}), {
  /* actions */
})
@autobind
export default class QAQCInvalidTable extends React.Component {
  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired
  }
  
  render() {
    let {dataSource, measuringList, measuringData} = this.props
    let columns = this._transformedColumns(measuringList, measuringData)
    let data = this._transformedData(dataSource);
    return <Table dataSource={data} columns={columns} size="small"></Table>
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
        align: "center",
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
        width: measuringInfo.key === 'pH' && 50,
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
        let isHaveMeasuring = _.get(record,`measuringLogs[${name}]`, undefined)
        if ( isHaveMeasuring && record.measuringLogs[name].isValid) {
          result[name] = <div>{record.measuringLogs[name].value}</div>;
        } else {
          result[name] = (
            <div 
              style={{
                textAlign: 'center', 
                backgroundColor: '#d86873'
              }}
            >
              {_.get(record,`measuringLogs[${name}].value`, '')}
            </div>
          );
        }
      });
  
      return result;
    });
  }
}