import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import StationAutoApi from 'api/StationAuto'
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

const Wrapper = styled(Row)`
  min-height: 500px;
  padding: 16px 24px;
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
    justify-content: center;
    z-index: 2;
  }
  .image-item {
    position: relative;
    min-height: 100px;
    max-height: 200px;
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

const Title = styled.h3``

@withRouter
export default class ImageMoreInfo extends React.Component {
  static propTypes = {
    stationID: PropTypes.string,
  }
  static defaultProps = {}

  state = {
    visible: false,
    station: {},
    loading: false,
    uploading: false,
    images: [],
    items: [],
    fileList: [],
  }

  componentDidMount() {
    this.setState({ loading: true }, async () => {
      const { data: station } = await StationAutoApi.getStationAuto(
        this.props.stationID
      )
      this.setState({
        images: station.images,
        items: this.getImages(station.images),
        station,
        loading: false,
      })
    })
  }

  getUrlMedia(url) {
    return getConfigApi().media + url.replace('public', '')
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
    await StationAutoApi.updateStationAuto(`images/${this.props.stationID}`, {
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
      <Title>
        {translate('stationAutoManager.image.label', {
          name: this.state.station.name || '',
        })}
      </Title>
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
      <Spin spinning={this.state.loading}>
        <React.Fragment>
          {this.renderHeader()}
          <Wrapper type="flex" gutter={24}>
            {!this.state.loading && images.length ? (
              images.map((image, index) => (
                <Col className="image-item" span={6}>
                  <Popconfirm
                    title="Are you sure delete this task?"
                    onConfirm={this.handleDeleteImage(index)}
                    okText="Yes"
                    cancelText="No"
                    className="delete"
                  >
                    <i className="fa fa-trash" />
                  </Popconfirm>
                  <img
                    onClick={this.handleViewGalleryClick(index)}
                    key={image._id}
                    style={{ objectFit: 'cover' }}
                    width="100%"
                    height="100%"
                    src={image.thumbnail}
                    alt={image._id}
                  />
                </Col>
              ))
            ) : (
              <Upload
                multiple
                showUploadList={false}
                accept=".jpg, .png, .svg, jpeg"
                action={MediaApi.urlPhotoUploadWithDirectory('station')}
                listType="picture-card"
                onChange={this.handleImageChange}
              >
                <Icon
                  size={24}
                  type={this.state.uploading ? 'uploading' : 'plus'}
                />
              </Upload>
            )}
            <Gallery
              ref={ref => (this.galleryRef = ref)}
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
