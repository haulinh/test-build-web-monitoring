import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Collapse, Icon, Button } from 'antd'
import Clearfix from 'components/elements/clearfix'

const { Panel } = Collapse

const StationFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  .ant-collapse-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`

const Heading = styled.h4`
  font-size: 18px;
  margin-bottom: 0;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const genExtra = () => (
  <Wrapper>
    <Button
      type="primary"
      size="default"
      onClick={event => {
        event.stopPropagation()
      }}
    >
      Xem dữ liệu
    </Button>
    <Clearfix width={12} />
    <Icon
      type="setting"
      onClick={event => {
        // If you don't want click extra trigger collapse, you can prevent this:
        event.stopPropagation()
      }}
    />
  </Wrapper>
)

export default class StationForm extends React.PureComponent {
  static propTypes = {
    stations: PropTypes.array,
  }

  constructor(props) {
    super(props)
    this.state = {
      activeKey: [],
    }
  }

  handleChange = activeKey => {
    this.setState({ activeKey })
  }
  render() {
    console.log(this.state.activeKey)
    if (!this.props.stations.length) return null
    return (
      <StationFormWrapper>
        <Collapse
          activeKey={this.state.activeKey}
          expandIconPosition="left"
          onChange={this.handleChange}
        >
          {this.props.stations.map(station => (
            <Panel
              header={<Heading>{station.name}</Heading>}
              key={station.key}
              extra={genExtra()}
            >
              <span>
                {station.measuringList
                  .map(measuring => measuring.name)
                  .join(', ')}
              </span>
            </Panel>
          ))}
        </Collapse>
      </StationFormWrapper>
    )
  }
}
