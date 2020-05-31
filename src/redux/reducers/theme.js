import {
  TOGGLE_NAVIGATION,
  SELECT_MENU,
  CHANGE_OPEN_SUBMENU,
} from '../actions/themeAction'
import update from 'react-addons-update'
import { setToggleNavigation, getToggleNavigation } from 'utils/localStorage'

const initialState = {
  navigation: {
    isOpen: getToggleNavigation(),
  },
  menuSelected: '/',
  openSubMenu: ['monitoring'],
}

export default function createReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_NAVIGATION:
      setToggleNavigation(action.isOpen)
      return update(state, {
        navigation: {
          isOpen: {
            $set: action.isOpen,
          },
        },
      })
    case SELECT_MENU:
      return update(state, {
        menuSelected: {
          $set: action.payload,
        },
      })
    case CHANGE_OPEN_SUBMENU:
      return update(state, {
        openSubMenu: {
          $set: action.payload,
        },
      })
    default:
      return state
  }
}
