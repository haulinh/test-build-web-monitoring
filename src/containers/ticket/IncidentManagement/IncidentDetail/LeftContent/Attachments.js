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

export const AttachmentItem = styled(Col)`
  width: 100px;
  height: 100px;
  margin: 8px;
  position: relative;
  background: #eef3ff;
  border-radius: 4px;
  padding: 0 !important;

  &:hover .action {
    display: flex;
  }

  img {
    width: 100%;
    max-height: 100%;
  }

  .action {
    position: absolute;
    display: none;
    align-items: center;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    justify-content: center;
    .anticon {
      padding: 6px;
      cursor: pointer;
      background: #fff;
      margin-left: 4px;
      font-size: 20px;
    }
    & i:first-child:hover {
      color: #2c4bee;
    }
    & i:last-child:hover {
      color: #a8071a;
    }
  }
  .filename {
    width: 100%;
    > div {
      max-width: 92%;
      text-overflow: ellipsis;
      white-space: pre;
      overflow: hidden;
      margin: 0 0 6px 6px;
      color: white;
    }
    bottom: 0;
    position: absolute;
    font-size: 8px;
    background: linear-gradient(
      180deg,
      rgba(38, 38, 38, 0) 0%,
      rgba(38, 38, 38, 0.7) 50.34%
    );
    opacity: 0.75;
    height: 40px;
    display: flex;
    align-items: flex-end;
    color: #262626;
  }
`

export const Extension = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  font-size: 24px;
  color: #262626;
`

const getDatabaseName = organizationName => organizationName.replace(/_/g, '')

const Attachment = props => {
  const { attachment, onDelete, onDownload } = props

  const isImage = ext => ['jpg', 'jpeg', 'png', 'svg'].includes(ext)

  return (
    <AttachmentItem>
      {isImage(attachment.extension) ? (
        <img src={attachment.preview} alt="" />
      ) : (
        <Extension>{attachment.extension}</Extension>
      )}
      <div className="action">
        <Icon type="download" theme="outlined" onClick={onDownload} />
        <Popconfirm
          title={translate('addon.popConfirm.attachment.title')}
          onConfirm={onDelete}
          okText={translate('addon.yes')}
          cancelText={translate('addon.no')}
        >
          <Icon type="delete" theme="outlined" />
        </Popconfirm>
      </div>
      <div className="filename">
        <div>{attachment.name}</div>
      </div>
    </AttachmentItem>
  )
}

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

    const options = {
      params: {
        prefix: `ticket/${id}/${file.name}`,
        ContentType: file.type,
      },
      headers: {
        'Content-Type': file.type,
      },
    }

    try {
      this.setState({ loading: true })
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
    this.setState({ loading: false })
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
    console.log({ result })
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
        <Spin spinning={loading}>
          <Row type="flex" gutter={[12, 12]}>
            {attachments.map(attachment => (
              <Attachment
                key={attachment.name}
                attachment={attachment}
                onDelete={this.handleDeleteImage(attachment.name)}
                onDownload={() =>
                  this.handleDownFile(attachment.preview, attachment.name)
                }
              />
            ))}
          </Row>
        </Spin>
      </div>
    )
  }
}
