import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import MediaApi from 'api/MediaApi'
import update from 'immutability-helper'
import { v4 as uuidV4 } from 'uuid'
import { Row, Col, Upload, Icon, Spin, Popconfirm } from 'antd'
import Button from 'components/elements/button'
import styled from 'styled-components'
import { getConfigApi } from 'config'
import swal from 'sweetalert2'
import { translate } from 'hoc/create-lang'
import Gallery from 'components/elements/gallery'

const Wrapper = styled(Row)`
  .ant-upload {
    height: 120px;
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
  width: 100%;
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

const PhotoItem = styled.div`
  width: 100%;
  background: url('${props => props.image}');
  background-size: cover;
  background-position: center;
  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
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
    <ImageWrapper key={image._id}>
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
      <PhotoItem
        onClick={handleViewGalleryClick(index)}
        image={image.thumbnail}
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

    onChange: PropTypes.func,
  }
  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      loading: false,
      uploading: false,
      images: props.images,
      value: props.content,
      items: this.getImages(props.images),
      fileList: [],
    }
  }

  componentDidMount() {
    this.setState({
      images: this.props.images,
      items: this.getImages(this.state.images),
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isCancel !== this.props.isCancel) {
      this.setState({
        value: nextProps.value,
        images: nextProps.images,
        items: this.getImages(nextProps.images),
      })
    }
  }

  handleOnChange = () => {
    if (this.props.onChange) {
      this.props.onChange(this.state)
    }
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
        () => {
          // await this.handleUpdateStation()
          this.handleOnChange()
        }
      )
      // if (this.props.onChange) {
      //   this.props.onChange(file.response.url)
      // }
    }
    // if (fileList.length === 0) {
    //   if (this.props.onChange) this.props.onChange('')
    // }
  }

  // handleUpdateStation = debounce(async () => {
  //   await editEvaluateStation({
  //     _id: this.props.commentId,
  //     stationId: this.props.stationId,
  //     images: this.state.images,
  //   })
  // }, 1200)

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
        this.handleOnChange()
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
    const { itemInline, isEdit } = this.props
    const images = this.state.items

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
    const images = this.getImages(this.state.images)
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
