import React from 'react'
import { Button, Table } from 'antd'
import { translate } from 'hoc/create-lang'

const i18n = {
  key: translate('stationFixedPoint.form.measuringForm.key'),
  name: translate('stationFixedPoint.form.measuringForm.name'),
  addMeasuring: translate('stationFixedPoint.form.measuringForm.addMeasuring'),
  tendToExceed: translate('stationFixedPoint.form.measuringForm.tendToExceed'),
  qcvn: translate('stationFixedPoint.form.measuringForm.qcvn'),
  qcvnMin: translate('stationFixedPoint.form.measuringForm.qcvnMin'),
  qcvnMax: translate('stationFixedPoint.form.measuringForm.qcvnMax'),
}

export default class MeasuringList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoaded: true,
      measuringList: [],
    }
  }

  setUpColumns = () => {
    return [
      {
        dataIndex: 'key',
        align: 'center',
        title: i18n.key,
        width: 130,
      },
      {
        dataIndex: 'name',
        align: 'center',
        title: i18n.name,
      },
      {
        title: i18n.qcvn,
        children: [
          {
            dataIndex: 'minLimit',
            align: 'center',
            title: i18n.qcvnMin,
            width: 150,
          },
          {
            dataIndex: 'maxLimit',
            align: 'center',
            title: i18n.qcvnMax,
            width: 150,
          },
        ],
      },
      {
        title: i18n.tendToExceed,
        children: [
          {
            dataIndex: 'minTend',
            align: 'center',
            title: i18n.qcvnMin,
            width: 150,
          },
          {
            dataIndex: 'maxTend',
            align: 'center',
            title: i18n.qcvnMax,
            width: 150,
          },
        ],
      },
      {
        dataIndex: 'unit',
        align: 'center',
        title: 'Đơn vị',
      },
    ]
  }

  handleAddRow = () => {
    let rowNew = {
      rowKey: `key_${this.state.measuringList.length}`,
    }
    let dataSource = this.state.measuringList
    dataSource.push(rowNew)
    this.setState({
      measuringList: dataSource,
    })
  }

  render() {
    console.log(this.state, '---render--')
    return (
      <div>
        <Button
          style={{ right: '0', marginBottom: '16px' }}
          type="primary"
          size="large"
          onClick={this.handleAddRow}
        >
          {i18n.addMeasuring}
        </Button>
        {this.state.isLoaded && (
          <Table
            bordered
            rowKey="key"
            dataSource={this.state.measuringList}
            columns={this.setUpColumns()}
            pagination={{
              pageSize: 1000,
              hideOnSinglePage: true,
            }}
          />
        )}
      </div>
    )
  }
}
