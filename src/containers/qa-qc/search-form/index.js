import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form'
import PropTypes from 'prop-types'
import { Row, Col, Button, Checkbox } from 'antd'
import DatePicker from 'components/elements/datetime-picker'
import createLang from 'hoc/create-lang'
import Label from 'components/elements/label'
import SelectStationType from 'components/elements/select-station-type'
import SelectAnt from 'components/elements/select-ant'
import Clearfix from 'components/elements/clearfix'
import createValidateComponent from 'components/elements/redux-form-validate'
import moment from 'moment'
import { default as BoxShadowStyle } from 'components/elements/box-shadow'
import Heading from 'components/elements/heading'
import SelectStationAuto from '../../search/common/select-station-auto'
import { translate } from 'hoc/create-lang'

const CheckboxGroup = Checkbox.Group
const FSelectStationType = createValidateComponent(SelectStationType)
const FSelectStationAuto = createValidateComponent(SelectStationAuto)
const FDatePicker = createValidateComponent(DatePicker)
const FSelectAnt = createValidateComponent(SelectAnt)

const DATE_FORMAT = 'YYYY/MM/DD HH:mm'

const SearchFormContainer = BoxShadowStyle.extend``
const Container = styled.div`
  padding: 16px 16px;
`

const View = styled.div``

const stationOptions = [
  { label: translate('qaqc.dataFilter.negative'), value: 'nagative' },
  { label: translate('qaqc.dataFilter.isZero'), value: 'zero' },
  { label: translate('qaqc.dataFilter.outOfRange'), value: 'out' }
]

function validate(values) {
  const errors = {}
  if (!values.stationType)
    errors.stationType = translate('avgSearchFrom.form.stationType.error')
  if (!values.stationAuto || values.stationAuto === '')
    errors.stationAuto = translate('avgSearchFrom.form.stationAuto.error')
  if (!values.type) errors.type = translate('avgSearchFrom.form.type.error')
  if (values.measuringList && values.measuringList.length === 0)
    errors.measuringList = translate('avgSearchFrom.form.measuringList.require')

  return errors
}

@connect((state, ownProps) => ({
  initialValues: {
    fromDate: moment(new Date().setMonth(new Date().getMonth() - 1)),
    toDate: moment(),
    ...(ownProps.initialValues ? ownProps.initialValues : {})
  }
}))
@reduxForm({
  form: 'dataSearchForm',
  validate
})
@createLang
@autobind
export default class SearchForm extends React.Component {
  static propTypes = {
    measuringData: PropTypes.array,
    searchNow: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = {
      stationTypeKey: props.initialValues.stationType,
      stationAutoKey: props.initialValues.stationAuto,
      measuringData: props.measuringData ? props.measuringData : [],
      measuringList: props.measuringData
        ? props.measuringData.map(measuring => ({
            value: measuring.key,
            name: measuring.name
          }))
        : []
    }
  }

  componentDidMount() {
    if (this.props.searchNow) {
      setTimeout(() => {
        this.props.handleSubmit(this.handleSubmit)()
      }, 100)
    }

    // if(this.props.initialValuesOther){
    //   const {stationAuto, stationType, measuringList} = this.props.initialValuesOther
    //   this.props.change('stationType', stationType)
    //   this.props.change('stationAuto', stationAuto)
    //   this.props.change('measuringList', measuringList)
    //
    // }
  }

  handleChangeStationType(stationTypeKey, e) {
    this.setState({
      stationTypeKey: stationTypeKey ? stationTypeKey.key : '',
      stationAutoKey: ''
    })
    this.props.change('stationAuto', '')
  }

  handleChangeStationAuto(stationAuto) {
    const measuringData = stationAuto.measuringList.sort(function(a, b) {
      return a.numericalOrder - b.numericalOrder
    })
    this.setState({
      measuringList: measuringData.map(measuring => ({
        value: measuring.key,
        name: measuring.name
      })),
      measuringData: measuringData,
      stationAutoKey: stationAuto.key,
      stationAutoName: stationAuto.name
    })
    this.props.change('measuringList', measuringData.map(m => m.key))
  }

  convertDateToString(date) {
    return moment(date, 'YYYY-MM-DD HH:mm').toISOString()
  }

  handleSubmit(values) {
    this.props.onSubmit({
      fromDate: this.convertDateToString(values.fromDate),
      toDate: this.convertDateToString(values.toDate),
      key: values.stationAuto,
      name: this.state.stationAutoName,
      measuringList: values.measuringList,
      measuringData: this.state.measuringData,
      isExceeded: values.isExceeded,
      advanced: values.advanced
        ? values.advanced.filter(
            item =>
              item.measuringKey &&
              item.operator &&
              item.value !== null &&
              typeof item.value !== 'undefined'
          )
        : []
    })
  }

  handleResetAdvanced() {
    this.props.array.removeAll('advanced')
  }

  handleChoseOptions = e => {
    console.log(e)
  }

  render() {
    const t = this.props.lang.createNameSpace('dataSearchFrom.form')
    return (
      <SearchFormContainer>
        <Heading
          rightChildren={
            <Button
              type="primary"
              icon="search"
              size="small"
              onClick={this.props.handleSubmit(this.handleSubmit)}
            >
              {this.props.lang.t('addon.search')}
            </Button>
          }
          textColor="#ffffff"
          isBackground
          fontSize={14}
          style={{ padding: '8px 16px' }}
        >
          {this.props.lang.t('addon.search')}
        </Heading>
        <Container>
          <Row gutter={16}>
            <Col span={8}>
              <Field
                label={t('stationType.label')}
                name="stationType"
                size="large"
                onHandleChange={this.handleChangeStationType}
                component={FSelectStationType}
              />
            </Col>
            <Col span={8}>
              <Field
                label={t('stationAuto.label')}
                name="stationAuto"
                size="large"
                stationTypeKey={this.state.stationTypeKey}
                component={FSelectStationAuto}
                onChangeObject={this.handleChangeStationAuto}
                stationAutoKey={this.state.stationAutoKey}
                setKey
              />
            </Col>
            <Col span={8}>
              <Field
                label={t('measuringList.label')}
                name="measuringList"
                size="large"
                showSearch
                mode="multiple"
                options={this.state.measuringList}
                component={FSelectAnt}
              />
            </Col>
          </Row>
          <Clearfix height={16} />
          <Row gutter={24}>
            <Col span={8}>
              <Field
                label={t('fromDate.label')}
                name="fromDate"
                size="large"
                component={FDatePicker}
                dateFormat={DATE_FORMAT}
              />
            </Col>
            <Col span={8}>
              <Field
                label={t('toDate.label')}
                name="toDate"
                size="large"
                component={FDatePicker}
                dateFormat={DATE_FORMAT}
              />
            </Col>
            <Col span={8}>
              <View>
                <Label style={{ display: 'block' }}>
                  {translate('qaqc.dataFilter.label')}
                </Label>
                <CheckboxGroup
                  options={stationOptions}
                  onChange={this.handleChoseOptions}
                />
              </View>
            </Col>
          </Row>
        </Container>
      </SearchFormContainer>
    )
  }
}
