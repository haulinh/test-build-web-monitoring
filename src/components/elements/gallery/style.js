import styled from 'styled-components'

export const GalleryContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;

  display: none;
  width: 100%;
  height: 100%;

  background: #fff;

  .image-gallery-thumbnails {
    padding: 16px 0;
  }

  .image-gallery-thumbnail {
    width: auto;
    height: auto;
    border-radius: 8px;
    overflow: hidden;

    &.active {
      border: 4px solid #000;
    }
  }

  .fullscreen {
    .image-gallery-thumbnail {
      &.active {
        border-color: #fff;
      }
    }
  }
`

export const ToolBar = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 9999;

  display: flex;
  align-items: center;
`

export const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 40px;
  height: 40px;
  border-radius: 20px;

  color: #fff;
  background: #000;

  font-size: 18px;

  cursor: pointer;
`

export const CloseButton = styled(Icon)`
  margin-left: 8px;
`

export const FullScreenButton = styled(Icon)``

export const Nav = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;

  .nav-icon {
    background: rgba(0, 0, 0, 0.5);
  }
`

export const LeftNav = styled(Nav)`
  left: 16px;
`

export const RightNav = styled(Nav)`
  right: 16px;
`

export const Viewer = styled.div`
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;

    width: 100%;
    height: 100%;

    background: url(${props => props.placeholder}) center;
    background-size: cover;

    filter: blur(${props => (props.blur || 0) + 'px'});
  }

  img,
  .youtube-player {
    position: relative;
    z-index: 1;

    display: block;
    margin: 0 auto;
    width: auto;
    height: calc(100vh - 88px - 32px);
  }
`

export const ThumbInner = styled.div`
  width: 80px;
  height: 80px;
  overflow: hidden;

  background: url(${props => props.thumbnail});
  background-size: cover;
`
