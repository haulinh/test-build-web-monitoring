import { Col, Icon, notification, Popconfirm, Row, Spin, Upload } from 'antd'
import MediaApi from 'api/MediaApi'
import axios from 'axios'
import { Clearfix, Flex } from 'components/layouts/styles'
import { translate } from 'hoc/create-lang'
import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import styled from 'styled-components'
import { downloadAttachment } from 'utils/downFile'
import { i18n } from '../../index'

const uploadProps = {
  onError(err) {
    // console.log('onError', err)
  },
}

const PhotoItem = styled.div`
  width: 100%;
  height: 100%;
  background: url('${props => props.image}');
  background: ${props => (props.isImage ? `url(${props.image})` : '#eef3ff')};
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
    top: 40px;
    left: 25px;
    z-index: 9;
  }
`

const Extension = styled.div`
  position: absolute;
  top: 35px;
  left: 35px;
  font-size: 22px;
  font-weight: 400;
  color: black;
`
const Name = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
`

const Blur = styled.div`
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.8) 50.34%
  );
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
    loading: false,
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
      setUpdatedAt,
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
      setUpdatedAt()
      this.fetchData()
      notification.success({ message: i18n().notificationSuccess })
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
    this.setState({ loading: true })
    const result = await MediaApi.getAttachment(databaseName, id)
    this.setState({ loading: false })
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
      setUpdatedAt,
    } = this.props

    const databaseName = getDatabaseName(
      userInfo.organization.databaseInfo.name
    )
    await MediaApi.deleteAttachment(databaseName, id, name)
    setUpdatedAt()
    this.fetchData()
    notification.success({ message: i18n().notificationSuccess })
  }

  handleDownFile = async (url, name) => {
    const result = await axios.get(url)
    downloadAttachment({
      data: result.data,
      name: name,
      type: result.headers['content-type'],
    })
  }

  isImage = extension => {
    return ['png', 'jpg', 'svg', 'jpeg'].includes(extension)
  }

  render() {
    const { attachments, loading } = this.state
    return (
      <div>
        <Flex justifyContent="space-between">
          <b>{translate('ticket.label.incident.attachment')}</b>
          <Upload
            multiple
            accept=".jpg, .png, .svg, jpeg, .excel, .pdf"
            showUploadList={false}
            {...uploadProps}
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
          <Spin spinning={loading}>
            {attachments.map(attachment => (
              <Col span={3}>
                <PhotoItem
                  image={attachment.preview}
                  isImage={this.isImage(attachment.extension)}
                >
                  {!this.isImage(attachment.extension) && (
                    <Extension>{attachment.extension}</Extension>
                  )}
                  <div className="group-btn">
                    <Flex>
                      <i
                        onClick={() =>
                          this.handleDownFile(
                            attachment.preview,
                            attachment.name
                          )
                        }
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
                    </Flex>
                  </div>
                  <Name>
                    <Blur>
                      <div
                        style={{
                          maxWidth: '105px',
                          fontSize: 14,
                          textOverflow: 'ellipsis',
                          whiteSpace: 'pre',
                          overflow: 'hidden',
                        }}
                      >{`${attachment.name}.${attachment.extension}`}</div>
                    </Blur>
                  </Name>
                </PhotoItem>
              </Col>
            ))}
          </Spin>
        </Row>
      </div>
    )
  }
}
