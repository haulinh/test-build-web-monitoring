export const PRIMARY = '#2BA6E3'

export const SHAPE = {
  RED: '#EB5C55',
  ORANGE: '#F6A623',
  PURPLE: '#A076C5',
  BLACK: '#3B3B3B',
  GREEN: '#2ECC71',
  PRIMARY: '#389BFF',
  PRIMARYBOLD: '#007EE5',
  PINK: '#FE6C88',
  GRAYLIGHT: '#fafbfb',
  GRAYMORELIGHT: '#f5f5f5',
  GRAYLIGHTMEDIUM: '#d5d5d5',
  GRAYMEDIUM: '#eee',
  GRAYBOLD: '#D4D4D4',
  GRAYTEXT: '#999999',
  YELLOW: '#f1c40f'
}

export const TEXT = {
  NORMAL: '#3B3B3B',
  PRIMARY: '#389BFF',
  PRIMARYBOLD: '#007EE5',
  GRAY: '#999999'
}

export const COLOR = {
  EXCEEDED: '#CC0000',            // @ dedicated
  EXCEEDED_PREPARING: '#E69138',  // @ dedicated
  GOOD: '#6AA84F',                // @ dedicated

  DATA_LOSS: '#666666',
  DATA_EXCEEDED: '#CC0000',
  DATA_EXCEEDED_PREPARED: '#E69138',
  DATA_CONNECTED: '#6AA84F',
  SENSOR_GOOD: '#6AA84F',
  SENSOR_ERROR: '#CC0000',
}

/* eslint-disable */
// do logic code cũ gía trị đang là 0, 1, 2

export const COLOR_DEVICE_STATUS = {
  DATA_LOSS: '#666666',         // @ dedicated
  ERROR: '#CC0000',             // @ dedicated
  MAINTENACE:'#E69138',         // @ dedicated
  NORMAL: '#6AA84F',            // @ dedicated

  SENSOR_GOOD: '#6AA84F',
  SENSOR_ERROR: '#CC0000',

  [0]: '#6AA84F', 
  [1]: '#E69138',
  [2]: '#CC0000'
}
/* eslint-enable */

export default { PRIMARY, COLOR, COLOR_DEVICE_STATUS }
