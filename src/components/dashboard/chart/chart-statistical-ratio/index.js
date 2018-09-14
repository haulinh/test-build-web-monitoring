import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { Card } from 'antd';
import ReactHighcharts from 'react-highcharts';
import moment from 'moment'
import * as _ from 'lodash'
import { Menu, Dropdown, Icon } from 'antd';

//import { getDataStationAutoRatioCount } from '../../../../api/DataStationAutoApi'

function handleChange(value) {
  console.log(`selected ${value}`);
}

const WrapperView = styled.div` 
margin-top: 16px;
border-radius: 4px;
display: flex;
height: 50px background: #ccd `

@autobind
export default class HeaderView extends React.PureComponent {

  state = {
    data: []
  }

  handleItemSelected = value => {
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  async componentDidMount () {
    //const ra = await getDataStationAutoRatioCount(moment() , moment().subtract(7, 'days'))
    const data = [
      {
          "ratio": 100,
          "list": [
              {
                  "key": "QN_TQT_KHI",
                  "province": {
                      "_id": "5b9b196ab8b6c00010624353",
                      "key": "22",
                      "name": "Quảng Ninh",
                      "numericalOrder": 22
                  },
                  "status": "GOOD",
                  "name": "Trạm Khí Quảng Ninh",
                  "total": 1458,
                  "percent": 100,
                  "totalByTime": 1458
              }
          ],
          "provinceId": "22",
          "name": "Quảng Ninh"
      },
      {
          "ratio": 0,
          "list": [
              {
                  "key": "BinhDuong_NUO",
                  "province": {
                      "_id": "5b9b169cb8b6c00010624352",
                      "key": "74",
                      "name": "Bình Dương",
                      "numericalOrder": 74
                  },
                  "status": "NOT_USE",
                  "name": "Trạm nước Bình Dương",
                  "total": 0,
                  "percent": 0,
                  "totalByTime": 0
              }
          ],
          "provinceId": "74",
          "name": "Bình Dương"
      },
      {
          "ratio": 99.83333333333333,
          "list": [
              {
                  "key": "PhuMy_NUO",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "NOT_USE",
                  "name": "Trạm Phú Mỹ",
                  "total": 0,
                  "percent": 0,
                  "totalByTime": 0
              },
              {
                  "key": "LongSon_NUO",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "NOT_USE",
                  "name": "Trạm Long Sơn",
                  "total": 0,
                  "percent": 0,
                  "totalByTime": 0
              },
              {
                  "key": "TanThanh_NUO",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "NOT_USE",
                  "name": "Trạm Tân Thành",
                  "total": 0,
                  "percent": 0,
                  "totalByTime": 0
              },
              {
                  "key": "BacNinh_NUO",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "NOT_USE",
                  "name": "Trạm nước Bắc Ninh",
                  "total": 0,
                  "percent": 0,
                  "totalByTime": 0
              },
              {
                  "key": "DaNang_Air_KHI",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "NOT_USE",
                  "name": "Trạm khí Đà Nẵng",
                  "total": 0,
                  "percent": 0,
                  "totalByTime": 0
              },
              {
                  "key": "TaLai_NUO",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "GOOD",
                  "name": "Trạm Tà Lài",
                  "total": 321,
                  "percent": 100,
                  "totalByTime": 321
              },
              {
                  "key": "QuyetThang_NUO",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "GOOD",
                  "name": "Trạm Quyết Thắng",
                  "total": 1310,
                  "percent": 100,
                  "totalByTime": 1310
              },
              {
                  "key": "TanHanh_NUO",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "NOT_USE",
                  "name": "Trạm Tân Hạnh",
                  "total": 0,
                  "percent": 0,
                  "totalByTime": 0
              },
              {
                  "key": "AnBinh_NUO",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "NOT_USE",
                  "name": "Trạm An Bình",
                  "total": 0,
                  "percent": 0,
                  "totalByTime": 0
              },
              {
                  "key": "LongThanh_NUO",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "NOT_USE",
                  "name": "Trạm Long Thành",
                  "total": 0,
                  "percent": 0,
                  "totalByTime": 0
              },
              {
                  "key": "BachBay_NUO",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "NOT_USE",
                  "name": "Trạm Rạch Bẫy",
                  "total": 0,
                  "percent": 0,
                  "totalByTime": 0
              },
              {
                  "key": "NhatTuu_NUO",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "NOT_USE",
                  "name": "Trạm Nhật Tựu",
                  "total": 0,
                  "percent": 0,
                  "totalByTime": 0
              },
              {
                  "key": "HoaMac_NUO",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "DATA_LOSS",
                  "name": "Trạm Hòa Mạc",
                  "total": 0,
                  "percent": 0,
                  "totalByTime": 0
              },
              {
                  "key": "NhamTrang_NUO",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "NOT_USE",
                  "name": "Trạm Nhâm Tràng",
                  "total": 0,
                  "percent": 0,
                  "totalByTime": 0
              },
              {
                  "key": "DoXa_NUO",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "DATA_LOSS",
                  "name": "Trạm Đọ Xá",
                  "total": 0,
                  "percent": 0,
                  "totalByTime": 0
              },
              {
                  "key": "GAMMA_Air_Khi",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "NOT_USE",
                  "name": "Trạm GAMMA",
                  "total": 0,
                  "percent": 0,
                  "totalByTime": 0
              },
              {
                  "key": "TaThanhOai_NUO",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "NOT_USE",
                  "name": "Trạm Tả Thanh Oai",
                  "total": 0,
                  "percent": 0,
                  "totalByTime": 0
              },
              {
                  "key": "PhungChau_NUO",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "NOT_USE",
                  "name": "Trạm Phụng Châu",
                  "total": 0,
                  "percent": 0,
                  "totalByTime": 0
              },
              {
                  "key": "KhanhHoa_Air_Khi",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "NOT_USE",
                  "name": "Trạm khí Khánh Hòa",
                  "total": 0,
                  "percent": 0,
                  "totalByTime": 0
              },
              {
                  "key": "YenTri_NUO",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "NOT_USE",
                  "name": "Trạm Yên Trị",
                  "total": 0,
                  "percent": 0,
                  "totalByTime": 0
              },
              {
                  "key": "ThanhLoi_NUO",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "NOT_USE",
                  "name": "Trạm Thành Lợi",
                  "total": 0,
                  "percent": 0,
                  "totalByTime": 0
              },
              {
                  "key": "QuanChuot_NUO",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "NOT_USE",
                  "name": "Trạm Quán Chuột",
                  "total": 0,
                  "percent": 0,
                  "totalByTime": 0
              },
              {
                  "key": "LocHoa_NUO",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "NOT_USE",
                  "name": "Trạm Lộc Hòa",
                  "total": 0,
                  "percent": 0,
                  "totalByTime": 0
              },
              {
                  "key": "PT_BMT_KHI",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "GOOD",
                  "name": "Trạm khí Phú Thọ",
                  "total": 1995,
                  "percent": 99,
                  "totalByTime": 2016
              },
              {
                  "key": "TNg_GIASANG_NUO",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "GOOD",
                  "name": "Trạm nước mặt Gia Sàng",
                  "total": 2006,
                  "percent": 100,
                  "totalByTime": 2006
              },
              {
                  "key": "TTH_CDSP_NUO",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "GOOD",
                  "name": "Trạm nước Huế",
                  "total": 1973,
                  "percent": 100,
                  "totalByTime": 1973
              },
              {
                  "key": "TTH_TQT_KHI",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "DATA_LOSS",
                  "name": "Trạm khí Huế",
                  "total": 2005,
                  "percent": 100,
                  "totalByTime": 2005
              },
              {
                  "key": "HN_NVCU_KHI",
                  "province": {
                      "_id": "5b99ea26b8b6c00010624350",
                      "key": "TTQTMT_MB",
                      "name": "Trung tâm Quan trắc môi trường miền Bắc",
                      "numericalOrder": 0
                  },
                  "status": "DATA_LOSS",
                  "name": "Trạm 556 Nguyễn Văn Cừ",
                  "total": 0,
                  "percent": 0,
                  "totalByTime": 0
              }
          ],
          "provinceId": "TTQTMT_MB",
          "name": "Trung tâm Quan trắc môi trường miền Bắc"
      },
      {
          "ratio": 0,
          "list": [
              {
                  "key": "XeDiDong_Air_Khi",
                  "province": {
                      "_id": "5b961b194e910a0d011e55e1",
                      "key": "01",
                      "name": "Thành phố Hà Nội",
                      "numericalOrder": 0
                  },
                  "status": "NOT_USE",
                  "name": "Xe di động",
                  "total": 0,
                  "percent": 0,
                  "totalByTime": 0
              }
          ],
          "provinceId": "01",
          "name": "Thành phố Hà Nội"
      }
   ]
    this.setState({data})
  }

  getConfigStatus = () => {
    const dataGroup = _.groupBy(this.props.data, 'province.key') 

    const series1 = { name: 'Hoạt động', data: [] }
    const series2 = { name: 'Không hoạt động', data: [], color: 'red' }
    let categories = []
  
    _.forEach(_.keys(dataGroup), key  => {
      console.log(dataGroup[key])
      const total = _.size(_.filter(dataGroup[key], ({status}) => status === 'GOOD'))
      series1.data.push(total)
      series2.data.push(_.size(dataGroup[key]) - total)
      categories.push(_.get(_.head(dataGroup[key]), 'province.name', 'Other'))
    })
  
    return {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Tình trạng hoạt động của trạm',
      },
      xAxis: {
        categories
      },
      yAxis: {
        min: 0,
        title: {
          text: ''
        }
      },
      legend: {
        reversed: true
      },
      series: [series2, series1],
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: true
      },
      plotOptions: {
        column: {
          stacking: 'percent'
        }
      }
    }
  }

  getConfigRatio = () => {

    const series1 = { name: 'Nhận được', data: [] }
    const series2 = { name: 'Không nhận được', data: [], color: 'red' }
    let categories = []
  
    _.forEach(this.state.data, ({ratio, name})  => {
      series1.data.push(ratio)
      series2.data.push(100 - ratio)
      categories.push(name)
    })
  
    return {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Tỉ lệ nhận dữ liệu theo từng địa phương theo tháng'
      },
      xAxis: {
        categories
      },
      yAxis: {
        min: 0,
        title: {
          text: ''
        }
      },
      legend: {
        reversed: true
      },
      series: [series1, series2],
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: ({point.y}%)<br/>',
        shared: true
      },
      plotOptions: {
        series: {
          stacking: 'normal'
        }
      }
    }
  }

  onChange = value => {
    console.log(value)
  }

  menu = () => {
    return (
      <Menu onClick={this.onChange}>
        <Menu.Item key="7">
          <span>7 Ngày</span>
        </Menu.Item>
        <Menu.Item key="10">
          <span>10 Ngày</span>
        </Menu.Item>
        <Menu.Item key="30">
          <span>30 Ngày</span>
        </Menu.Item>
      </Menu>
    )
  };

  render() {
    const data = _.groupBy(this.props.data, 'province.key')
    console.log('data', data)
    return (
      <WrapperView>
        <Card bordered style={{flex: 1, marginRight: 8}}>
          <ReactHighcharts config={ this.getConfigStatus() }
          />
        </Card>
        <Card bordered style={{flex: 1, marginLeft: 8}}>
          <Dropdown overlay={this.menu()} trigger={['click']}>
            <span>
              7 Ngày <Icon type="down" />
            </span>
          </Dropdown>
          <ReactHighcharts config={ this.getConfigRatio() } />
        </Card>
      </WrapperView>
    )
  }
}
