import React from "react";
import PropTypes from "prop-types";
import { default as SearchFormContainer } from "components/elements/box-shadow";
import Heading from "components/elements/heading";
import { Row, Col, Button, Form, DatePicker } from "antd";
import createLang, { translate } from "hoc/create-lang";
import SelectProvince from "components/elements/select-province";
import SelectStationAuto from "containers/search/common/select-station-auto"; //'.././common/select-station-auto'
import { Clearfix } from "containers/fixed-map/map-default/components/box-analytic-list/style";
import SelectStationType from "components/elements/select-station-type";

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

@Form.create()
@createLang
export default class SearchForm extends React.Component {
  static propTypes = {
    cbSubmit: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = {
      measuringList: []
    };
  }

  submit() {
    let me = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        if (me.props.cbSubmit) me.props.cbSubmit({...values, measuringList: me.state.measuringList});
      }
    });
  }

  render() {
    const {
      getFieldDecorator,
      getFieldValue,
      setFieldsValue
    } = this.props.form;
    const t = this.props.lang.createNameSpace("dataSearchFrom.form");

    return (
      <SearchFormContainer>
        <Heading
          rightChildren={
            // <Button
            //   type="primary"
            //   icon="search"
            //   size="small"
            //   onClick={this.submit}
            // >
            //   {this.props.lang.t("addon.search")}
            // </Button>
            <Button
              type="primary"
              icon="file-excel"
              style={{ float: "right", margin: "5px" }}
              onClick={this.submit}
              // loading={this.props.isExporting}
            >
              {translate("dataSearchFrom.tab.exportExcel")}
            </Button>
          }
          textColor="#ffffff"
          isBackground
          fontSize={14}
          style={{ padding: "8px 16px" }}
        >
          {this.props.lang.t("addon.search")}
        </Heading>
        <div style={{ padding: "8px 16px" }}>
          <Row gutter={16}>
            <Col span={6}>
              <Item label={translate("qaqc.province.label")}>
                {getFieldDecorator("province", {
                  onChange: val => {
                    setFieldsValue({ stationAuto: null });
                  }
                })(<SelectProvince size="large" />)}
              </Item>
            </Col>
            <Col span={6}>
              <Item label={t("stationType.label")}>
                {getFieldDecorator("stationType", {
                  onChange: val => {
                    setFieldsValue({ stationAuto: null });
                  }
                })(<SelectStationType size="large" />)}
              </Item>
            </Col>
           
            <Col span={6}>
              <Item label={t("stationAuto.label")}>
                {getFieldDecorator("stationAuto", {
                  rules: [
                    {
                      required: true,
                      message: translate("avgSearchFrom.form.stationAuto.error")
                    }
                  ]
                })(
                  <SelectStationAuto
                    size="large"
                    // stationTypeKey='WASTE_WATER'
                    stationTypeKey={getFieldValue("stationType")}
                    provinceKey={getFieldValue("province")}
                    onChangeObject={station => {
                      if (station && station.measuringList)
                        this.setState({ measuringList: station.measuringList });
                      else this.setState({ measuringList: [] });
                    }}
                    style={{ width: "100%" }}
                  />
                )}
              </Item>
            </Col>
            <Col span={6}>
              <Item label={translate("avgSearchFrom.selectTimeRange.month")}>
                {getFieldDecorator("time", {
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<MonthPicker style={{ width: "100%" }} size="large"/>)}
              </Item>
            </Col>
          </Row>
          <Clearfix height={16} />
        </div>
      </SearchFormContainer>
    );
  }
}
