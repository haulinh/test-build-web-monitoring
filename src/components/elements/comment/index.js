import React from "react"
import {
  Row,
  Col,
  Button,
  Icon,
  Divider,
  Input,
  Avatar,
  Form,
  Upload,
  message,
} from "antd"
import styled from "styled-components"
import { translate } from "hoc/create-lang"
import moment from "moment"
import ImageMoreInfo from "./image"
import MediaApi from "api/MediaApi"
import { v4 as uuidV4 } from "uuid"
import swal from "sweetalert2"
import debounce from "lodash/debounce"
import { editEvaluateStation } from "api/StationAuto"

const { TextArea } = Input

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

export const Editor = ({
  onChange,
  onSubmit,
  submitting,
  value,
  isEdit,
  handleEdit,
  hideEditor,
  _id,
  setImages,
}) => {
  const handleSubmit = () => {
    if (isEdit) {
      handleEdit(_id)
      hideEditor()
    } else {
      onSubmit()
    }
  }

  const handleImageChange = ({ fileList, file, event }) => {
    if (file.status === "done") {
      setImages(file.response.file.path)
    }
  }

  return (
    <div style={{ marginTop: !isEdit ? "0px" : "10px" }}>
      <Form.Item>
        <Flex
          style={{ justifyContent: !isEdit ? "space-around" : "space-between" }}
        >
          <TextArea
            style={{ maxWidth: "80%" }}
            onChange={onChange}
            value={value}
          />
          <Upload
            shape='circle-outline'
            size='large'
            multiple
            showUploadList={false}
            accept='.jpg, .png, .svg, jpeg'
            action={MediaApi.urlPhotoUploadWithDirectory("station")}
            onChange={handleImageChange}
          >
            <Button shape='circle-outline' size='large'>
              <Icon type='picture' theme='outlined' />
            </Button>
          </Upload>
          <Button
            shape='circle-outline'
            size='large'
            type='primary'
            htmlType='submit'
            loading={submitting}
            onClick={handleSubmit}
          >
            <Icon type='yuque' theme='outlined' />
          </Button>
        </Flex>
      </Form.Item>
    </div>
  )
}

export class CommentComponent extends React.Component {
  state = {
    isEdit: false,
    value: this.props.content,
  }

  handleChange = (e) => {
    this.setState({
      value: e.target.value,
    })
    this.props.getValueFromEditComment(e.target.value)
  }

  renderContent = () => {
    const { content, handleDelete, handleEdit, _id } = this.props
    const { isEdit, value } = this.state
    if (!isEdit) {
      return (
        <React.Fragment>
          <Text style={{ marginTop: "10px" }}>{content}</Text>
          <Flex>
            <ButtonLink
              onClick={() => this.setState({ isEdit: true })}
              style={{ padding: "0px" }}
              type='link'
            >
              edit
            </ButtonLink>
            <ButtonLink onClick={() => handleDelete(_id)} type='link'>
              delete
            </ButtonLink>
          </Flex>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <Editor
            hideEditor={() => this.setState({ isEdit: false })}
            isEdit={isEdit}
            handleEdit={handleEdit}
            _id={_id}
            value={value}
            onChange={this.handleChange}
          />
          <ButtonLink
            style={{ margin: "0px", padding: "0px" }}
            onClick={() => this.setState({ isEdit: false })}
            type='link'
          >
            cancel
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
        <Row>
          <Col span={2}>
            <Avatar size='large' src={avatar && avatar} />
          </Col>
          <Col span={!isEdit ? 10 : 20}>
            <Flex>
              <Text style={{ fontWeight: "bold" }}>
                {lastName} {firstName}
              </Text>
              <Text
                style={{ marginLeft: "10px", color: "gray", fontSize: "13px" }}
              >
                {moment(createdAt).fromNow()}
              </Text>
            </Flex>
            {this.renderContent()}
          </Col>
          <Col span={12}>
            <ImageMoreInfo
              commentId={_id}
              images={images}
              content={content}
              stationId={stationId}
            />
          </Col>
        </Row>
        <Divider />
      </div>
    )
  }
}
