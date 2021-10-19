import { SET_TYPE } from '../actions/ticket'
const initialState = {
  type: '',
}

const ticket = (state = initialState, action) => {
  switch (action.type) {
    case SET_TYPE:
      return { ...state, type: action.payload }

    default:
      return state
  }
}

export default ticket
