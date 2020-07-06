import React from 'react'
import { Divider, Comment, Avatar, Spin } from 'antd'
import styled from 'styled-components'
import moment from 'moment'
import update from 'immutability-helper'
import { connect } from 'react-redux'
import { translate } from 'hoc/create-lang'
import _ from 'lodash'
import {
  createEvaluateStation,
  deleteEvaluateStation,
  getEvaluateStation,
  editEvaluateStation,
} from 'api/StationAuto'
import { CommentComponent } from 'components/elements/comment'
import Editor from 'components/elements/comment/Editor'

const Title = styled.h4`
  margin-bottom: 20px;
`

@connect(state => ({
  userInfo: state.auth.userInfo,
}))
export default class StationComment extends React.Component {
  state = {
    isLoading: false,
    data: {},
    submitting: false,
    value: '',
    valueFromEditComment: '',
    images: [],
  }

  handleAddImage = newImage => {
    this.setState(prevState => ({ images: [...prevState.images, newImage] }))
  }

  handleResetImage = () => {
    this.setState({ images: [] })
  }

  handleDeleteImage = index => {
    this.setState(prevState =>
      update(prevState, {
        images: {
          $splice: [[index, 1]],
        },
      })
    )
  }

  async componentDidMount() {
    this.setState({ isLoading: true }, async () => {
      const res = await getEvaluateStation(this.props.stationId)
      this.setState({
        isLoading: false,
        data: _.orderBy(
          res.data.stationList,
          obj => moment(obj.createdAt).format('YYYYMMDDHHmmss'),
          ['asc']
        ),
      })
    })
  }

  getValueFromEditComment = value => {
    this.setState({ valueFromEditComment: value })
  }

  handleChange = e => {
    this.setState({
      value: e.target.value,
    })
  }

  handleSubmit = async () => {
    if (_.isEmpty(this.state.images) & !this.state.value) return
    this.setState({
      submitting: true,
    })
    const commentSend = {
      content: this.state.value ? this.state.value : ' ',
      stationId: this.props.stationId,
      images: this.state.images,
    }
    const { data } = await createEvaluateStation(commentSend)
    const newComment = {
      _id: data._id,
      content: data.content,
      user: data.user,
      createdAt: data.createdAt,
      images: data.images,
    }
    this.setState({
      submitting: false,
      value: '',
      data: [...this.state.data, newComment],
    })
  }

  handleDelete = _id => {
    this.setState({
      data: [...this.state.data].filter(comment => comment._id !== _id),
    })
    deleteEvaluateStation(_id)
  }

  handleEdit = _id => {
    const indexComment = this.state.data.findIndex(
      comment => comment._id === _id
    )
    const comment = { ...this.state.data[indexComment] }
    comment.content = this.state.valueFromEditComment

    const data = [...this.state.data]
    data[indexComment] = comment

    this.setState({ data })

    const editedComment = {
      content: this.state.valueFromEditComment,
      stationId: this.props.stationId,
      _id,
    }

    editEvaluateStation(editedComment)
  }

  render() {
    const { userInfo } = this.props
    const { data, isLoading, submitting, value } = this.state
    return (
      <Spin spinning={isLoading}>
        <React.Fragment>
          <Title>{translate('stationReview.title')}</Title>
          <Divider />
          {!isLoading && data.length
            ? data.map(comment => (
                <CommentComponent
                  content={this.state.valueFromEditComment}
                  stationId={this.props.stationId}
                  valueTextArea={value}
                  onChangeTextArea={this.handleChange}
                  {...comment}
                  key={comment._id}
                  handleDelete={this.handleDelete}
                  handleEdit={this.handleEdit}
                  getValueFromEditComment={this.getValueFromEditComment}
                />
              ))
            : null}

          <Comment
            avatar={<Avatar src={userInfo.avatar} />}
            content={
              <Editor
                value={value}
                onChange={this.handleChange}
                onSubmit={this.handleSubmit}
                submitting={submitting}
                onResetImage={this.handleResetImage}
                onAddImage={this.handleAddImage}
                onDeleteImage={this.handleDeleteImage}
                images={this.state.images}
                placeholder={translate('stationReview.form.placeholder')}
              />
            }
          />
        </React.Fragment>
      </Spin>
    )
  }
}
