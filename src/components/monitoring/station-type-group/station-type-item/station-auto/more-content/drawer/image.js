import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
// import StationAutoApi from 'api/StationAuto'
import MediaApi from 'api/MediaApi'
// import update from 'immutability-helper'
import { v4 as uuidV4 } from 'uuid'
import { Row, Col, Upload, Icon, Spin, Popconfirm } from 'antd'
import Button from 'components/elements/button'
import styled from 'styled-components'
import swal from 'sweetalert2'
import { translate } from 'hoc/create-lang'
// import debounce from 'lodash/debounce'
import { get as _get } from 'lodash'
import Gallery from 'components/elements/gallery'
import { connect } from 'react-redux'
import { removeAccents } from 'hoc/create-lang'
import axios from 'axios'
import moment from 'moment'
import { PATH_FOLDER } from 'constants/media'
import { deleteImage } from 'api/MediaApi'
// import { getConfigApi } from 'config'

const Wrapper = styled(Row)`
  /* min-height: 500px; */
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
    cursor: pointer;
    margin-bottom: 8px;
    :hover {
      .delete {
        display: flex;
      }
    }
  }
  .ant-upload {
    min-height: 100px;
  }
`

const PhotoItem = styled.div`
  width: 100%;
  background: url('${props => props.image}');
  background-size: cover;
  background-position: center;
  border: 1px solid #ccc;
  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
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

const getDatabaseName = organizationName => organizationName.replace(/_/g, '')

const uploadProps = {
  onStart(file) {
    // console.log('onStart', file, file.name)
  },
  onSuccess(ret, file) {
    // console.log('onSuccess', ret, file.name)
  },
  onError(err) {
    // console.log('onError', err)
    swal({
      title: translate('profileUser.imageUpload.error'),
      type: 'error',
    })
  },
  onProgress({ percent }, file) {
    // console.log('onProgress', `${percent}%`, file.name)
  },
}

@withRouter
@connect(state => ({
  language: _get(state, 'language.locale'),
  userInfo: state.auth.userInfo,
}))
export default class ImageMoreInfo extends React.Component {
  static propTypes = {
    stationID: PropTypes.string,
    language: PropTypes.string,
  }
  static defaultProps = {}

  state = {
    visible: false,
    station: {},
    loading: false,
    uploading: false,
    newImages: [],
    newItems: [],
  }

  componentDidMount() {
    this.fetchData()
  }

  getNewImages = images => {
    return images.map(image => ({
      name: image.name,
      _id: uuidV4(),
      component: 'gallery.photo',
      original: image.preview,
      thumbnail: image.preview,
    }))
  }

  fetchData = () => {
    const { userInfo, stationKey } = this.props
    const databaseName = getDatabaseName(
      userInfo.organization.databaseInfo.name
    )

    this.setState({ loading: true }, async () => {
      const data = await MediaApi.getImages(databaseName, stationKey)

      const dataSorted = data
        .filter(
          item =>
            item.type === 'FILE' &&
            (item.extension.toLowerCase() === 'heic' ||
              item.extension.toLowerCase() === 'jpg' ||
              item.extension.toLowerCase() === 'png')
        )
        .sort((a, b) => moment(b.lastModified) - moment(a.lastModified))

      this.setState({
        newImages: data,
        newItems: this.getNewImages(dataSorted),
        loading: false,
      })
    })
  }

  getUrlImage(imageName) {
    const { userInfo, stationKey } = this.props
    const databaseName = userInfo.organization.databaseInfo.name.replace(
      /_/g,
      ''
    )
    return `${MediaApi.getUrlImage()}/${databaseName}/${stationKey}/${imageName}`
  }

  handleViewGalleryClick = index => () => {
    this.setState({ visible: true })
    this.galleryRef.slideToIndex(index)
  }

  handleCloseGallery = () => {
    this.setState({ visible: false })
  }

  handleDeleteImage = name => async () => {
    const { userInfo, stationKey } = this.props

    const databaseName = getDatabaseName(
      userInfo.organization.databaseInfo.name
    )
    await deleteImage(databaseName, stationKey, name)
    this.fetchData()
  }

  customRequest = ({
    action,
    data,
    file,
    filename,
    headers,
    onError,
    onProgress,
    onSuccess,
    withCredentials,
  }) => {
    // console.log('DEBUG filename', file.name)
    // console.log('DEBUG file type', file.type)

    const databaseName = getDatabaseName(
      this.props.userInfo.organization.databaseInfo.name
    )

    const generatePutUrl = MediaApi.generatePutUrl(databaseName)

    const options = {
      params: {
        prefix: `${this.props.stationKey}/${PATH_FOLDER}/${file.name}`,
        ContentType: file.type,
      },
      headers: {
        'Content-Type': file.type,
      },
    }

    axios.get(generatePutUrl, options).then(res => {
      const { data: putURL } = res
      axios
        .put(putURL, file, {
          headers: {
            'Content-Type': file.type,
          },
        })
        .then(res => {
          onSuccess(res, file)
          this.fetchData()
        })
        .catch(err => {
          onError()
          console.log('err', err)
        })
    })
  }

  renderHeader = () => (
    <HeadingWrapper>
      <Title>
        {translate('stationAutoManager.image.label', {
          name:
            removeAccents(this.props.language, this.state.station.name) || '',
        })}
      </Title>
      <Upload
        multiple
        showUploadList={false}
        accept=".jpg, .png, .svg, jpeg"
        {...uploadProps}
        customRequest={this.customRequest}
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
    const images = this.state.newItems
    return (
      <React.Fragment>
        {this.renderHeader()}
        <Wrapper type="flex" gutter={24}>
          {!this.state.loading && images.length ? (
            images.map((image, index) => (
              <Col className="image-item" key={index} span={6}>
                <Popconfirm
                  title={translate('addon.popConfirm.image.title')}
                  onConfirm={this.handleDeleteImage(image.name)}
                  okText={translate('addon.yes')}
                  cancelText={translate('addon.no')}
                  className="delete"
                >
                  <i className="fa fa-trash" />
                </Popconfirm>
                <PhotoItem
                  onClick={this.handleViewGalleryClick(index)}
                  key={image._id}
                  image={image.thumbnail}
                />
              </Col>
            ))
          ) : (
            <Upload
              {...uploadProps}
              multiple
              showUploadList={false}
              accept=".jpg, .png, .svg, jpeg"
              listType="picture-card"
              customRequest={this.customRequest}
            >
              {this.state.uploading ? <Spin /> : <Icon size={24} type="plus" />}
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
    )
  }
}
