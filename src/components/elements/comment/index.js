import React from 'react'
import { Row, Col, Button, Divider, Avatar } from 'antd'
import styled from 'styled-components'
import moment from 'moment'
import { translate } from 'hoc/create-lang'
import ImageMoreInfo from './image'
import Editor from './Editor'
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
      value: this.props.content,
      isCancel: false,
    }
  }

  handleChange = e => {
    this.setState({
      value: e.target.value,
    })
    this.props.getValueFromEditComment(e.target.value)
  }

  handleHideEditor = () => this.setState({ isEdit: false })

  handleCancel = () => this.setState({ isCancel: true, isEdit: false })

  handleOpenEditor = () => {
    this.setState({ isCancel: false })
    this.setState({ isEdit: true })
  }

  renderContent = () => {
    const {
      content,
      handleDelete,
      handleEdit,
      _id,
      images,
      stationId,
    } = this.props
    const { isEdit, value, isCancel } = this.state
    return !isEdit ? (
      <React.Fragment>
        <Text style={{ marginTop: '10px' }}>{content}</Text>
        <Row style={{ marginTop: 8 }} type="flex">
          <Col span={24}>
            <ImageMoreInfo
              ref={instance => {
                this.child = instance
              }}
              isCancel={isCancel}
              itemInline={3}
              isEdit={isEdit}
              commentId={_id}
              images={images}
              content={content}
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
          <ButtonLink onClick={() => handleDelete(_id)} type="link">
            {translate('stationReview.action.delete')}
          </ButtonLink>
        </Flex>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <Editor
          handleImagesSubmit={this.handleImagesSubmit}
          hideEditor={this.handleHideEditor}
          isEdit={isEdit}
          handleEdit={handleEdit}
          _id={_id}
          value={value}
          onChange={this.handleChange}
        />
        <Row type="flex">
          <Col span={24}>
            <ImageMoreInfo
              isCancel={isCancel}
              itemInline={6}
              isEdit={isEdit}
              commentId={_id}
              images={images}
              content={content}
              stationId={stationId}
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

  render() {
    const { user, createdAt } = this.props
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
                {moment(createdAt)
                  .locale(this.props.locale)
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
