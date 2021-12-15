import { DATA_COLOR } from 'themes/color'

export const dataStatusOptions = [
  {
    value: 'GOOD',
    label: 'warningLevels.collecting',
    color: DATA_COLOR.GOOD,
  },
  // {
  //   value: 'LOST_CONNECTION',
  //   label: 'warningLevels.lostConnection',
  //   color: DATA_COLOR.LOST_CONNECTION,
  // },
  {
    value: 'EXCEEDED',
    label: 'warningLevels.overload',
    color: DATA_COLOR.EXCEEDED
  },
  {
    value: 'EXCEEDED_PREPARING',
    label: 'warningLevels.aboutToOverload',
    color: DATA_COLOR.EXCEEDED_PREPARING,
  },
]
