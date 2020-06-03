import React from 'react'
import {
  CloseButton,
  FullScreenButton,
  GalleryContainer,
  Icon as IconWrapper,
  LeftNav,
  RightNav,
  ThumbInner,
  ToolBar,
} from './style'
import { createPortal, findDOMNode } from 'react-dom'
import ReactGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'
import $ from 'jquery'

const renderLeftNav = (onClick, disabled) => (
  <LeftNav>
    <IconWrapper onClick={onClick} className="nav-icon">
      <i className="fa fa-chevron-left" />
    </IconWrapper>
  </LeftNav>
)

const renderRightNav = (onClick, disabled) => (
  <RightNav>
    <IconWrapper onClick={onClick} className="nav-icon">
      <i className="fa fa-chevron-right" />
    </IconWrapper>
  </RightNav>
)

const renderThumbInner = item => {
  return <ThumbInner thumbnail={item.thumbnail} />
}

export default class Gallery extends React.PureComponent {
  state = {
    rendered: false,
    isFullScreen: false,
  }

  componentDidMount() {
    this.setState({ rendered: true })
    document.addEventListener('keydown', this.handleESCPress)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleESCPress)
  }

  componentDidUpdate(prevProps) {
    // if (!this.state.rendered) return;
    if (prevProps.visible !== this.props.visible) {
      if (this.containerRef) {
        const element = findDOMNode(this.containerRef)

        if (this.props.visible) {
          $(element).fadeIn()
          // Disable page scroll
          document.body.style.overflow = 'hidden'
        } else {
          $(element).fadeOut()
          // Enable page scroll
          document.body.style.overflow = 'visible'
        }
      }
    }
  }

  handleESCPress = event => {
    if (event.keyCode === 27) {
      // ESC Press
      this.props.onClose && this.props.onClose()
    }
  }

  handleFullScreenClick = () => {
    if (this.state.isFullScreen) {
      this.galleryRef.exitFullScreen()
    } else {
      this.galleryRef.fullScreen()
    }
  }

  handleCloseClick = () => {
    this.props.onClose && this.props.onClose()
    if (this.state.isFullScreen) {
      this.galleryRef.exitFullScreen()
    }
  }

  renderCustomControls = () => (
    <ToolBar>
      <FullScreenButton onClick={this.handleFullScreenClick}>
        {this.state.isFullScreen ? (
          <i className="fa fa-compress" />
        ) : (
          <i className="fa fa-expand" />
        )}
      </FullScreenButton>
      <CloseButton onClick={this.handleCloseClick}>
        <i className="fa fa-times" />
      </CloseButton>
    </ToolBar>
  )

  handleScreenChange = isFullScreen => {
    if (isFullScreen) {
      this.setState({ isFullScreen: true })
    } else {
      this.setState({ isFullScreen: false })
    }
  }

  slideToIndex = index => {
    this.galleryRef.slideToIndex(index)
    return index
  }

  render() {
    if (!this.state.rendered) return null
    return createPortal(
      <GalleryContainer ref={ref => (this.containerRef = ref)}>
        <ReactGallery
          items={this.props.items}
          ref={ref => (this.galleryRef = ref)}
          showPlayButton={false}
          showFullscreenButton={false}
          slideDuration={0}
          renderCustomControls={this.renderCustomControls}
          renderLeftNav={renderLeftNav}
          renderRightNav={renderRightNav}
          renderThumbInner={renderThumbInner}
          onScreenChange={this.handleScreenChange}
        />
      </GalleryContainer>,
      document.body
    )
  }
}
