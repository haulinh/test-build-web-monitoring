import React from 'react'
import styled from 'styled-components'
import Label from '../label'
import swal from 'sweetalert2'
import { autobind } from 'core-decorators'
import { message, Upload } from 'antd'
import MediaApi from 'api/MediaApi'
import { translate } from 'hoc/create-lang'
import axios from 'axios'
import { isContainSpecialCharacter } from '../../../utils/string'

const View = styled.div``

const LogoContainer = styled.img`
  height: 64px;
  width: auto;
`

@autobind
export default class UpdateLogo extends React.PureComponent {
  state = {
    fileList: [],
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

  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error(translate('stationAutoManager.uploadFile.errorType'));
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(translate('stationAutoManager.uploadFile.errorSize'));
    }
    if (isContainSpecialCharacter(file.name)) {
      message.error(translate('stationAutoManager.uploadFile.errorSpecial'));
    }
    return isJpgOrPng && isLt2M && !isContainSpecialCharacter(file.name);
  }

  render() {
    const { name, ...otherProps } = this.props
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
        >
          {this.state.fileList.length > 0 ? (
            ''
          ) : (
            <LogoContainer src="/images/logo/icon/enviroment.png" />
          )}
        </Upload>
      </View>
    )
  }
}
