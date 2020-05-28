import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import StationAutoApi from 'api/StationAuto'
import MediaApi from 'api/MediaApi'
import { Row, Col, Skeleton, Upload, Icon, message } from 'antd'
import styled from 'styled-components'
import { getConfigApi } from 'config'
import { Img } from 'react-image'
import swal from 'sweetalert2'
import $ from 'jquery'
import { translate } from 'hoc/create-lang'
import debounce from 'lodash/debounce'

const Wrapper = styled(Row)`
  padding: 16px 24px;
  transition: transform 0.25s ease;
  .image-item {
    min-height: 100px;
    max-height: 200px;
  }
  .ant-upload {
    min-height: 100px;
  }
  .ant-upload-picture-card-wrapper,
  .ant-upload {
    width: 100%;
    height: 100%;
  }
`

@withRouter
export default class ImageMoreInfo extends React.Component {
  static propTypes = {
    stationID: PropTypes.string
  }
  static defaultProps = {}

  state = {
    loading: false,
    images: [],
    fileList: []
  }

  async componentDidMount() {
    const { data: station } = await StationAutoApi.getStationAuto(
      this.props.stationID
    )
    this.setState({ images: station.images })
  }

  getUrlMedia(url) {
    return getConfigApi().media + url.replace('public', '')
  }

  // handleZoomImage = () => {
  //   console.log(this);
  //   var previous = 0;
  //   $(".img").click(function() {
  //     var s = $(this).attr("id");
  //     $("#" + s).animate({ width: "200px" });
  //     if (previous !== 0) {
  //       $("#" + previous).animate({ width: "100px" });
  //     }
  //     previous = s;
  //   });
  // };

  handleImageChange = ({ fileList, file, event }) => {
    let newFileList = fileList
    if (file.status === 'uploading') {
      this.setState({ loading: true })
    }
    if (file.status === 'error') {
      this.setState({ loading: false })
      swal({
        title: translate('profileUser.imageUpload.error'),
        type: 'error'
      })
      newFileList = []
    }
    this.setState({
      fileList: newFileList
    })
    if (file.status === 'done') {
      this.setState(
        prevState => ({
          images: [...prevState.images, file.response.file.path],
          loading: false
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
      images: this.state.images
    })
    message.success(translate('profileUser.imageUpload.success'))
  }, 1200)

  renderContainerImage = children => {
    return (
      <Col
        // onClick={this.handleZoomImage}
        className="image-item"
        span={8}
        md={3}
      >
        {children}
      </Col>
    )
  }

  render() {
    return (
      <Wrapper type="flex" gutter={16}>
        {this.state.images.map((image, index) => (
          <Img
            key={index}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            src={this.getUrlMedia(image)}
            loader={<Skeleton />}
            unloader={null}
            container={this.renderContainerImage}
          />
        ))}
        <Col span={8} md={3} className="image-item">
          <Upload
            multiple
            showUploadList={false}
            accept=".jpg, .png, .svg, jpeg"
            action={MediaApi.urlPhotoUploadWithDirectory('station')}
            listType="picture-card"
            onChange={this.handleImageChange}
          >
            <Icon size={24} type={this.state.loading ? 'loading' : 'plus'} />
          </Upload>
        </Col>
      </Wrapper>
    )
  }
}
