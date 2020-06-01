import React from "react"
import PropTypes from "prop-types"
import { withRouter } from "react-router"
import StationAutoApi from "api/StationAuto"
import MediaApi from "api/MediaApi"
import update from "immutability-helper"
import { v4 as uuidV4 } from "uuid"
import { Row, Col, Upload, Icon, message, Spin, Popconfirm } from "antd"
import Button from "components/elements/button"
import styled from "styled-components"
import { getConfigApi } from "config"
import swal from "sweetalert2"
import { translate } from "hoc/create-lang"
import debounce from "lodash/debounce"
import Gallery from "components/elements/gallery"
import { editEvaluateStation } from "api/StationAuto"

const Wrapper = styled(Row)`
  transition: transform 0.25s ease;
  .delete {
    display: none;
    position: absolute;
    right: 0px;
    top: -8px;
    color: red;
    width: 20px;
    height: 20px;
    align-items: center;
    z-index: 2;
  }
  .image-item {
    position: relative;
    cursor: pointer;
    :hover {
      .delete {
        display: flex;
      }
    }
  }
  .ant-upload {
    min-height: 100px;
  }
  .ant-upload-picture-card-wrapper,
  .ant-upload {
    width: 100%;
    height: 100%;
  }
  .image-gallery-thumbnail .image-gallery-thumbnail-image {
    min-height: 100px;
    max-height: 200px;
  }
`

const HeadingWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
  justify-content: space-between;
`
const ImageComponent = ({
  index,
  image,
  handleDeleteImage,
  handleViewGalleryClick,
  length,
}) => {
  let span = 8
  if (length < 3) {
    span = 12
  }
  return (
    <Col className='image-item' span={span}>
      <Popconfirm
        title='Are you sure delete this task?'
        onConfirm={handleDeleteImage(index)}
        okText='Yes'
        cancelText='No'
        className='delete'
      >
        <i className='fa fa-trash' />
      </Popconfirm>
      <img
        style={{ flex: 1, objectFit: "cover" }}
        onClick={handleViewGalleryClick(index)}
        key={image._id}
        width='100%'
        height='100%'
        src={image.thumbnail}
        alt={image._id}
      />
    </Col>
  )
}

@withRouter
export default class ImageMoreInfo extends React.Component {
  static propTypes = {
    commentId: PropTypes.string,
  }
  static defaultProps = {}

  state = {
    visible: false,
    loading: false,
    uploading: false,
    images: this.props.images,
    items: [],
    fileList: [],
  }

  componentDidMount() {
    this.setState({
      images: this.props.images,
      items: this.getImages(this.state.images),
    })
  }

  getUrlMedia(url) {
    return getConfigApi().media + url.replace("public", "")
  }

  handleViewGalleryClick = (index) => () => {
    this.setState({ visible: true })
    this.galleryRef.slideToIndex(index)
  }

  handleCloseGallery = () => {
    this.setState({ visible: false })
  }

  handleImageChange = ({ fileList, file, event }) => {
    let newFileList = fileList
    if (file.status === "uploading") {
      this.setState({ uploading: true })
    }
    if (file.status === "error") {
      this.setState({ uploading: false })
      swal({
        title: translate("profileUser.imageUpload.error"),
        type: "error",
      })
      newFileList = []
    }
    this.setState({
      fileList: newFileList,
    })
    if (file.status === "done") {
      this.setState(
        (prevState) => ({
          images: [...prevState.images, file.response.file.path],
          items: [
            ...prevState.items,
            {
              _id: uuidV4(),
              component: "gallery.photo",
              original: file.response.url,
              thumbnail: file.response.url,
            },
          ],
          uploading: false,
        }),
        async () => {
          await this.handleUpdateStation()
        }
      )
      if (this.props.onChange) {
        this.props.onChange(file.response.url)
      }
    }
    if (fileList.length === 0) {
      if (this.props.onChange) this.props.onChange("")
    }
  }

  handleUpdateStation = debounce(async () => {
    await editEvaluateStation({
      _id: this.props.commentId,
      stationId: this.props.stationId,
      images: this.state.images,
    })
    message.success(translate("stationAutoManager.update.success"))
  }, 1200)

  handleDeleteImage = (index) => () => {
    this.setState(
      (prevState) =>
        update(prevState, {
          images: {
            $splice: [[index, 1]],
          },
          items: {
            $splice: [[index, 1]],
          },
        }),
      () => {
        this.handleUpdateStation()
      }
    )
  }

  renderHeader = () => (
    <HeadingWrapper>
      <Upload
        multiple
        showUploadList={false}
        accept='.jpg, .png, .svg, jpeg'
        action={MediaApi.urlPhotoUploadWithDirectory("station")}
        onChange={this.handleImageChange}
      >
        <Button isLoading={this.state.uploading} customColor='primary'>
          {translate("stationAutoManager.image.create")}
        </Button>
      </Upload>
    </HeadingWrapper>
  )

  renderImages = () => {
    const images = this.state.items
    if (!this.state.loading && images.length) {
      if (images.length > 3) {
        return (
          <React.Fragment>
            <ImageComponent
              handleDeleteImage={this.handleDeleteImage}
              handleViewGalleryClick={this.handleViewGalleryClick}
              image={images[0]}
              index={0}
            />
            <ImageComponent
              handleDeleteImage={this.handleDeleteImage}
              handleViewGalleryClick={this.handleViewGalleryClick}
              image={images[1]}
              index={1}
            />
            <Col justify='center' span={8}>
              <Icon
                width='100%'
                height='100%'
                flex={1}
                type='plus'
                theme='outlined'
              />
            </Col>
          </React.Fragment>
        )
      }
      return images.map((image, index) => (
        <ImageComponent
          key={index}
          handleDeleteImage={this.handleDeleteImage}
          handleViewGalleryClick={this.handleViewGalleryClick}
          image={image}
          index={index}
          length={images.length}
        />
      ))
    } else
      return (
        <Col span={8}>
          <Upload
            multiple
            showUploadList={false}
            accept='.jpg, .png, .svg, jpeg'
            action={MediaApi.urlPhotoUploadWithDirectory("station")}
            listType='picture-card'
            onChange={this.handleImageChange}
          >
            <Icon
              size={24}
              type={this.state.uploading ? "uploading" : "plus"}
            />
          </Upload>
        </Col>
      )
  }

  getImages = (images) => {
    return images.map((image) => ({
      _id: uuidV4(),
      component: "gallery.photo",
      original: this.getUrlMedia(image),
      thumbnail: this.getUrlMedia(image),
    }))
  }

  render() {
    const images = this.state.items
    return (
      <Spin spinning={this.state.loading}>
        <React.Fragment>
          <Wrapper type='flex' gutter={24}>
            {this.renderImages()}
            <Gallery
              ref={(ref) => (this.galleryRef = ref)}
              visible={this.state.visible}
              onClose={this.handleCloseGallery}
              items={images}
            />
          </Wrapper>
        </React.Fragment>
      </Spin>
    )
  }
}
