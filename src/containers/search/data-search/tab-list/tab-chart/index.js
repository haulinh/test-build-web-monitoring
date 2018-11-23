import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import ReactHighcharts from 'react-highcharts/ReactHighstock'
import * as _ from 'lodash'
import PropTypes from 'prop-types'
import moment from 'moment/moment'
import { translate } from 'hoc/create-lang'
import chartAutoResize from 'hoc/chart-autoresize'

const TabChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Thumbnail = styled.div`
display: flex;
flex-direction: row;
`

const ThumbnailItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  border-bottom: ${props => props.selected ? 2 : 0}px solid blue;

`

const Line = styled.div` height: 3px; width: 7px; margin-right: 4px; background-color:  ${props => props.color || 'transparent'} `


const colors = ['#058DC7', '#50B432', '#7D5611', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']


ReactHighcharts.Highcharts.wrap(ReactHighcharts.Highcharts.RangeSelector.prototype, 'drawInput', function (proceed, name) {    
  proceed.call(this, name);
  this[name + 'DateBox'].on('click', function () {} );    
});

ReactHighcharts.Highcharts.setOptions({
  lang: {
    rangeSelectorFrom: 'From',
    rangeSelectorTo: 'To',
    rangeSelectorZoom:''
  },
  rangeSelector:{
    inputDateFormat: '%d/%m/%Y',
    inputEditDateFormat: '%d/%m/%Y',                    
    inputDateParser: function (value) {
        value = value.split('/');
        console.log(value);
        return Date.UTC(
          parseInt(value[0]),
          parseInt(value[1]) - 1,
          parseInt(value[2])
        );
    }
  }
});
//@chartAutoResize
@autobind
export default class TabChart extends React.PureComponent {
  static propTypes = {
    getChart: PropTypes.func,
    dataStationAuto: PropTypes.array,
    measuringData: PropTypes.array,
    nameChart: PropTypes.string
  }

 

  constructor(props) {
    super(props)
    this.initData(props, true)
  }

  initData  = (props, isInit = false) => {
    const seriesData = {}
    const mesureList = _.map(_.clone(props.measuringData), (item, index) => {
      const color = _.get(colors, [index], 'yellow')
      seriesData[item.key] = {
        name: item.name, 
        data: [], color, 
        tooltip: {valueDecimals: 4}, 
        minLimit: item.minLimit, 
        maxLimit: item.maxLimit,
        threshold: _.isNumber(item.maxLimit) ? item.maxLimit : 10000000,
        negativeColor: color,
        color: 'red'
      }
      return {
        code: item.key,
        ...item,
        color
      }
    })

    _.forEachRight(props.dataStationAuto, ({measuringLogs, receivedAt}) => {
      const time = moment(receivedAt).unix()
      
      _.mapKeys(seriesData, function(value, key) {
        seriesData[key].data.push([time, _.get(measuringLogs ,[key, 'value'], 0)])
        return key;
      })
    })

    mesureList.unshift({code: '__ALL__', name: 'Tất cả'})
    if (isInit) {
      this.state = {
        seriesData,
        mesureList,
        plotLines: [],
        minChart: undefined,
        series: _.values(seriesData),
        measureCurrent: '__ALL__'
      }
    } else {
      this.setState({ seriesData, mesureList, plotLines: [], series: _.values(seriesData) })
    }
    
  }

  componentWillReceiveProps (nextProps) {
    if (
      !_.isEqual(this.props.dataStationAuto, nextProps.dataStationAuto) || 
      !_.isEqual(this.props.measuringData, nextProps.measuringData)
    ) {
      this.initData(nextProps)
     }
  }

  hanldleMeasureChange = measureCurrent => {
    let series = []
    let plotLines = []
    let minChart = undefined
    if (measureCurrent === '__ALL__'){
      series = _.values(this.state.seriesData)
    } else {
      const dataSeries = _.get(this.state.seriesData, [measureCurrent], {})
      series = [dataSeries]
      minChart = _.get(dataSeries,'minLimit', undefined)
      plotLines = [
        {
          value: _.get(dataSeries,'minLimit', undefined),
          color: 'green',
          dashStyle: 'shortdash',
          width: 2,
          label: {
              text: translate(`dashboard.chartStatus.min`, {min: _.get(dataSeries,'minLimit', '')})
          }
      }, {
          value: _.get(dataSeries,'maxLimit', undefined),
          color: 'red',
          dashStyle: 'shortdash',
          width: 2,
          label: {
              text: translate(`dashboard.chartStatus.max`, {max:_.get(dataSeries,'maxLimit', '')})
          }
      }
      ]
    }
    this.setState({measureCurrent, series, plotLines, minChart})
  }

  configChar = (series, plotLines = [], minChart) => {
    return {
      chart: {
        type: 'line'
      },
      credits: {
        enabled: false
      },
      rangeSelector: {
        enabled: true,
        buttons: [],
        allButtonsEnabled: true,
        inputEnabled: true,
        // inputEditDateFormat:'%d/%m/%Y:%k:%M',
        // inputDateFormat:'%d/%m/%Y:%k:%M',
        // inputDateParser: function (value) {
        //   value = value.split('/');
        //   console.log(value);
        //   return Date.UTC(
        //       parseInt(value[0]),
        //       parseInt(value[1]) - 1,
        //       parseInt(value[2])
        //   );
        // }
      },
      navigation: {
        buttonOptions: {
          enabled: false
        }
      },
      title: {
       // text: this.props.nameChart
       text: 'Ma Diem'
      },
      yAxis: {
        min: minChart,
        plotLines,
        title: {
          text: ''
        }
      },
      series,
      responsive: {
        rules: [{
          condition:{
            maxWidth: 400,
            minHeight: 250,
            minWidth: 200
          }
        }]
      }
    }
  }

  render() {
    return (
      <TabChartWrapper>
        <ReactHighcharts config={this.configChar(this.state.series, this.state.plotLines, this.state.minChart)} />
        <Thumbnail>
          {
            this.state.mesureList.map(({name, code, color}) => <ThumbnailItem
              onClick={() => this.hanldleMeasureChange(code)}
              selected={this.state.measureCurrent === code}
              color={color}
              key={code} code={code}><Line color={color}/>{name}</ThumbnailItem>)
          }  
        </Thumbnail>
      </TabChartWrapper>
    )
  }
}