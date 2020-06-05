import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import MediaApi from 'api/MediaApi'
import update from 'immutability-helper'
import { v4 as uuidV4 } from 'uuid'
import { Row, Col, Upload, Icon, message, Spin, Popconfirm } from 'antd'
import Button from 'components/elements/button'
import styled from 'styled-components'
import { getConfigApi } from 'config'
import swal from 'sweetalert2'
import { translate } from 'hoc/create-lang'
import debounce from 'lodash/debounce'
import Gallery from 'components/elements/gallery'
import { editEvaluateStation } from 'api/StationAuto'

const Wrapper = styled(Row)`
  .ant-upload {
    height: 120px;
  }
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

const HeadingWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
  justify-content: space-between;
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
  handleViewGalleryClick,
  length,
  isEdit,
  isHide,
  imageLength,
  itemInline,
}) => {
  if (isHide) return null
  return (
    <ImageWrapper>
      {isEdit && (
        <Popconfirm
          title="Are you sure delete this image?"
          onConfirm={handleDeleteImage(index)}
          okText="Yes"
          cancelText="No"
          className="delete"
        >
          <i className="fa fa-trash" />
        </Popconfirm>
      )}
      <Image
        onClick={handleViewGalleryClick(index)}
        bgUrl={image.thumbnail}
        key={image._id}
        content={index === itemInline - 1 ? imageLength - itemInline : null}
      />
    </ImageWrapper>
  )
}

@withRouter
export default class ImageMoreInfo extends React.Component {
  static propTypes = {
    commentId: PropTypes.string,
    isEdit: PropTypes.bool,
    itemInline: PropTypes.number,
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
    return url.replace('public', getConfigApi().media)
  }

  handleViewGalleryClick = index => () => {
    this.setState({ visible: true })
    this.galleryRef.slideToIndex(index)
  }

  handleCloseGallery = () => {
    this.setState({ visible: false })
  }

  handleImageChange = ({ fileList, file, event }) => {
    let newFileList = fileList
    if (file.status === 'uploading') {
      this.setState({ uploading: true })
    }
    if (file.status === 'error') {
      this.setState({ uploading: false })
      swal({
        title: translate('profileUser.imageUpload.error'),
        type: 'error',
      })
      newFileList = []
    }
    this.setState({
      fileList: newFileList,
    })
    if (file.status === 'done') {
      this.setState(
        prevState => ({
          images: [...prevState.images, file.response.file.path],
          items: [
            ...prevState.items,
            {
              _id: uuidV4(),
              component: 'gallery.photo',
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
      if (this.props.onChange) this.props.onChange('')
    }
  }

  handleUpdateStation = debounce(async () => {
    await editEvaluateStation({
      _id: this.props.commentId,
      stationId: this.props.stationId,
      images: this.state.images,
    })
    message.success(translate('stationAutoManager.update.success'))
  }, 1200)

  handleDeleteImage = index => () => {
    this.setState(
      prevState =>
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
        accept=".jpg, .png, .svg, jpeg"
        action={MediaApi.urlPhotoUploadWithDirectory('station')}
        onChange={this.handleImageChange}
      >
        <Button isLoading={this.state.uploading} customColor="primary">
          {translate('stationAutoManager.image.create')}
        </Button>
      </Upload>
    </HeadingWrapper>
  )

  renderImages = () => {
    const images = this.state.items
    const { itemInline, isEdit } = this.props

    return (
      <React.Fragment>
        {images.map((image, index) => (
          <Col className="image-item" span={24 / itemInline}>
            <ImageComponent
              itemInline={itemInline}
              isEdit={isEdit}
              handleDeleteImage={this.handleDeleteImage}
              handleViewGalleryClick={this.handleViewGalleryClick}
              image={image}
              index={index}
              isHide={index > itemInline - 1}
              imageLength={images.length}
            />
          </Col>
        ))}
        {isEdit && (
          <Col className="image-item" span={24 / itemInline}>
            <Upload
              multiple
              showUploadList={false}
              accept=".jpg, .png, .svg, jpeg"
              action={MediaApi.urlPhotoUploadWithDirectory('station')}
              listType="picture-card"
              onChange={this.handleImageChange}
            >
              {this.state.uploading ? <Spin /> : <Icon size={24} type="plus" />}
            </Upload>
          </Col>
        )}
      </React.Fragment>
    )
  }

  getImages = images => {
    return images.map(image => ({
      _id: uuidV4(),
      component: 'gallery.photo',
      original: this.getUrlMedia(image),
      thumbnail: this.getUrlMedia(image),
    }))
  }

  render() {
    const images = this.state.items
    return (
      <React.Fragment>
        <Wrapper type="flex" gutter={[16, 16]}>
          {this.renderImages()}
        </Wrapper>
        <Gallery
          ref={ref => (this.galleryRef = ref)}
          visible={this.state.visible}
          onClose={this.handleCloseGallery}
          items={images}
        />
      </React.Fragment>
    )
  }
}
