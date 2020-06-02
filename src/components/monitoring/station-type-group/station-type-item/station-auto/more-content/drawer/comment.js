import React from "react"
import { Button, Divider, Comment, Avatar, Spin, message } from "antd"
import styled from "styled-components"
import { translate } from "hoc/create-lang"
import moment from "moment"
import { connect } from "react-redux"
import _ from "lodash"
import {
  createEvaluateStation,
  deleteEvaluateStation,
  getEvaluateStation,
  editEvaluateStation,
} from "api/StationAuto"
import { CommentComponent, Editor } from "components/elements/comment"
import debounce from "lodash/debounce"
import { v4 as uuidV4 } from "uuid"
import swal from "sweetalert2"

const i18n = {
  title: translate("stationAutoManager.infoStation.title"),
  edit: translate("stationAutoManager.infoStation.edit"),
  career: translate("stationAutoManager.infoStation.career"),
  empty: translate("stationAutoManager.infoStation.emptyText"),
  yearOperate: translate("stationAutoManager.infoStation.yearOperate"),
  capacity: translate("stationAutoManager.infoStation.capacity"),
  processProdution: translate(
    "stationAutoManager.infoStation.processProdution"
  ),
  userResponsible: translate("stationAutoManager.infoStation.userResponsible"),
  userSupervisor: translate("stationAutoManager.infoStation.userSupervisor"),
  website: translate("stationAutoManager.infoStation.website"),
}

const Text = styled.p`
  font-size: 20px;
  margin: 0;
  line-height: normal;
`

const Title = styled.h4`
  margin-bottom: 20px;
`

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Image = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 45px;
`

const ButtonLink = styled(Button)`
  color: gray;
`

@connect((state) => ({
  userInfo: state.auth.userInfo,
}))
export default class StationComment extends React.Component {
  state = {
    isLoading: false,
    data: {},
    comments: [],
    submitting: false,
    value: "",
    valueFromEditComment: "",
    images: [],
  }

  setImages = (newImage) => {
    this.setState({ images: [...this.state.images, newImage] })
  }

  async componentDidMount() {
    this.setState({ isLoading: true }, async () => {
      const res = await getEvaluateStation(this.props.stationId)
      this.setState({
        isLoading: false,
        data: _.orderBy(
          res.data.stationList,
          (obj) => moment(obj.createdAt).format("YYYYMMDDHHmmss"),
          ["asc"]
        ),
      })
    })
  }

  getValueFromEditComment = (value) => {
    this.setState({ valueFromEditComment: value })
  }

  handleChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }

  handleSubmit = () => {
    const { firstName, lastName, avatar } = this.props.userInfo
    if (!this.state.value) {
      return
    }
    this.setState({
      submitting: true,
    })
    const newComment = {
      content: this.state.value,
      user: {
        firstName,
        lastName,
        avatar,
      },
      createdAt: moment().toString(),
      images: this.state.images,
    }
    this.setState({
      submitting: false,
      value: "",
      data: [...this.state.data, newComment],
    })
    const commentSend = {
      content: this.state.value,
      stationId: this.props.stationId,
      images: this.state.images,
    }
    createEvaluateStation(commentSend)
  }

  handleDelete = (_id) => {
    this.setState({
      data: [...this.state.data].filter((comment) => comment._id !== _id),
    })
    deleteEvaluateStation(_id)
  }

  handleEdit = (_id) => {
    const indexComment = this.state.data.findIndex(
      (comment) => comment._id === _id
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
          <Title>Đánh giá trạm</Title>
          <Divider />
          {!isLoading && data.length
            ? data.map((comment) => (
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
                setImages={this.setImages}
              />
            }
          />
        </React.Fragment>
      </Spin>
    )
  }
}
