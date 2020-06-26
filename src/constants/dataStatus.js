import { COLOR } from 'themes/color'

export const dataStatusOptions = [
  {
    value: 'COLLECTING',
    label: 'warningLevels.collecting',
    color: COLOR.COLLECTING,
  },
  {
    value: 'LOST_CONNECTION',
    label: 'warningLevels.lostConnection',
    color: COLOR.LOST_CONNECTION,
  },
  {
    value: 'OVERLOAD',
    label: 'warningLevels.overload',
    color: COLOR.OVERLOAD,
  },
  {
    value: 'ABOUT_TO_OVERLOAD',
    label: 'warningLevels.aboutToOverload',
    color: COLOR.ABOUT_TO_OVERLOAD,
  },
]
