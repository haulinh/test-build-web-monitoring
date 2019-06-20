import React from 'react'
import { autobind } from 'core-decorators'
import _, { get, findIndex } from 'lodash'
import { temperature } from 'chromatism';

/**
 * Manager list data
 * @param apiList
 * @param apiDelete
 */
const createManagerList = ({ apiList, itemPerPage = 1000 }) => Component => {
  @autobind
  class ManagerListHoc extends React.Component {
    state = {
      dataSource: [],
      dataSourceOriginal: [],
      isLoading: false,
      isSave: false,
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
        changedCache: {},
        pagination: {
          ...res.pagination,
          total: get(res, 'pagination.totalItem', 0)
        },
        isLoading: false,
        pathImg: res.path
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
      /* update datasource */
      let _dataSource = _.clone(this.state.dataSource)
      let indexOfRow = findIndex(this.state.dataSource, stationAuto => stationAuto._id === row._id)
      _.set(_dataSource, `[${indexOfRow}].options[${key}].allowed`, value)
      /* update changed cache */
      let _changedCache = _.clone(this.state.changedCache)
      _.set(_changedCache, `[${row._id}][${key}].allowed`, value)

      this.setState({
        dataSource: _dataSource,
        changedCache: _changedCache
      })
    }

    onClearCache() {
      let originalData = _.cloneDeep(this.state.dataSourceOriginal)
      this.setState({
        dataSource: [...originalData],
        changedCache: {}
      })
    }
    

    onSubmitCache() {
      this.setState({isSave: true})
      console.log('--- will commit: ', this.state.changedCache)
      setTimeout(() => {
        this.setState({isSave: false})
      }, 2000)
    }

    showTotal = (total, range) => `${range[1]}/${total}`

    // temp() {
    //   let dataSourceItem = this.state.dataSource.find(item => item._id === "5cdbde4c25f0fe00106cc8e3" )
    //   let dataSourceOriginalItem = this.state.dataSourceOriginal.find(item => item._id === "5cdbde4c25f0fe00106cc8e3" )
    //   console.log(dataSourceItem.options, dataSourceOriginalItem.options)
    // }

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
      }
      return <Component {...this.props} {...props} />
    }
  }

  return ManagerListHoc
}

export default createManagerList
