import React from 'react'
import { Row, Col, Button, Divider, Avatar, Popconfirm } from 'antd'
import styled from 'styled-components'
import moment from 'moment'
import { translate } from 'hoc/create-lang'
import update from 'immutability-helper'
import ImageMoreInfo from './image'
import Editor from './Editor'
// import _ from 'lodash'
import 'moment/locale/vi'
import 'moment/locale/en-sg'
import { connect } from 'react-redux'

const Text = styled.p`
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
@connect(state => ({
  locale: state.language.locale,
}))
export class CommentComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isEdit: false,
      value: props.content,
      isCancel: false,
      images: props.images,
    }
  }

  handleChange = ({ value, images }) => {
    this.setState({
      value,
      images,
    })
  }

  handleOpenEditor = () => {
    this.setState({ isCancel: false, isEdit: true })
  }

  handleHideEditor = () => {
    this.setState({ isEdit: false })
  }

  handleCancel = () => {
    this.setState({
      isCancel: true,
      isEdit: false,
      value: this.props.content,
      images: this.props.images,
    })
  }

  handleDeleteReview = () => {
    const { _id, handleDelete } = this.props
    handleDelete(_id)
  }

  handleAddImage = imgUrl => {
    this.setState(prevState =>
      update(prevState, {
        images: {
          $push: [imgUrl],
        },
      })
    )
  }

  renderContent = () => {
    const { content, handleEdit, _id, stationId } = this.props
    const { isEdit, isCancel } = this.state
    if (isEdit) {
      return (
        <React.Fragment>
          <Editor
            isEdit
            onSubmitEdit={handleEdit}
            _id={_id}
            value={this.state.value}
            images={this.state.images}
            onHideEditor={this.handleHideEditor}
            onChange={this.handleChange}
          />
          <Row type="flex">
            <Col span={24}>
              <ImageMoreInfo
                isCancel={isCancel}
                itemInline={6}
                isEdit={isEdit}
                commentId={_id}
                value={this.state.value}
                images={this.state.images}
                content={content}
                stationId={stationId}
                onChange={this.handleChange}
              />
            </Col>
          </Row>
          <ButtonLink
            style={{ marginBottom: '8px', padding: '0px' }}
            onClick={this.handleCancel}
            type="link"
          >
            {translate('stationReview.action.cancel')}
          </ButtonLink>
        </React.Fragment>
      )
    }
    return (
      <React.Fragment>
        <Text style={{ marginTop: '10px' }}>{content}</Text>
        <Row style={{ marginTop: 8 }} type="flex">
          <Col span={24}>
            <ImageMoreInfo
              isCancel={isCancel}
              itemInline={3}
              isEdit={isEdit}
              commentId={_id}
              images={this.props.images}
              content={this.props.content}
              stationId={stationId}
            />
          </Col>
        </Row>
        <Flex>
          <ButtonLink
            onClick={this.handleOpenEditor}
            style={{ padding: '0px' }}
            type="link"
          >
            {translate('stationReview.action.edit')}
          </ButtonLink>
          <Popconfirm
            title={translate('addon.popConfirm.reviewStation.title')}
            onConfirm={this.handleDeleteReview}
            okText={translate('addon.yes')}
            cancelText={translate('addon.no')}
          >
            <ButtonLink type="link">
              {translate('stationReview.action.delete')}
            </ButtonLink>
          </Popconfirm>
        </Flex>
      </React.Fragment>
    )
  }

  render() {
    const { user, createdAt, locale } = this.props
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
                {firstName} {lastName}
              </Text>
              <Text
                style={{
                  marginLeft: '10px',
                  color: 'gray',
                  fontSize: '13px',
                }}
              >
                {moment(createdAt)
                  .locale(locale)
                  .fromNow()}
              </Text>
            </Flex>
            {this.renderContent()}
          </Col>
        </Row>
        <Divider />
      </div>
    )
  }
}
