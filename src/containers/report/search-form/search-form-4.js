import React from "react";
import PropTypes from "prop-types";
import { default as SearchFormContainer } from "components/elements/box-shadow";
import Heading from "components/elements/heading";
import { Row, Col, Button, Form, DatePicker } from "antd";
import createLang, { translate } from "hoc/create-lang";
import SelectProvince from "components/elements/select-province";
import SelectStationType from "components/elements/select-station-type";
import SelectStationAuto from "containers/search/common/select-station-auto"; //'.././common/select-station-auto'
import { Clearfix } from "containers/fixed-map/map-default/components/box-analytic-list/style";
import moment from "moment-timezone";


const { MonthPicker } = DatePicker;

const Item = props => (
  <Form.Item
    className="noMarginBot"
    {...props}
    colon={false}
    style={{
      color: "rgba(0,0,0,0.8)",
      fontSize: 14,
      fontWeight: 600,
      marginBottom: 0
    }}
  />
);

const i18n = {
  label: {
    buttonSearch: translate("addon.search"),
    headerSearch: translate("addon.searchSeclect"),
    province: translate("qaqc.province.label"),
    stationType: translate("dataSearchFrom.form.stationType.label"),
    stationAuto: translate("dataSearchFrom.form.stationAuto.label"),
    fromMonth: translate("avgSearchFrom.form.fromMonth.label"),
    toMonth: translate("avgSearchFrom.form.toMonth.label"),
    
  },
  error: {
    stationAuto: translate("avgSearchFrom.form.stationAuto.error"),
    fromMonth: translate("avgSearchFrom.form.fromMonth.error"),
    toMonth: translate("avgSearchFrom.form.toMonth.error"),
    toMonth_1: translate("avgSearchFrom.form.toMonth.error1"),
    stationType: translate("avgSearchFrom.form.stationType.error"),

    
  }
};

@Form.create()
@createLang
export default class SearchForm extends React.Component {
  static propTypes = {
    cbSubmit: PropTypes.func,
    isDatePicker: PropTypes.bool
  };

  constructor(props) {
    super(props);
    // this.submit = this.submit.bind(this);
    this.state = {
      measuringList: [],
      stationName: ""
    };
  }

  submit = () => {
    // let me = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log("Received values of form: ", values);
        if (this.props.cbSubmit) {
          const measuringListStr = this.state.measuringList
            .map(item => encodeURIComponent(item.key))
          
            const measuringListUnitStr = this.state.measuringList
            .map(item => encodeURIComponent(item.unit))
            // .join(",");
          // console.log(moment(values.toMonth).format(),moment().format(),"ABC")

          values.fromMonth = moment(values.toMonth).startOf("month")
          values.toMonth = moment(values.toMonth).endOf("month") > moment() ?  moment() : moment(values.toMonth).endOf("month")
          

          this.props.cbSubmit({
            ...values,
            measuringListStr,
            measuringListUnitStr,
            measuringList: this.state.measuringList,
            stationName: this.state.stationName
          });
        }
      }
    });
  };

  render() {
    const {
      getFieldDecorator,
      getFieldValue,
      setFieldsValue
    } = this.props.form;

    return (
      <SearchFormContainer>
        <Heading
          rightChildren={
            <Button
              type="primary"
              icon="search"
              style={{ float: "right" }}
              onClick={this.submit}
              size="small"
            >
              {i18n.label.buttonSearch}
            </Button>
          }
          textColor="#ffffff"
          isBackground
          fontSize={14}
          style={{ padding: "8px 16px" }}
        >
          {i18n.label.headerSearch}
        </Heading>
        <div style={{ padding: "8px 16px" }}>
          <Row gutter={16}>
            <Col span={12}>
              <Item label={i18n.label.province}>
                {getFieldDecorator("province", {
                  onChange: val => {
                    setFieldsValue({ stationAuto: null });
                  }
                })(<SelectProvince size="large" />)}
              </Item>
            </Col>
            <Col span={12}>
              <Item label={i18n.label.stationType}>
                {getFieldDecorator("stationType", {
                  rules: [
                    {
                      required: true,
                      message: i18n.error.stationType
                    }
                  ],
                  onChange: val => {
                    setFieldsValue({ stationAuto: null });
                  }
                })(<SelectStationType size="large" />)}
              </Item>
            </Col>
            </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Item label={i18n.label.stationAuto}>
                {getFieldDecorator("stationAuto", {
                  rules: [
                    {
                      required: true,
                      message: i18n.error.stationAuto
                    }
                  ]
                })(
                  <SelectStationAuto
                    size="large"
                    stationTypeKey={getFieldValue("stationType")}
                    provinceKey={getFieldValue("province")}
                    onChangeObject={station => {
                      if (station && station.measuringList)
                        this.setState({
                          measuringList: station.measuringList,
                          stationName: station.name
                        });
                      else this.setState({ measuringList: [] });
                    }}
                    style={{ width: "100%" }}
                  />
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item label={i18n.label.fromMonth}>
                {getFieldDecorator("fromMonth", {
                   initialValue: moment().add(-2,'months'),
                  rules: [
                    {
                      required: true,
                      message: i18n.error.fromMonth,
                    }
                  ]
                })(<MonthPicker style={{ width: "100%" }} />)}
              </Item>
            </Col>
            <Col span={6}>
              <Item label={i18n.label.toMonth}>
                {getFieldDecorator("toMonth", {
                  initialValue: moment().add(-1,'months'),
                  rules: [
                    {
                      required: true,
                      message: i18n.error.toMonth
                    },
                    {
                      validator: this.compareTofromDate,
                    }
                  ]
                })(<MonthPicker style={{ width: "100%" }} />)}
              </Item>
            </Col>
          </Row>
          <Clearfix height={16} />
        </div>
      </SearchFormContainer>
    );
  }

  compareTofromDate = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value < form.getFieldValue('fromMonth')) {
      callback( i18n.error.toMonth_1);
    } else {
      callback();
    }
  };
}
