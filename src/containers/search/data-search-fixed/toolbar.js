import React from 'react'
import styled from 'styled-components'
import { Button, Upload, message } from 'antd'
import { getAuthToken } from 'utils/auth'
import { getConfigApi } from 'config'
import { translate } from 'hoc/create-lang'

const Container = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

export default class ToolbarView extends React.Component {
  state = {
    token: null,
    importLoading: false
  }

  async componentDidMount() {
    const token = await getAuthToken()
    if (token) {
      this.setState({ token })
    }
  }

  render() {
    return (
      <Container>
        <Button
          style={{ marginLeft: 8 }}
          type="primary"
          icon="cloud-download"
          onClick={this.props.onDownloadTemplate}
        >
          {translate('dataSearchFixed.downloadTemplate')}
        </Button>
        <Upload
          onStart={() => this.setState({ importLoading: true })}
          headers={{ Authorization: this.state.token }}
          accept=".xls,.xlsx"
          showUploadList={false}
          multiple={false}
          name="importFile"
          onSuccess={file => {
            this.props.importSuccess()
            this.setState({ importLoading: false })
            message.success(translate('dataSearchFixed.importSuccess'))
          }}
          onError={err => {
            message.error(translate('dataSearchFixed.importFailed'))
            this.setState({ importLoading: false })
          }}
          action={`${getConfigApi().dataStationFixed}/${
            this.props.stationFixedID
          }/import-data`}
        >
          <Button
            style={{ marginLeft: 8 }}
            type="primary"
            icon="upload"
            loading={this.state.importLoading}
          >
            {translate('dataSearchFixed.importData')}
          </Button>
        </Upload>
      </Container>
    )
  }
}
