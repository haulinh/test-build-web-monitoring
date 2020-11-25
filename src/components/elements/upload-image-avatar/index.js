import React from 'react'
import styled from 'styled-components'
import Label from '../label'
import swal from 'sweetalert2'
import { autobind } from 'core-decorators'
import PropTypes from 'prop-types'
import { Upload, Icon, message } from 'antd'
import update from 'react-addons-update'
import MediaApi from 'api/MediaApi'
import { translate } from 'hoc/create-lang'
import { isContainSpecialCharacter } from 'utils/string'

const View = styled.div``

const uploadButton = (
  <div>
    <Icon type="plus" />
    <div className="ant-upload-text">Upload</div>
  </div>
)

@autobind
export default class UpdateLoadImage extends React.PureComponent {
  static propTypes = {
    value: PropTypes.string,
  }

  state = {
    fileList: [],
  }

  getFileLists() {
    return [
      {
        uuid: -1,
        url: this.props.value,
        name: '',
      },
    ]
  }

  async componentWillMount() {
    if (this.props.value) {
      this.setState(
        update(this.state, {
          fileList: {
            $push: [
              {
                uid: -1,
                url: this.props.value,
                name: '',
                status: 'done',
              },
            ],
          },
        }),
        () => {
          //console.log(this.state)
        }
      )
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
      this.props.onChange(file.response.url)
    }
    if (fileList.length === 0) {
      this.props.onChange('')
    }
  }

  beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error(translate('stationAutoManager.uploadFile.errorType'))
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error(translate('stationAutoManager.uploadFile.errorSize'))
    }
    if (isContainSpecialCharacter(file.name)) {
      message.error(translate('stationAutoManager.uploadFile.errorSpecial'))
    }
    return isJpgOrPng && isLt2M && !isContainSpecialCharacter(file.name)
  }

  render() {
    const { name, ...otherProps } = this.props
    return (
      <View>
        {this.props.label && <Label>{this.props.label}</Label>}
        <Upload
          {...otherProps}
          beforeUpload={this.beforeUpload}
          action={MediaApi.urlPhotoUploadWithDirectory('profile')}
          listType="picture-card"
          fileList={this.state.fileList}
          onPreview={this.handlePreview}
          onChange={this.handleImageChange}
        >
          {this.state.fileList.length > 0 ? '' : uploadButton}
        </Upload>
      </View>
    )
  }
}
