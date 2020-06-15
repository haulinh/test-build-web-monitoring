import React from 'react'
import { Icon, Dropdown, Menu } from 'antd'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import pathParse from 'path-parse'
import { getThumbLink, getCameraMPJEGLink } from 'api/CameraApi'
import { message } from 'antd'
import moment from 'moment'

// tham khao o: https://codepen.io/webcrunchblog/pen/WaNYPv?editors=0010
// tham khao o: https://web-crunch.com/lets-build-with-javascript-html5-video-player/
const LINK_Error = '/images/imgError.jpg'
const IconPlay = () => (
  <svg width="16" height="16" viewBox="0 0 16 16">
    <title>pause</title>
    <path d="M2 2h5v12H2zm7 0h5v12H9z" />
  </svg>
)
const IconPause = () => (
  <svg width="16" height="16" viewBox="0 0 16 16">
    <title>play</title>
    <path d="M3 2l10 6-10 6z" />
  </svg>
)
/* #region  styledd */
const WraperPlayer = styled.div`
  .player {
    max-width: 320px;
    max-height: 180px;
    /* border: 6px solid rgba(255, 255, 255, 0.2); */
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;

    &:hover {
      .player-controls {
        transform: translateY(0);
        background: rgba(0, 0, 0, 0.7);
      }
    }
  }

  .player:-webkit-full-screen,
  .player:fullscreen {
    max-width: none;
    width: 100%;
  }

  .play-btn {
    flex: 1;
  }

  .player-video {
    width: 100%;
    display: block;
  }

  .player-btn {
    background: none;
    border: 0;
    color: white;
    text-align: center;
    max-width: 60px;
    padding: 5px 8px;

    svg {
      fill: #ffffff;
    }

    &:hover,
    &:focus {
      border-color: $accent-color;
      background: rgba(255, 255, 255, 0.2);
    }
  }

  .player-controls {
    align-items: center;
    display: flex;
    position: absolute;
    bottom: 0;
    width: 100%;
    transform: translateY(100%) translateY(-5px);
    transition: all 0.3s;
    flex-wrap: wrap;
    background: rgba(0, 0, 0, 0.3);
  }

  .player-controls > * {
    flex: 1;
  }
  .ant-dropdown-menu {
    background: #262421;
    .ant-dropdown-menu-item {
      font-size: 12px;
      line-height: 16px;
      a {
        color: #e4e4e4 !important;
      }
      &-active {
        background: #3b3836;
      }
    }
  }
`

/* #endregion */

export default class Player extends React.Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    auth: PropTypes.string.isRequired,
    countStartCamera: PropTypes.number.isRequired,
    cbPlay: PropTypes.func.isRequired,
    cbStop: PropTypes.func.isRequired,
    width: PropTypes.any,
    height: PropTypes.number,
  }
  static defaultProps = {
    width: '100%',
    height: '100%',
  }
  constructor(props) {
    super(props)
    const pathObj = pathParse(props.src)
    const cameraId = pathObj.name || ''

    this.state = {
      isPlay: false,
      isFullScreen: false,
      cameraId: cameraId,
      thumbLink: getThumbLink(cameraId, props.auth),
      linkSream: getCameraMPJEGLink(cameraId, props.auth, '240p'),
      linkSreamHightQual: getCameraMPJEGLink(cameraId, props.auth, '640p'),
      link480p: getCameraMPJEGLink(cameraId, props.auth, '480p'),
    }
  }

  openWindowStream = link => {
    window.open(
      link,
      moment().unix(),
      `resizable=yes, scrollbars=yes, titlebar=yes, 
      width=${window.outerWidth / 4}, 
      height=${window.outerHeight / 4}, top=10, left=10`
    )
  }

  MenuOpenCam = (
    <Menu>
      <Menu.Item onClick={() => this.openWindowStream(this.state.linkSream)}>
        <a target="_blank">240p</a>
      </Menu.Item>
      <Menu.Item onClick={() => this.openWindowStream(this.state.link480p)}>
        <a target="_blank">480p</a>
      </Menu.Item>
      <Menu.Item
        onClick={() => this.openWindowStream(this.state.linkSreamHightQual)}
      >
        <a target="_blank">640p</a>
      </Menu.Item>
    </Menu>
  )

  handleClickFullScreen = () => {
    if (!this.Player) {
      console.log('this.Player NULLLL')
      return
    }
    let isFullScreen =
      document.fullScreen ||
      document.mozFullScreen ||
      document.webkitIsFullScreen

    if (!isFullScreen) {
      this.setState({ isFullScreen: true })
      if (this.Player.requestFullScreen) {
        this.Player.requestFullScreen()
      } else if (this.Player.webkitRequestFullScreen) {
        this.Player.webkitRequestFullScreen()
      } else if (this.Player.mozRequestFullScreen) {
        this.Player.mozRequestFullScreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen()
      }
    }
  }

  handlePlay = () => {
    if (this.state.isPlay) {
      this.setState({ isPlay: false }, () => {
        this.props.cbStop()
      })
    } else if (this.props.countStartCamera < 2) {
      this.setState({ isPlay: true }, () => {
        this.props.cbPlay()
      })
    } else {
      message.error('Chỉ cho phép live view 2 camera đồng thời')
    }
  }

  render() {
    let source = this.state.thumbLink
    if (this.state.isPlay) {
      if (this.state.isFullScreen) source = this.state.linkSreamHightQual
      else source = this.state.linkSream
    }

    return (
      <WraperPlayer>
        <div
          ref={comp => (this.Player = comp)}
          className="player"
          style={{
            width: 480,
            height: 320,
          }}
        >
          <img
            alt="day la img"
            width="100%"
            height="100%"
            className="player-video"
            src={source}
            onClick={this.handlePlay}
            onError={() => {
              this.setState({
                thumbLink: LINK_Error,
                linkSream: LINK_Error,
                linkSreamHightQual: LINK_Error,
              })
            }}
          />

          <div className="player-controls">
            <div className="ply-btn">
              <button
                onClick={this.handlePlay}
                className="player-btn toggle-play"
                title="Toggle Play"
              >
                {this.state.isPlay ? <IconPlay /> : <IconPause />}
              </button>
            </div>

            <Dropdown
              placement="topCenter"
              getPopupContainer={comp => comp.parentNode}
              overlay={this.MenuOpenCam}
            >
              <button
                onClick={this.handleClickFullScreen}
                data-skip="10"
                className="player-btn"
              >
                <img width={16} height={16} alt="Full Screen" src="/images/open_window.png" />
              </button>
            </Dropdown>
            <button
              onClick={this.handleClickFullScreen}
              data-skip="10"
              className="player-btn"
            >
              <Icon type="fullscreen" />
            </button>
          </div>
        </div>
      </WraperPlayer>
    )
  }
}
