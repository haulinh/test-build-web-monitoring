import { Col, Row, Switch } from 'antd'
import SelectStationAuto from 'components/elements/select-station-auto'
import { Clearfix } from 'components/layouts/styles'
import React from 'react'
import styled from 'styled-components'
import TableCondition from './TableCondition'

const ColSwitch = styled(Col)`
  .ant-form-item .ant-switch {
    margin: 20px 0 4px;
  }
`

class FilterConditionContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            stationName: '',
        }
    }
    render() {
        return (
            <React.Fragment>
                <Row type="flex" justify="space-between">
                    <Col span={6}>
                        <SelectStationAuto
                            onChange={station => {
                                if (station)
                                    this.setState({
                                        stationName: station.name,
                                    })
                            }}
                        />
                    </Col>
                    <Col span={6}>
                        <Row type="flex" justify="end" align="middle">
                            <ColSwitch>
                                <div style={{ marginRight: '10px' }}>
                                    <Switch />
                                </div>
                            </ColSwitch>
                            <Col>
                                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                                    Bộ lọc điều kiện giá trị
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Clearfix height={12} />
                <TableCondition station={this.state.stationName} />
            </React.Fragment>
        )
    }
}

export default FilterConditionContainer
