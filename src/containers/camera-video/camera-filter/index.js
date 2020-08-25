import React from 'react'
import { Form as FormStyle } from 'antd'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { mapPropsToFields } from 'utils/form'
import SelectStationCamera from 'components/elements/select-station-camera'
import SelectStationType from 'components/elements/select-station-type'
import createLanguageHoc, { langPropTypes } from 'hoc/create-lang'

const Form = styled(FormStyle)`
  display: flex;
  align-items: center;
  flex: 1;
  padding: 16px 0;
  .ant-form-item-control {
    line-height: 0px;
  }
  .ant-form-item {
    width: 100%;
    margin-bottom: 0px;
  }
  .flex-grow {
    flex-grow: 1;
  }
  > div + div {
    margin-left: 16px;
  }
`

const SelectWrapper = styled.div`
  /* width: 250px; */
  margin-right: 5px;
  width: 100%;
`

const Label = styled.label`
  margin-bottom: 8px;
  font-size: 15px;
  font-weight: 500;
  ::after {
    content: ':';
  }
`

@FormStyle.create({
  mapPropsToFields: mapPropsToFields,
})
@createLanguageHoc
export default class CameraFilter extends React.PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
    initialValues: PropTypes.object,
    onChangeSearch: PropTypes.func,
    lang: langPropTypes,
  }

  constructor(props) {
    super(props)
    this.state = {
      station: 'ALL',
      stationType: 'ALL',
      dataSearch: {
        station: 'ALL',
        stationType: 'ALL',
      },
    }
  }

  async componentDidMount() {
    let { stationKey, stationType } = this.props.initialValues
    if (!stationKey) stationKey = 'ALL'
    if (!stationType) stationType = 'ALL'

    this.setState(
      {
        station: stationKey,
        stationType,
      },
      () => {
        this.props.onChangeSearch(this.state)
      }
    )
  }

  changeStation = station => {
    this.setState({ station }, () => {
      let data = this.state.dataSearch
      if (station) {
        data.station = station
      }
      // Callback submit form Container Component
      this.setState({ dataSearch: data }, () => {
        this.props.onChangeSearch(data)
      })
    })
  }

  changeStationType = stationType => {
    this.setState({ stationType }, () => {
      let data = this.state.dataSearch
      if (stationType) {
        data.stationType = stationType
      }
      // Callback submit form Container Component
      this.setState({ dataSearch: data }, () => this.props.onChangeSearch(data))
    })
  }

  render() {
    const { t } = this.props.lang
    return (
      <Form className="fadeIn animated" onSubmit={this.changeSearch}>
        <SelectWrapper>
          <Label>{t('cameraControl.stationType.label')}</Label>
          <SelectStationType
            isShowAll
            onChange={this.changeStationType}
            value={this.state.stationType}
            placeholder={t('cameraControl.stationType.placeholder')}
          />
        </SelectWrapper>
        <SelectWrapper>
          <Label>{t('cameraControl.station.label')}</Label>
          <SelectStationCamera
            onChange={this.changeStation}
            stationType={this.state.stationType}
            value={this.state.station}
            placeholder={t('cameraControl.station.placeholder')}
          />
        </SelectWrapper>
      </Form>
    )
  }
}
