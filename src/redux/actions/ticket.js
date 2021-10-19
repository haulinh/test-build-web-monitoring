export const SET_TYPE = 'SET_TYPE'

export const setType = type => {
  return {
    type: SET_TYPE,
    payload: type,
  }
}
