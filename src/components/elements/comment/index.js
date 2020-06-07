import React from 'react'
import { Row, Col, Button, Divider, Avatar } from 'antd'
import styled from 'styled-components'
import moment from 'moment'
import ImageMoreInfo from './image'
import Editor from './Editor'

const Text = styled.p`
  font-size: 20px;
  margin: 0;
  line-height: normal;
`

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const ButtonLink = styled(Button)`
  color: gray;
`

export class CommentComponent extends React.Component {
  state = {
    isEdit: false,
    value: this.props.content,
  }

  handleChange = e => {
    this.setState({
      value: e.target.value,
    })
    this.props.getValueFromEditComment(e.target.value)
  }

  handleHideEditor = () => {
    this.setState({ isEdit: false })
  }

  handleOpenEditor = () => {
    this.setState({ isEdit: true })
  }

  renderContent = () => {
    const { content, handleDelete, handleEdit, _id } = this.props
    const { isEdit, value } = this.state
    if (!isEdit) {
      return (
        <React.Fragment>
          <Text style={{ marginTop: '10px' }}>{content}</Text>
          <Flex>
            <ButtonLink
              onClick={this.handleOpenEditor}
              style={{ padding: '0px' }}
              type="link"
            >
              Edit
            </ButtonLink>
            <ButtonLink onClick={() => handleDelete(_id)} type="link">
              Delete
            </ButtonLink>
          </Flex>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <Editor
            hideEditor={this.handleHideEditor}
            isEdit={isEdit}
            handleEdit={handleEdit}
            _id={_id}
            value={value}
            onChange={this.handleChange}
          />
          <ButtonLink
            style={{ marginBottom: '8px', padding: '0px' }}
            onClick={this.handleHideEditor}
            type="link"
          >
            Cancel
          </ButtonLink>
        </React.Fragment>
      )
    }
  }

  render() {
    const { user, createdAt, _id, images, content, stationId } = this.props
    const { firstName, lastName, avatar } = user
    const { isEdit } = this.state

    return (
      <div>
        <Row type="flex">
          <Col span={2}>
            <Avatar size="large" src={avatar && avatar} />
          </Col>
          <Col span={isEdit ? 22 : 10}>
            <Flex>
              <Text style={{ fontWeight: 'bold' }}>
                {lastName} {firstName}
              </Text>
              <Text
                style={{ marginLeft: '10px', color: 'gray', fontSize: '13px' }}
              >
                {moment(createdAt).fromNow()}
              </Text>
            </Flex>
            {this.renderContent()}
          </Col>
          {!isEdit && (
            <Col span={12}>
              <ImageMoreInfo
                itemInline={3}
                isEdit={isEdit}
                commentId={_id}
                images={images}
                content={content}
                stationId={stationId}
              />
            </Col>
          )}
        </Row>
        {isEdit && (
          <Row type="flex">
            <Col span={24}>
              <ImageMoreInfo
                itemInline={6}
                isEdit={isEdit}
                commentId={_id}
                images={images}
                content={content}
                stationId={stationId}
              />
            </Col>
          </Row>
        )}
        <Divider />
      </div>
    )
  }
}
