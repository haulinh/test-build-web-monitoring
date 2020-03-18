import React from "react";
import PropTypes from "prop-types";
import { default as SearchFormContainer } from "components/elements/box-shadow";
import Heading from "components/elements/heading";
import { Row, Col, Button, Form, DatePicker } from "antd";
import createLang, { translate } from "hoc/create-lang";
import SelectProvince from "components/elements/select-province";
// import SelectStationType from "components/elements/select-station-type";
// import SelectStationAuto from "containers/search/common/select-station-auto"; //'.././common/select-station-auto'
import SelectStationTreeView from "containers/search/common/select-station-tree-view";
import { Clearfix } from "containers/fixed-map/map-default/components/box-analytic-list/style";
import moment from "moment-timezone";

const { RangePicker } = DatePicker;

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
        // console.log("Received values of form: ", values, me.state.measuringList);
        const measuringListUnitStr = me.state.measuringList
          .map(item => {
            return encodeURIComponent(item.unit);
          })
          .join(",");
        // console.log(measuringListUnitStr)
        console.log("values", values);
        if (me.props.cbSubmit)
          me.props.cbSubmit({
            ...values,
            measuringList: me.state.measuringList,
            measuringListUnitStr
          });
      }
    });
  }

  render() {
    const {
      getFieldDecorator,
      // getFieldValue,
      setFieldsValue
    } = this.props.form;
    // const t = this.props.lang.createNameSpace("dataSearchFrom.form");
    return (
      <SearchFormContainer>
        <Heading
          rightChildren={
            <Button
              type="primary"
              icon="file-excel"
              style={{ float: "right" }}
              onClick={this.submit}
              size="small"
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
          {this.props.lang.t("addon.searchSeclect")}
        </Heading>
        <div style={{ padding: "8px 16px" }}>
          <Row gutter={16}>
            <Col span={12}>
              <Item label={translate("qaqc.province.label")}>
                {getFieldDecorator("province", {
                  onChange: val => {
                    setFieldsValue({ stationAuto: null });
                  }
                })(<SelectProvince size="large" />)}
              </Item>
            </Col>
            <Col span={12}>
              <Item
                label={translate("menuApp.report.status_data_obj.dateRange")}
              >
                {getFieldDecorator("time", {
                  rules: [
                    {
                      required: true,
                      message: translate("avgSearchFrom.selectTimeRange.error")
                    }
                  ]
                })(
                  <RangePicker
                    disabledDate={current => {
                      return current && current > moment().endOf("day");
                    }}
                    showTime={{
                      format: "HH:mm",
                      defaultValue: [
                        moment("00:00:00", "HH:mm:ss"),
                        moment("23:59:59", "HH:mm:ss")
                      ]
                    }}
                    format="DD-MM-YYYY HH:mm"
                    placeholder={["Start Time", "End Time"]}
                    style={{ width: "100%" }}
                    size="large"
                  />
                )}
              </Item>
            </Col>
          </Row>
          <Clearfix height={16} />
          <Row gutter={16}>
            <Col span={24}>
              <Item label={translate("stationAuto.label")}>
                {getFieldDecorator("stationAutos", {})(
                  <SelectStationTreeView />
                )}
              </Item>
            </Col>
          </Row>
        </div>
      </SearchFormContainer>
    );
  }
}