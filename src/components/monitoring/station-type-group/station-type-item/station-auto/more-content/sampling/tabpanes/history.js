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
}

/* MARK  [START] - MOCKUP DATA */
const columns = [
  {
    title: i18n.stt,
    dataIndex: 'stt',
    width: 150,
  },
  {
    title: i18n.bottleNo,
    dataIndex: 'bottleNo',
    width: 150,
  },
  {
    title: i18n.dateTime,
    dataIndex: 'dateTime',
    width: 150,
  },
  {
    title: i18n.typeOfSampling,
    dataIndex: 'typeOfSampling',
    width: 150,
  },
  {
    title: i18n.activedUser,
    dataIndex: 'activedUser',
    width: 150,
  },
];

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    stt: i + 1,
    bottleNo: i % 8,
    dateTime: `${i%30}/${i%12}/2019`,
    typeOfSampling: ['manual', 'auto'][i%2],
    activedUser: ['Phát', 'Thảo', 'Quí'][i % 3]
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
          scroll={{ y: 500 }} 
          onRow={(record, index) => {console.log(record)}}
        />,
      </div>
    )
  }
}

