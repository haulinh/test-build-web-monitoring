/* libs import */
import React from "react";
import { withRouter } from "react-router";
import { Table, Tag } from "antd";
/* user import */
import { translate } from "hoc/create-lang";
import { getHistory } from "api/SamplingApi";
import moment from 'moment'
import { DD_MM_YYYY_HH_MM } from "constants/format-date";
import swal from "sweetalert2";

const i18n = {
  stt: translate("monitoring.moreContent.sampling.content.history.stt"),
  bottleNo: translate(
    "monitoring.moreContent.sampling.content.history.bottleNo"
  ),
  dateTime: translate(
    "monitoring.moreContent.sampling.content.history.dateTime"
  ),
  typeOfSampling: translate(
    "monitoring.moreContent.sampling.content.history.typeOfSampling"
  ),
  activedUser: translate(
    "monitoring.moreContent.sampling.content.history.activedUser"
  ),
  result: translate(
    "monitoring.moreContent.sampling.content.history.result"
  ),
  success: translate('monitoring.moreContent.sampling.content.history.result')
};

const {Column, ColumnGroup} = Table

@withRouter
export default class SamplingMoreInfo extends React.Component {
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
  }

  state = {
    page: 1,
    pageSize: 10,
    total: 0,
    dataSource: [],
    isLoading: true
  };

  async loadData(page, pageSize) {
    this.setState({ isLoading: true }, async () => {
      try{
        let res = await getHistory({
          page,
          itemPerPage: pageSize
        });
        if (res.success) {
          const { page, totalItem } = res.pagination;
          // add field stt 
          const dataSource = res.data.map((item, index)=> {
            return {
              ...item,
              stt: (page - 1) * pageSize + index + 1,
              createdAt: moment(item.createdAt).format(DD_MM_YYYY_HH_MM)
            }
          })
          this.setState({
            page,
            total: totalItem,
            dataSource,
            isLoading: false
          });
        }
      } catch(e){
        const { message} = e.response.data.error
        this.setState({
          isLoading: false
        });
        swal({title: message, type: 'error'})
      }
    });
  }

  async componentWillMount() {
    this.loadData(this.state.page, this.state.pageSize);
  }

  render() {
    return (
      <div style={{ padding: 8 }}>
        <Table
          loading={this.state.isLoading}
          dataSource={this.state.dataSource}
          pagination={{
            pageSize: this.state.pageSize,
            current: this.state.page,
            onChange: this.loadData,
            total: this.state.total
          }}
          size="small"
          rowKey={(record) => record._id }  // https://ant.design/components/table/#Note
        >
          <Column 
            align="center"
            title="STT"
            dataIndex="stt"
            width={30}
          />

           <Column 
            title={i18n.bottleNo}
            align="center"
            dataIndex="bottleNumber"
            width={50}
          />
          
          <Column 
            title={i18n.dateTime}
            align="center"
            dataIndex="createdAt"
            width={70}
          />

          <Column 
            title={i18n.typeOfSampling}
            align="center"
            dataIndex="typeOfSampling"
            width={150}
          />

          <Column 
            title={i18n.activedUser}
            align="center"
            dataIndex="user"
            width={150}
      
          />

          <Column 
            title={i18n.result}
            align="center"
            dataIndex="result"
            width={50}
            render={(...args) => {
              const [data, record] = args
              switch(data) {
                case 'SUCCESS': return <Tag color="#6ba84f">{data}</Tag>
                case 'FAILED' : return <Tag color="#cc1200">{data}</Tag>
              }
            }}
          /> 
        </Table>
      </div>
    );
  }
}
