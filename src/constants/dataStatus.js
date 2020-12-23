import { DATA_COLOR } from 'themes/color'

export const dataStatusOptions = [
  {
    value: 'COLLECTING',
    label: 'warningLevels.collecting',
    color: DATA_COLOR.COLLECTING,
  },
  // {
  //   value: 'LOST_CONNECTION',
  //   label: 'warningLevels.lostConnection',
  //   color: DATA_COLOR.LOST_CONNECTION,
  // },
  {
    value: 'OVERLOAD',
    label: 'warningLevels.overload',
    color: DATA_COLOR.OVERLOAD,
  },
  {
    value: 'ABOUT_TO_OVERLOAD',
    label: 'warningLevels.aboutToOverload',
    color: DATA_COLOR.ABOUT_TO_OVERLOAD,
  },
]
