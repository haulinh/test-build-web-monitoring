/* libs import */
import React from 'react'
import PropTypes from 'prop-types';
import {withRouter} from 'react-router'
import {Row, Col, Table} from 'antd';
/* user import */
import { translate } from 'hoc/create-lang'

const i18n = {
  stt: translate('monitoring.moreContent.sampling.content.history.stt'),
  bottleNo: translate('monitoring.moreContent.sampling.content.history.bottleNo'),
  dateTime: translate('monitoring.moreContent.sampling.content.history.dateTime'),
  typeOfSampling: translate('monitoring.moreContent.sampling.content.history.typeOfSampling'),
  activedUser: translate('monitoring.moreContent.sampling.content.history.activedUser'),
  success: translate('monitoring.moreContent.sampling.content.history.result')
}

/* MARK  [START] - MOCKUP DATA */
const columns = [
  {
    title: i18n.stt,
    dataIndex: 'stt',
    align: 'center',
    width: 30,
  },
  {
    title: i18n.bottleNo,
    dataIndex: 'bottleNo',
    width: 50,
  },
  {
    title: <div style={{backgroundColor: "red", display: 'block', }}>{i18n.dateTime}</div>,
    dataIndex: 'dateTime',
    align: 'center',
    width: 150,
  },
  {
    title: i18n.typeOfSampling,
    dataIndex: 'typeOfSampling',
    align: 'center',
    width: 150,
  },
  {
    title: i18n.activedUser,
    dataIndex: 'activedUser',
    width: 150,
  },
  {
    title: i18n.activedUser,
    dataIndex: 'result',
    width: 150,
  },
];

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    stt: <div style={{textAlign: 'center', width: 30}}>{ i + 1 }</div>,
    bottleNo:  <div style={{textAlign: 'center', width: 50}}>{ i + 8 }</div>,
    dateTime: <div style={{textAlign: "center",backgroundColor: 'blue', height: 100, width: 150}}>{`${i%30}/${i%12}/2019 15:32`}</div>,
    typeOfSampling: ['manual', 'auto'][i % 2],
    activedUser: [
      'Phát <phat.duong@vietan-software.com>', 
      'Thảo <thao.mai@gmail.com>', 
      'Quí <qui@yahoo.com>'
    ][i % 3],
    result: ["successful", "error"][i % 2]
  });
}
/* MARK  [END] - MOCKUP DATA */

@withRouter
export default class SamplingMoreInfo extends React.Component {
  static propTypes = {}
  static defaultProps = {}

  state = {}

  render(){
    return (
      <div style={{padding: 8}}>
        <Table 
          columns={columns} 
          dataSource={data} 
          pagination={{ pageSize: 50 }} 
          size="small"
          scroll={{ y: 379 }} 
          onRow={(record, index) => {console.log(record)}}
        />
      </div>
    )
  }
}

