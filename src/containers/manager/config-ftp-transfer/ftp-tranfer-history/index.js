import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Breadcrumb from '../breadcrumb'
import * as _ from 'lodash'
import { translate } from 'hoc/create-lang'
import { Tabs, Button, message } from 'antd'
import TabDataList from './tab-data-list'
import dataStationAutoApi from 'api/DataStationAutoApi'
import styled from 'styled-components'
import BoxShadow from 'components/elements/box-shadow/index'

const ButtonAbsolute = styled.div`
  position: absolute;
  top: 0px;
  right: 16px;
  z-index: 3;
`
const TabeListWrapper = BoxShadow.extend`
  padding: 0px 16px 16px 16px;
  position: relative;
`

export default class FtpTranferHistory extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      isLoading: true,
      titleTab: translate('ftpTranfer.history'),
      isUploadting: false,
      hasTranferFaild: false
    }
  }

  componentDidMount() {
   this.processData()
  }

  handleTryUploadFile = async () => {
    this.setState({
      isUploadting: true,
      isLoading: true
    })
    const data = _.filter(this.state.dataSource, item => !item.isTransferred)
    const rs = await dataStationAutoApi.putDataFtpTranfer(data)
    if (rs && rs.success) {
      this.processData(true)
    } else {
      this.setState({
        isUploadting: false,
        isLoading: false
      })

      message.error(translate('ftpTranfer.status.failed'))
    }
  }

  async processData ( isHandTryUpload ) {
    const rs = await dataStationAutoApi.getHistoryFtpTranfer(_.get(this.props, 'match.params.key', ''))
    const data = (rs && rs.data) ? rs.data : []
    const countTranferred = _.filter(data, item => item.isTransferred).length

    this.setState({
      isUploadting: false,
      hasTranferFaild: data.length > countTranferred,
      dataSource: data,
      isLoading: false,
      titleTab: `${translate('ftpTranfer.history')} (${countTranferred}/${data.length})`
    })

    if (isHandTryUpload) {
      message.success(translate('ftpTranfer.status.success'))
    }
  }

  render() {
    return (
      <PageContainer
        backgroundColor={'#fff'}>
        <Breadcrumb items={['list', 
         {
          id: 'history',
          name: _.get(this.props, 'match.params.name', '')
        }
      ]} />
        <TabeListWrapper>
          {
            this.state.hasTranferFaild &&
            <ButtonAbsolute>
              <Button
                type="primary"
                icon="file-excel"
                style={{ float: 'right', margin: '5px' }}
                onClick={this.handleTryUploadFile}
                loading={this.state.isUploadting}
              >
                {translate('ftpTranfer.tryUploadFile')}
              </Button>
            </ButtonAbsolute>
          }
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab={this.state.titleTab} key="1">
              <TabDataList
                loading={this.state.isLoading}
                dataSource={this.state.dataSource}
              />
              </Tabs.TabPane>
          </Tabs>
        </TabeListWrapper>
      </PageContainer>
    )
  }
}
