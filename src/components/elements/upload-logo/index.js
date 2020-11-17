import React from 'react'
import styled from 'styled-components'
import Label from '../label'
import swal from 'sweetalert2'
import { autobind } from 'core-decorators'
import { Upload } from 'antd'
import MediaApi from 'api/MediaApi'
import { translate } from 'hoc/create-lang'
import axios from 'axios'

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

  customRequest = async ({
    action,
    data,
    file,
    filename,
    headers,
    onError,
    onProgress,
    onSuccess,
    withCredentials,
  }) => {
    // const { onSuccess, onError, file, onProgress } = options

    const fmData = new FormData()
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      'X-Requested-With': 'XMLHttpRequest',
    }
    console.log(file, '---file--')
    const fileName = file.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    fmData.append('file', file, fileName)
    try {
      const res = await axios.post(
        MediaApi.urlPhotoUploadWithDirectory('logo'),
        fmData,
        config
      )

      onSuccess({
        ...res.data,
      })
      // console.log('server res: ', res)
    } catch (err) {
      // console.log('Eroor: ', err)
      // const error = new Error('Some error')
      onError({ err })
    }
  }

  render() {
    const { name, ...otherProps } = this.props
    return (
      <View>
        {this.props.label && <Label>{this.props.label}</Label>}
        <Upload
          {...otherProps}
          // action={ MediaApi.urlPhotoUploadWithDirectory('logo')}
          listType="picture-card"
          fileList={this.state.fileList}
          onChange={this.handleImageChange}
          disabled={!this.props.isAdmin}
          customRequest={this.customRequest}
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
