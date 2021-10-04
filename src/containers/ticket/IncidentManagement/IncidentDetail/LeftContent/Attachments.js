import { Col, Icon, Popconfirm, Row, Upload } from 'antd'
import MediaApi from 'api/MediaApi'
import { Clearfix, Flex } from 'components/layouts/styles'
import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { withRouter } from 'react-router'
import styled from 'styled-components'
import { translate } from 'hoc/create-lang'

const uploadProps = {
  onError(err) {
    // console.log('onError', err)
  },
}

const PhotoItem = styled.div`
  width: 100%;
  height: 100%;
  background: url('${props => props.image}');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid #ccc;
  position: relative;
  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
  &:hover {
      cursor: pointer;
      .group-btn {
          display: block;
      }
  }
  .group-btn {
    display: none;
    position: absolute;
    top: 50px;
    left: 35px
  }
`

const getDatabaseName = organizationName => organizationName.replace(/_/g, '')

@withRouter
@connect(state => ({
  language: _.get(state, 'language.locale'),
  userInfo: state.auth.userInfo,
}))
export default class Attachments extends Component {
  state = {
    attachments: [],
  }

  componentDidMount() {
    this.fetchData()
  }

  customRequest = async ({ file, onError, onSuccess }) => {
    const {
      match: {
        params: { id },
      },
      userInfo,
    } = this.props

    const databaseName = getDatabaseName(
      userInfo.organization.databaseInfo.name
    )

    const generatePutUrl = MediaApi.generatePutUrl(databaseName)

    const fileNameUpload = `${file.uid}-${file.name}`

    const options = {
      params: {
        prefix: `ticket/${id}/${fileNameUpload}`,
        ContentType: file.type,
      },
      headers: {
        'Content-Type': file.type,
      },
    }

    try {
      const { data: putURL } = await axios.get(generatePutUrl, options)
      await axios.put(putURL, file, {
        headers: {
          'Content-Type': file.type,
        },
      })
      this.fetchData()
    } catch (error) {
      onError()
      console.log('err', error)
    }
  }

  fetchData = async () => {
    const {
      userInfo,
      match: {
        params: { id },
      },
    } = this.props
    const databaseName = getDatabaseName(
      userInfo.organization.databaseInfo.name
    )

    const result = await MediaApi.getAttachment(databaseName, id)
    const resultSorted = result.sort(
      (a, b) => new Date(b.lastModified) - new Date(a.lastModified)
    )
    this.setState({ attachments: resultSorted })
  }

  handleDeleteImage = name => async () => {
    const {
      userInfo,
      match: {
        params: { id },
      },
    } = this.props

    const databaseName = getDatabaseName(
      userInfo.organization.databaseInfo.name
    )
    await MediaApi.deleteAttachment(databaseName, id, name)
    this.fetchData()
  }

  render() {
    const { attachments } = this.state
    return (
      <div>
        <Flex justifyContent="space-between">
          <b>Đính kèm tệp</b>
          <Upload
            multiple
            showUploadList={false}
            // accept=".jpg, .png"
            {...uploadProps}
            // beforeUpload={this.beforeUpload}
            customRequest={this.customRequest}
          >
            <Icon
              type="plus"
              theme="outlined"
              style={{
                fontSize: 18,
                background: '#E6F7FF',
                borderRadius: 4,
                padding: 4,
                color: '#008EFA',
              }}
            />
          </Upload>
        </Flex>

        <Clearfix height={12} />
        <b>PDF, Excel, Word, SVG, PNG, JPG</b>

        <Clearfix height={12} />
        <Row gutter={[12, 12]}>
          {attachments.map(attachment => (
            <Col span={3}>
              <PhotoItem image={attachment.preview}>
                <div className="group-btn">
                  <div>
                    <i
                      style={{
                        fontSize: 18,
                        background: '#E6F7FF',
                        padding: 4,
                        color: '#008EFA',
                        marginRight: 12,
                      }}
                      class="fa fa-download"
                      aria-hidden="true"
                    ></i>
                    <Popconfirm
                      title={translate('addon.popConfirm.image.title')}
                      onConfirm={this.handleDeleteImage(attachment.name)}
                      okText={translate('addon.yes')}
                      cancelText={translate('addon.no')}
                      className="delete"
                    >
                      <i
                        style={{
                          marginRight: 12,
                          fontSize: 18,
                          background: '#FFF1F0',
                          padding: 4,
                          color: '#F5222D',
                        }}
                        className="fa fa-trash"
                      />
                    </Popconfirm>
                  </div>
                </div>
              </PhotoItem>
            </Col>
          ))}
        </Row>
      </div>
    )
  }
}
