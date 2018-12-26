import React from 'react'
import {
  Player,
  ControlBar,
  PlayToggle,
  BigPlayButton,
  FullscreenToggle
} from 'video-react'
import HSLSource from './hls-source'

export default props => (
  <Player
    // width={props.width || 250}
    poster={
      props.poster ||
      'https://media.ilotusland.com/uploads/profile/IMG_0003_1529545382013.JPG'
    }
  >
    <HSLSource isVideoChild src={props.src} />
    <BigPlayButton position="center" />
    <ControlBar autoHide={false} disableDefaultControls={true}>
      <PlayToggle />
      <FullscreenToggle />
    </ControlBar>
  </Player>
)
