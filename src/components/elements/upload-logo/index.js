import { message, Upload } from 'antd'
import MediaApi from 'api/MediaApi'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import React from 'react'
import styled from 'styled-components'
import swal from 'sweetalert2'
import { isLimitSize } from 'utils'
import { isContainSpecialCharacter } from 'utils/string'
import Label from '../label'

const View = styled.div``

const LogoContainer = styled.img`
  height: 64px;
  width: auto;
`

@autobind
export default class UpdateLogo extends React.PureComponent {
  state = {
    fileList: [],
    isUploadError: false,
  }

  async componentWillMount() {
    if (this.props.organization && this.props.organization.logo) {
      this.updateFiles(this.props.organization.logo)
    }
  }

  handleImageChange = ({ fileList, file, event }) => {
    let newFileList = fileList

    if (file.status === 'error') {
      swal({
        title: translate('profileUser.imageUpload.error'),
        type: 'error',
      })
      newFileList = []
    }

    if (newFileList.length > 1) {
      newFileList = [...newFileList[newFileList.length -1 ]]
    }

    this.setState({
      fileList: newFileList,
    })

    if (file.status === 'done') {
      this.updateFiles(file.response.url)
      let data = this.props.organization
      if (data.logo) {
        data.logo = file.response.url
      } else {
        data['logo'] = file.response.url
      }
    }
    if (file.status === 'removed') {
      let data = this.props.organization
      data['logo'] = ''
    }
  }

  updateFiles(url) {
    this.setState({
      fileList: [
        {
          uid: -1,
          url,
          name: '',
          status: 'done',
        },
      ],
    })
  }

  beforeUpload = file => {
    this.setState({ isUploadError: false })
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error(translate('stationAutoManager.uploadFile.errorType'))
    }
    if (!isLimitSize(file.size)) {
      message.error(translate('stationAutoManager.uploadFile.errorSize'))
    }
    if (isContainSpecialCharacter(file.name)) {
      message.error(translate('stationAutoManager.uploadFile.errorSpecial'))
    }
    const isUploadError = !(
      isJpgOrPng &&
      isLimitSize(file.size) &&
      !isContainSpecialCharacter(file.name)
    )
    if (isUploadError) {
      this.setState({ isUploadError: true })
    }
    return !isUploadError
  }

  render() {
    const { name, ...otherProps } = this.props
    const { isUploadError } = this.state
    return (
      <View>
        {this.props.label && <Label>{this.props.label}</Label>}
        <Upload
          {...otherProps}
          beforeUpload={this.beforeUpload}
          action={MediaApi.urlPhotoUploadWithDirectory('logo')}
          listType="picture-card"
          fileList={this.state.fileList}
          onChange={this.handleImageChange}
          disabled={!this.props.isAdmin}
          showUploadList={isUploadError ? false : true}
        >
          {this.state.fileList.length > 0 ? (
            isUploadError ? <LogoContainer src="/images/logo/icon/enviroment.png" /> : ''
          ) : (
            <LogoContainer src="/images/logo/icon/enviroment.png" />
          )}
        </Upload>
      </View>
    )
  }
}
