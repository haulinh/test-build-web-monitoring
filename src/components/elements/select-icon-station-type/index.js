import React, { PureComponent } from 'react'
import { Avatar, Popover, Upload, message } from 'antd'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import MediaApi from 'api/MediaApi'
import styled from 'styled-components'
import { SketchPicker } from 'react-color'
import createLanguageHoc from 'hoc/create-lang'
import * as _ from 'lodash'

const AvatarWrapper = styled.div`
  padding: 4px;
  width: 50px;
  height: 50px;
  cursor: pointer;
  .ant-upload {
    width: 100%;
    height: 100%;
  }
  .ant-upload-list-item {
    display: none !important;
  }
  .ant-avatar-square {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px;
    > img {
      padding: 4px;
      width: 100%;
      height: auto !important;
    }
  }
`

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 250px;
`

const SketchPickerWrapper = styled.div`
  margin-top: 16px;
  flex: 1;
  display: flex;
  justify-content: center;
`
@createLanguageHoc
@autobind
export default class SelectImage extends PureComponent {
  static propTypes = {
    onChangeValue: PropTypes.func,
  }

  state = {
    urlIcon: '',
    visiblePop: false,
    color: '',
    urlIconList: [
      'http://media.ilotusland.vn/icon-station-type/air.png',
      'http://media.ilotusland.vn/icon-station-type/noise.png',
      'http://media.ilotusland.vn/icon-station-type/stack.png',
      'http://media.ilotusland.vn/icon-station-type/surface.png',
      'http://media.ilotusland.vn/icon-station-type/underground.png',
      'http://media.ilotusland.vn/icon-station-type/waste.png',
    ],
  }
  setIcon(urlIcon) {
    console.log(urlIcon)
    this.setState(
      {
        urlIcon,
      },
      () => {
        console.log(this.state)
        if (this.props.onChangeValue) this.props.onChangeValue(this.state)
      }
    )
  }

  handelPop() {
    this.setState({
      visiblePop: !this.state.visiblePop,
    })
  }

  handelColor(color) {
    this.setState({ color: color.hex }, () => {
      if (this.props.onChangeValue) this.props.onChangeValue(this.state)
    })
  }

  async componentWillMount() {
    if (this.props.initialValues) {
      let updateState = {}
      if (
        this.props.initialValues.urlIcon &&
        this.props.initialValues.urlIcon !== ''
      ) {
        updateState.urlIcon = this.props.initialValues.urlIcon
        updateState.urlIconList = _.union(this.state.urlIconList || [], [
          this.props.initialValues.urlIcon,
        ])
      }
      if (this.props.initialValues.color)
        updateState.color = this.props.initialValues.color

      this.setState(updateState)
    }
  }

  render() {
    const { t } = this.props.lang
    const urlPhotoUpload = MediaApi.urlPhotoUploadWithDirectory(
      'icon-station-type'
    )
    const me = this
    const props = {
      name: 'file',
      action: urlPhotoUpload,
      listType: 'picture',
      headers: {
        authorization: 'authorization-text',
      },
      onSuccess({ url }, file) {
        message.success(
          `${file.name} ${t('stationAutoManager.uploadFile.success')}`
        )
        me.setState({
          urlIconList: _.union(me.state.urlIconList, [url]),
        })
      },
      onError(error, response, file) {
        message.error(
          `${file.name} ${t('stationAutoManager.uploadFile.error')}`
        )
      },
    }

    const content = (
      <HeaderWrapper>
        <AvatarWrapper>
          <Upload {...props}>
            <Avatar
              style={{ backgroundColor: '#87d068' }}
              shape="square"
              icon="plus"
            />
          </Upload>
        </AvatarWrapper>

        {this.state.urlIconList.map((item, index) => {
          return (
            <AvatarWrapper key={index} onClick={() => this.setIcon(item)}>
              <img
                alt="icon-station"
                src={item}
                style={{
                  backgroundColor: '#000',
                  objectFit: 'contain',
                  width: '42px',
                  height: '42px',
                }}
              />
              {/* <Avatar
                shape="square"
                src={item}
                style={{ backgroundColor: '#000' }}
              /> */}
            </AvatarWrapper>
          )
        })}
        <SketchPickerWrapper>
          <SketchPicker color={this.state.color} onChange={this.handelColor} />
        </SketchPickerWrapper>
      </HeaderWrapper>
    )
    // const contentPicker = (
    //   <SketchPicker color={this.state.color} onChange={this.handelColor} />
    // )
    return (
      <Popover
        style={{ backgroundColor: 'yellows' }}
        // visible={this.state.visiblePop}
        content={content}
        title={t('stationTypeManager.form.icon.placeholder')}
        // onClick={this.handelPop}
        trigger="click"
      >
        <AvatarWrapper>
          <Avatar
            shape="square"
            size="large"
            style={{
              cursor: 'pointer',
              backgroundColor: this.state.color,
              display: 'flex',
            }}
            src={this.state.urlIcon}
          >
            {t('stationTypeManager.form.icon.label')}
          </Avatar>
        </AvatarWrapper>
        {/* <Popover
          // visible={this.state.visiblePop}
          placement="bottom"
          content={contentPicker}
          title={t('stationTypeManager.form.color.placeholder')}
          trigger="click"
        >
          <AvatarWrapper>
            <Avatar
              shape="square"
              size="large"
              style={{
                cursor: 'pointer',
                backgroundColor: this.state.color,
                display: 'flex',
              }}
              src={this.state.urlIcon}
            >
              {t('stationTypeManager.form.icon.label')}
            </Avatar>
          </AvatarWrapper>
        </Popover> */}
      </Popover>
    )
  }
}
