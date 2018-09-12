import React from 'react'
import styled from 'styled-components'
import Label from '../label'
import swal from 'sweetalert2'
import { autobind } from 'core-decorators'
import { Upload } from 'antd'
import MediaApi from 'api/MediaApi'
import { translate } from 'hoc/create-lang'
import OrganizationApi from 'api/OrganizationApi'

const View = styled.div``

const LogoContainer = styled.img`
  height: 64px;
  width: auto;
`

@autobind
export default class UpdateLogo extends React.PureComponent {

  state = {
    fileList: []
  }

  async componentWillMount() {
    console.log( this.props.organization)
    if (this.props.organization && this.props.organization.logo) {
      this.updateFiles(this.props.organization.logo)
    }
  }

  handleImageChange = ({ fileList, file, event }) => {
    let newFileList = fileList
    if (file.status === 'error') {
      swal({
        title: translate('profileUser.imageUpload.error'),
        type: 'error'
      })
      newFileList = []
    }
    this.setState({
      fileList: newFileList
    })
    if (file.status === 'done') {
       // this.props.onChange(file.response.url)
      this.updateFiles(file.response.url)
      let data = this.props.organization
      if (data.logo){
        data.logo = file.response.url
      }else{
        data['logo'] = file.response.url
      }
      console.log(data)
      OrganizationApi.updateOrganization(data)
    }
  }
  
  updateFiles(url){
    this.setState({
      fileList:
       [{
         uid: -1,
         url,
         name: '',
         status: 'done'
       }
     ]}
   )
  }

  render() {
    const { name, ...otherProps } = this.props
    return (
      <View>
        {this.props.label && <Label>{this.props.label}</Label>}
        <Upload
          {...otherProps}
          action={MediaApi.urlPhotoUploadWithDirectory('logo')}
          listType="picture-card"
          fileList={this.state.fileList}
          onPreview={this.handlePreview}
          onChange={this.handleImageChange}
        >
          {this.state.fileList.length > 0 ? '' : <LogoContainer src="/images/logo/icon/enviroment.png" />}
        </Upload>
      </View>
    )
  }
}
