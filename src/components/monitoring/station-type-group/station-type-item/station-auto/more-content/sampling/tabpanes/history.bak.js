/* libs import */
import React from 'react'
import { withRouter } from 'react-router'
import { Spin, Tag } from 'antd'
/* user import */
// import { translate } from 'hoc/create-lang'
import SamplingAPI from 'api/SamplingApi'
import moment from 'moment-timezone'
// import { toLower as _toLower } from 'lodash'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import swal from 'sweetalert2'
import _ from 'lodash'
import DataTable from 'shared/components/DataTable'
import 'antd/dist/antd.css'
import ExpandedComponent from './ExpandedComponent'

// const i18n = {
//   stt: translate('monitoring.moreContent.sampling.content.history.stt'),
//   bottleNo: translate(
//     'monitoring.moreContent.sampling.content.history.bottleNo'
//   ),
//   dateTime: translate(
//     'monitoring.moreContent.sampling.content.history.dateTime'
//   ),
//   typeOfSampling: translate(
//     'monitoring.moreContent.sampling.content.history.typeOfSampling'
//   ),
//   activedUser: translate(
//     'monitoring.moreContent.sampling.content.history.activedUser'
//   ),
//   result: translate('monitoring.moreContent.sampling.content.history.result'),
//   success: translate('monitoring.moreContent.sampling.content.history.result'),
//   history: {
//     manual: translate('monitoring.moreContent.sampling.content.history.manual'),
//     cancel_schedule: translate(
//       'monitoring.moreContent.sampling.content.history.cancel_schedule'
//     ),
//     active_schedule: translate(
//       'monitoring.moreContent.sampling.content.history.active_schedule'
//     ),
//     config: translate('monitoring.moreContent.sampling.content.history.config'),
//     reset_bottles: translate(
//       'monitoring.moreContent.sampling.content.history.reset_bottles'
//     ),
//   },
// }


const customStyles = {
  headCells: {
    style: {
      // backgroundColor: "#e47297",
      color: 'black',
      // border: "none",
      fontWeight: 600,
    },
  },
}

@withRouter
export default class SamplingMoreInfo extends React.Component {
  static propTypes = {}
  static defaultProps = {}

  static state = {}

  constructor(props) {
    super(props)
    this.loadData = this.loadData.bind(this)

    this.state = {
      page: 1,
      pageSize: 10,
      total: 0,
      dataSource: [],
      isLoading: true,
      stationID: this.props.stationID,
    }
  }

  async loadData(page, pageSize) {
    this.setState({ isLoading: true }, async () => {
      try {
        let { stationID } = this.state
        // console.log('this.state',  this.state)
        let res = await SamplingAPI.getHistory({
          page,
          itemPerPage: pageSize,
          stationAutoId: stationID,
        })
        if (res.success) {
          const { page, totalItem } = res.pagination
          // add field stt
          const dataSource = res.data.map((item, index) => {
            return {
              ...item,
              stt: (page - 1) * pageSize + index + 1,
              createdAt: moment(item.createdAt).format(DD_MM_YYYY_HH_MM),
            }
          })
          this.setState({
            page,
            total: totalItem,
            dataSource,
            isLoading: false,
          })
        }
      } catch (e) {
        console.log(e, '--------e')
        const { message } = _.get(e.response, 'data.error')
        this.setState({
          isLoading: false,
        })
        swal({ title: message, type: 'error' })
      }
    })
  }

  async componentWillMount() {
    this.loadData(this.state.page, this.state.pageSize)
  }

  /* load history on tab change */
  componentDidMount() {
    if (this.props.getRef) this.props.getRef(this)
  }

  renderColumn() {
    return [
      {
        name: 'STT',
        selector: 'stt',
      },
      {
        name: 'Số bình chứa',
        selector: 'bottleNumber',
      },
      {
        name: 'Thời gian lấy',
        selector: 'createdAt',
        grow: 2,
      },
      {
        name: 'Hành động',
        selector: 'typeOfSampling',
      },
      {
        name: 'Người kích hoạt',
        selector: 'user',
        grow: 3,
      },
      {
        name: 'Hình thức truyền',
        selector: 'samplingProtocol',
      },
      {
        name: 'Kết quả lấy mẫu',
        selector: 'result',
        cell: (row, index) => {
          if (row.result === 'FAILED' ) {
            return (
              <Tag
                style={{
                  borderRadius: '4px',
                  width: '6em',
                  textAlign: 'center',
                }}
                color="#cc1200"
              >
                FAILED
              </Tag>
            )
          }else if(row.result === undefined) {
            return ''
          }
          return (
            <Tag
              style={{ borderRadius: '4px', width: '6em', textAlign: 'center' }}
              color="#6ba84f"
            >
              SUCCESS
            </Tag>
          )
        },
      },
    ]
  }

