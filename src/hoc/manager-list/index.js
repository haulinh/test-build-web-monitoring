import React from 'react'
import { autobind } from 'core-decorators'
import _, { get } from 'lodash'
import swal from 'sweetalert2'

import { updateStationAutoOptions } from 'api/StationAuto'
import { STATION_AUTO_OPTIONS } from 'constants/labels'

const i18n = {
  success: 'Lưu thành công',  /* MARK  @translate */
  error: 'Lỗi'                /* MARK  @translate */
}

/**
 * Manager list data
 * @param apiList
 * @param apiDelete
 */
const createManagerList = ({ apiList, itemPerPage = 1000 }) => Component => {
  @autobind
  class ManagerListHoc extends React.Component {
    state = {
      /* giông cách hoạt động của git */  
      cachedData: {},             /* commit */
      dataSource: [],             /* working dir */
      dataSourceOriginal: [],     /* index */

      isLoading: false,
      isSave: false,

      isWarningIndeterminate: true,
      isSmsIndeterminate: true,
      isEmailIndeterminate: true,
      isWarningCheckAll: false,
      isSmsCheckAll: false,
      isEmailCheckAll: false,

      pagination: {
        itemPerPage: itemPerPage,
        page: 1,
        current: 1,
        total: 0
      },
      pathImg: '',
      data: {}
    }

    /**
     * Cập nhật dữ liệu dựa trên tham số dataSource
     * @returns {Promise.<void>}
     */
    async fetchData() {
      this.setState({
        isLoading: true
      })
      const res = await apiList(this.state.pagination, this.state.data)

      this.setState({
        dataSource: _.cloneDeep(res.data),
        dataSourceOriginal: _.cloneDeep(res.data),
        cachedData: {},
        pagination: {
          ...res.pagination,
          total: get(res, 'pagination.totalItem', 0)
        },
        isLoading: false,
        pathImg: res.path
      })

      _.forEach(_.values(STATION_AUTO_OPTIONS), column => {
        this.checkIndeterminate(column, _.cloneDeep(res.data))
      })
    }

    // Su kien truoc khi component duoc tao ra
    async componentWillMount() {
      this.fetchData()
    }

    /**
     * Thay đổi trang nội dung
     * @param page
     * @param pageSize
     */
    onChangePage(page, pageSize) {
      this.setState(
        {
          isLoading: true,
          pagination: {
            ...this.state.pagination,
            page: page,
            current: page,
            itemPerPage: pageSize ? pageSize : itemPerPage
          }
        },
        () => {
          this.fetchData()
        }
      )
    }

    onChangeSearch(dataSearch) {
      this.setState(
        {
          isLoading: true,
          pagination: {
            ...this.state.pagination,
            current: 1,
            page: 1
          },
          data: { ...dataSearch }
        },
        () => {
          this.fetchData()
        }
      )
    }

    /**
     * Thay đổi page size
     * @param currentPage
     * @param pageSize
     */
    onChangePageSize(currentPage, pageSize) {
      this.setState(
        {
          pagination: {
            page: 1,
            current: 1,
            itemPerPage: pageSize ? pageSize : itemPerPage
          }
        },
        () => {
          this.fetchData()
        }
      )
    }

    onChangeStationConfig({row, key, value}) {
      this.updateDataSource(row, key, value)
      this.updateCache(row, key, value)
      this.checkIndeterminate(key, this.state.dataSource)
    }

    updateDataSource(row, key, value) {
      let _dataSource = _.clone(this.state.dataSource)
      let indexOfRow = _.findIndex(this.state.dataSource, stationAuto => stationAuto._id === row._id)
      _.set(_dataSource, `[${indexOfRow}].options[${key}].allowed`, value)
  
      this.setState({ dataSource: _dataSource })
    }

    updateCache(row, key, value) {
      console.log(row, key, value)
      let _cachedData = _.clone(this.state.cachedData)
      if (_.get(_cachedData, `[${row._id}][${key}]`)){
        delete _cachedData[row._id][key]
        if (_.keys(_cachedData[row._id]).length === 0) {
          delete _cachedData[row._id]
        }
      }
      else {
        _.set(_cachedData, `[${row._id}][${key}].allowed`, value)
      }
      this.setState({cachedData: _cachedData})
    }

    onClearCache() {
      let originalData = _.cloneDeep(this.state.dataSourceOriginal)
      this.setState({
        dataSource: [...originalData],
        cachedData: {}
      })
    }

    async onSubmitCache() {
      this.setState({isSave: true})
      console.log('--- will commit: ', this.state.cachedData)
      const res = await updateStationAutoOptions(this.state.cachedData)
      if (res.success) {
        this.setState({
          dataSourceOriginal: _.cloneDeep(this.state.dataSource),
          cachedData: {}
        })
        swal({
          title: i18n.success,
          type: 'success'
        })
      }
      else if (res.error) {
        console.log(res.message)
        swal({
          title: i18n.error,
          type: 'error'
        })
      }
    
      this.setState({isSave: false})
    }

    /* TODO C HANDLE SAVE CACHE */
    onCheckAllTableHeader(column, checked) {
      let _dataSource = _.cloneDeep(this.state.dataSource)
      _.forEach(_dataSource, (station, index) => {
        if (_.get(station, ['options', column, 'allowed']) !== checked) {
          _.set(_dataSource[index], ['options', column, 'allowed'], checked)
          // this.updateCache(station, column, checked)
        }
      })

      switch(column) {
        case STATION_AUTO_OPTIONS.warning: {
          this.setState({
            isWarningCheckAll: checked, 
            isWarningIndeterminate: false
          })
          break;
        }
        case STATION_AUTO_OPTIONS.sms: {
          this.setState({
            isSmsCheckAll: checked, 
            isSmsIndeterminate: false
          })
          break;
        }
        case STATION_AUTO_OPTIONS.email: {
          this.setState({
            isEmailCheckAll: checked, 
            isEmailIndeterminate: false
          })
          break;
        }
      }

      this.setState({
        dataSource: _.cloneDeep(_dataSource),
      })
    }

    checkIndeterminate(column, data) {
      let _dataSource = _.cloneDeep(this.state.dataSource)
      let result = _.map(_dataSource, station => {
        return _.get(station, ['options', column, 'allowed'])
      })
      
      let countBy = _.countBy(result, Boolean)
      let isSame = countBy.false === undefined || countBy.true === undefined
      let isCheckAll = _.every(result)
      
      switch(column) {
        case STATION_AUTO_OPTIONS.warning : this.setState({isWarningIndeterminate : !isSame, isWarningCheckAll : isCheckAll }); break;
        case STATION_AUTO_OPTIONS.sms     : this.setState({isSmsIndeterminate     : !isSame, isSmsCheckAll     : isCheckAll }); break;
        case STATION_AUTO_OPTIONS.email   : this.setState({isEmailIndeterminate   : !isSame, isEmailCheckAll   : isCheckAll }); break;
      }
    }

    showTotal = (total, range) => `${range[1]}/${total}`

    render() {
      // Truyền các tham số cho Component con (props)
      const props = {
        dataSource: this.state.dataSource,
        pagination: { ...this.state.pagination, showTotal: this.showTotal },
        isLoading: this.state.isLoading,
        onChangePage: this.onChangePage,
        onChangePageSize: this.onChangePageSize,
        fetchData: this.fetchData,
        pathImg: this.state.pathImg,
        onChangeSearch: this.onChangeSearch,
        data: this.state.data,
        updateStationConfig: this.onChangeStationConfig,
        isSave: this.state.isSave,
        clearCache: this.onClearCache,
        submitCache: this.onSubmitCache,
        cachedData: this.state.cachedData,
        handleCheckAll: this.onCheckAllTableHeader,
        isWarningIndeterminate: this.state.isWarningIndeterminate,
        isSmsIndeterminate: this.state.isSmsIndeterminate,
        isEmailIndeterminate: this.state.isEmailIndeterminate,
        isWarningCheckAll: this.state.isWarningCheckAll,
        isSmsCheckAll: this.state.isSmsCheckAll,
        isEmailCheckAll: this.state.isEmailCheckAll,
      }
      return <Component {...this.props} {...props} />
    }
  }

  return ManagerListHoc
}

export default createManagerList
