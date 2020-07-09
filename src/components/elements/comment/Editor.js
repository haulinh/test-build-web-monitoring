import React from 'react'
import PropTypes from 'prop-types'
import {
  Row,
  Col,
  Button,
  Icon,
  Input,
  Form,
  Upload,
  Spin,
  Popconfirm,
} from 'antd'
import update from 'immutability-helper'
import styled from 'styled-components'
import { getConfigApi } from 'config'
import MediaApi from 'api/MediaApi'

const { TextArea } = Input

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${props =>
    props.isEdit ? 'space-between' : 'space-around'};
`

const Image = styled.div`
  background: ${props => `url("${props.bgUrl}")`};
  width: 100%;
  height: 120px;
  background-size: cover;
  background-repeat: no-repeat;
  :after {
    content: ${props => props.content && `'+${props.content}'`};
    background-color: #d8d8d85c;
    position: absolute;
    top: 0px;
    right: 0px;
    left: 0px;
    bottom: 0px;
    font-size: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }
`

const ImageWrapper = styled.div`
  position: relative;
  transition: transform 0.25s ease;
  :hover {
    cursor: pointer;
    .delete {
      display: flex;
    }
  }
  .delete {
    display: none;
    position: absolute;
    right: -10px;
    top: -10px;
    color: #fff;
    background: red;
    border-radius: 10px;
    width: 20px;
    height: 20px;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }
`

const ImageComponent = ({
  index,
  image,
  handleDeleteImage,
  isHide,
  imageLength,
  itemInline,
}) => {
  if (isHide) return null
  return (
    <ImageWrapper>
      <Popconfirm
        title="Are you sure delete this image?"
        onConfirm={handleDeleteImage(index)}
        okText="Yes"
        cancelText="No"
        className="delete"
      >
        <i className="fa fa-trash" />
      </Popconfirm>
      <Image
        bgUrl={image}
        key={index}
        content={index === itemInline - 1 ? imageLength - itemInline : null}
      />
    </ImageWrapper>
  )
}

export default class Editor extends React.Component {
  static propTypes = {
    onSubmitEdit: PropTypes.func,
    onHideEditor: PropTypes.func,
    onSubmit: PropTypes.func,

    onChange: PropTypes.func,

    isEdit: PropTypes.bool,
    value: PropTypes.string,
    images: PropTypes.array,
  }

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      value: props.value,
      images: props.images,
    }
  }

  handleSubmit = () => {
    if (this.props.isEdit) {
      this.props.onSubmitEdit({
        _id: this.props._id,
        value: this.state.value,
        images: this.props.images,
      })
      this.props.onHideEditor()
    } else {
      this.props.onSubmit()
      this.handleReset()
    }
  }

  handleReset = () => {
    this.setState({ value: '', images: [] }, () => {
      this.handleOnChange()
    })
  }

  handleAddImage = ({ fileList, file, event }) => {
    if (file.status === 'uploading') {
      this.setState({ isLoading: true })
    }
    if (file.status === 'done') {
      this.setState(
        prevState =>
          update(prevState, {
            images: {
              $push: [file.response.file.path],
            },
            isLoading: {
              $set: false,
            },
          }),
        () => {
          this.handleOnChange()
        }
      )
    }
  }

  getUrlMedia = url => {
    return url.replace('public', getConfigApi().media)
  }

  handleDeleteImage = index => () => {
    this.setState(
      prevState =>
        update(prevState, {
          images: {
            $splice: [[index, 1]],
          },
        }),
      () => {
        this.handleOnChange()
      }
    )
  }

  handleOnChange = () => {
    if (this.props.onChange) {
      this.props.onChange(this.state)
    }
  }

  handleOnChangeEditor = e => {
    this.setState({ value: e.target.value }, () => {
      this.handleOnChange()
    })
  }

  render() {
    const { submitting, isEdit, placeholder } = this.props
    return (
      <div style={{ marginTop: !isEdit ? '0px' : '10px' }}>
        {!isEdit && (
          <React.Fragment>
            <Row type="flex" gutter={[16, 16]}>
              {this.state.images.map((image, index) => (
                <Col span={4} key={index}>
                  <ImageComponent
                    itemInline={4}
                    handleDeleteImage={this.handleDeleteImage}
                    image={this.getUrlMedia(image)}
                    index={index}
                    isHide={index > 3}
                    imageLength={this.state.images.length}
                  />
                </Col>
              ))}
            </Row>
          </React.Fragment>
        )}
        <Form.Item>
          <Flex isEdit={isEdit}>
            <TextArea
              style={{
                marginRight: 16,
              }}
              onChange={this.handleOnChangeEditor}
              value={this.state.value}
              placeholder={placeholder}
            />
            <Upload
              shape="circle-outline"
              size="large"
              multiple
              showUploadList={false}
              accept=".jpg, .png, .svg, jpeg"
              action={MediaApi.urlPhotoUploadWithDirectory('station')}
              onChange={this.handleAddImage}
            >
              {!this.props.isEdit && (
                <Button
                  style={{ marginRight: 8 }}
                  shape="circle-outline"
                  size="large"
                >
                  {this.state.isLoading ? (
                    <Spin />
                  ) : (
                    <Icon type="picture" theme="outlined" />
                  )}
                </Button>
              )}
            </Upload>
            <Button
              disabled={!this.state.value}
              shape="circle-outline"
              size="large"
              type="primary"
              htmlType="submit"
              loading={submitting}
              onClick={this.handleSubmit}
            >
              {!submitting && (
                <i className="fa fa-paper-plane" aria-hidden="true" />
              )}
            </Button>
          </Flex>
        </Form.Item>
      </div>
    )
  }
}
