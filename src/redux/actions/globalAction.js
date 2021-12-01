import CategoryApi from 'api/CategoryApi'
import _ from 'lodash'

export const GET_MEASURES = 'GET_MEASURES'
export const UPDATE_MEASURE = 'UPDATE_MEASURE'
export const CREATE_MEASURE = 'CREATE_MEASURE'
export const DELETE_MEASURE = 'DELETE_MEASURE'

//#region Measure
export const getMeasuresAsync = () => async dispatch => {
  const measures = await CategoryApi.getMeasurings(
    {
      page: 1,
      itemPerPage: Number.MAX_SAFE_INTEGER,
    },
    {}
  )
  const measuresObj = _.keyBy(measures.data, 'key')
  dispatch({
    type: GET_MEASURES,
    payload: measuresObj,
  })
}

export const updateMeasure = measureUpdate => ({
  type: UPDATE_MEASURE,
  payload: measureUpdate,
})

export const createMeasure = measure => ({
  type: CREATE_MEASURE,
  payload: measure,
})

export const deleteMeasure = measureKey => ({
  type: DELETE_MEASURE,
  payload: measureKey,
})
//#endregion