  _handlePageChange = page => {
    this.setState(
      {
        page,
      },
      () => {
        this.loadData(this.state.page, this.state.pageSize)
      }
    )
  }

  _handlePerRowsChange = itemPerPage => {
    this.setState(
      {
        pageSize: itemPerPage,
      },
      () => {
        this.loadData(this.state.page, this.state.pageSize)
      }
    )
  }

  _getCustomIconConfig = row => {
    const CustomIconConfig = {
      expanded: (
        <img src="images/sampling-icons/down-circle.svg" alt="down icon" />
      ),
      collapsed: (
        <img src="images/sampling-icons/up-circle.svg" alt="up icon" />
      ),
    }
    const HidenIcon = {
      expanded: <div></div>,
      collapsed: <div></div>,
    }
    if (row.typeOfSampling === 'AUTOMATIC') {
      return CustomIconConfig
    }
    return HidenIcon
  }

  render() {
    const CustomIconConfig = {
      collapsed: (
        <img src="images/sampling-icons/down-circle.svg" alt="down icon" />
      ),
      expanded: <img src="images/sampling-icons/up-circle.svg" alt="up icon" />,
    }

    return (
      <DataTable
        data={this.state.dataSource}
        columns={this.renderColumn()}
        customStyles={customStyles}
        highlightOnHover
        noHeader={true}
        // pagination
        paginationServer={true}
        paginationTotalRows={this.state.total}
        onChangeRowsPerPage={this._handlePerRowsChange}
        onChangePage={this._handlePageChange}
        progressPending={this.state.isLoading}
        progressComponent={<Spin tip="Loading..." />}
        expandableRows
        expandOnRowClicked
        expandableRowDisabled={row => row.typeOfSampling !== 'AUTOMATIC'}
        isShowIcon={row => row.typeOfSampling === 'AUTOMATIC'}
        expandableIcon={CustomIconConfig}
        // expandableRowsComponent={
        //   <ExpandedComponent data={dataExapand} dataExapand={dataExapand} />
        // }
        noDataComponent="Hiện chưa  lịch sử lấy mẫu"
      />
    )
  }

  // render() {
  //   return (
  //     <div style={{ padding: 8 }}>
  //       <Table
  //         loading={this.state.isLoading}
  //         dataSource={this.state.dataSource}
  //         pagination={{
  //           pageSize: this.state.pageSize,
  //           current: this.state.page,
  //           onChange: this.loadData,
  //           total: this.state.total,
  //         }}
  //         size="small"
  //         rowKey={record => record._id} // https://ant.design/components/table/#Note
  //       >
  //         <Column title="STT" align="center" dataIndex="stt" width={30} />

  //         <Column
  //           title={i18n.bottleNo}
  //           align="center"
  //           dataIndex="bottleNumber"
  //           width={50}
  //         />

  //         <Column
  //           title={i18n.dateTime}
  //           align="center"
  //           dataIndex="createdAt"
  //           width={70}
  //         />

  //         <Column
  //           title={i18n.typeOfSampling}
  //           align="center"
  //           dataIndex="typeOfSampling"
  //           width={150}
  //           render={(...args) => {
  //             const [data] = args
  //             return <div>{i18n.history[_toLower(data)]}</div>
  //           }}
  //         />

  //         <Column
  //           title={i18n.activedUser}
  //           align="center"
  //           dataIndex="user"
  //           width={150}
  //         />

  //         <Column
  //           title="Hình thức truyền"
  //           align="center"
  //           dataIndex="samplingProtocol"
  //           width={150}
  //         />

  //         <Column
  //           title={i18n.result}
  //           align="center"
  //           dataIndex="result"
  //           width={50}
  //           render={(...args) => {
  //             const [data] = args
  //             switch (data) {
  //               case 'SUCCESS':
  //                 return <Tag color="#6ba84f">{data}</Tag>
  //               case 'FAILED':
  //                 return <Tag color="#cc1200">{data}</Tag>
  //               default:
  //                 break
  //             }
  //           }}
  //         />
  //       </Table>
  //     </div>
  //   )
  // }
}
