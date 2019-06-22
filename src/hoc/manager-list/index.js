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
        this.checkIndeterminate(column, res.data)
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

    onChagedOptionOfHeader(column, checked) {
      let _dataSource = this.state.dataSource

      if (column === STATION_AUTO_OPTIONS.warning) {
        /*  TODO  @phat: this.clearAllCheckbox() */
        /* clear checkboxs trên table header */
        this.setState({
          isWarningIndeterminate: false,
          isSmsIndeterminate: false,
          isEmailIndeterminate: false,
          isWarningCheckAll: false,
          isSmsCheckAll: false,
          isEmailCheckAll: false,
        })

        _.forEach(_dataSource, (station) => {
          this.onChagedOptionOfRow({row: station, key: STATION_AUTO_OPTIONS.warning, value: checked})
        })
      }
      else {
        /* 
        - tìm và thay đổi giá trị không giống với với checkbox select all và warning == enabled
        - update cached
        */
        _.forEach(_dataSource, (station) => {
          let isDiffValue = _.get(station, ['options', column, 'allowed']) !== checked
          let isWarningCheckBoxEnabled = _.get(station, ['options', 'warning', 'allowed']) === true
          if (isDiffValue && isWarningCheckBoxEnabled) {
            this.onChagedOptionOfRow({row: station, key: column, value: checked})
          }
        })
      }

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
    }

    onChagedOptionOfRow({row, key, value}) {
      if (key === STATION_AUTO_OPTIONS.warning) {
        let columns = _.values(STATION_AUTO_OPTIONS)
        console.log(columns, "columns_removedWarning")
        _.forEach(columns, column => {
          this.updateDataSource(row, column, value)
          this.updateCache(row, column, value)
          this.checkIndeterminate(column, this.state.dataSource)
        })
      }
      else {
        this.updateDataSource(row, key, value)
        this.updateCache(row, key, value)
        this.checkIndeterminate(key, this.state.dataSource)
      }
    }

    updateDataSource(row, key, value) {
      let _dataSource = this.state.dataSource
      let indexOfRow = _.findIndex(this.state.dataSource, stationAuto => stationAuto._id === row._id)
      _.set(_dataSource, `[${indexOfRow}].options[${key}].allowed`, value)
  
      this.setState({ dataSource: _dataSource })
    }

    updateCache(row, key, value) {
      /* NOTE  cached content
        {
          "_id": {
            warning: true,
            sms: false,
            email: true
          }
        }
      */
      let _cachedData = this.state.cachedData
      let _dataSourceOriginal = this.state.dataSourceOriginal

      let indexOfRow = _.findIndex(_dataSourceOriginal, stationAuto => stationAuto._id === row._id)
      let originalOption = _.get(_dataSourceOriginal[indexOfRow], ['options', key, 'allowed'], false)
      let currentValueInCache = _.get(_cachedData, [row._id, key])
      
      if (currentValueInCache){
        delete _cachedData[row._id][key]
        if (_.keys(_cachedData[row._id]).length === 0) {
          delete _cachedData[row._id]
        }
      }
      else if (originalOption !== value) {
        _.set(_cachedData, [row._id, key, 'allowed'], value)
      }

      this.setState({cachedData: _cachedData})
    }

    onClearCache() {
      let originalData = this.state.dataSourceOriginal
      this.setState({
        dataSource: [...originalData],
        cachedData: {}
      })
    }

    checkIndeterminate(column, data) {
      let _dataSource = this.state.dataSource
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

    checkCheckboxAvailable(row, key, value) {

    }

    async onSubmitCache() {
      this.setState({isSave: true})
      const res = await updateStationAutoOptions(this.state.cachedData)
      if (res.success) {
        this.setState({
          dataSourceOriginal: this.state.dataSource,
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

    showTotal = (total, range) => `${range[1]}/${total}`

    render() {
      console.log('--- cached: ', this.state.cachedData)
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
        updateStationOption: this.onChagedOptionOfRow,
        isSave: this.state.isSave,
        clearCache: this.onClearCache,
        submitCache: this.onSubmitCache,
        cachedData: this.state.cachedData,
        handleCheckAll: this.onChagedOptionOfHeader,
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
