import React from "react";
import { Checkbox, Form, Button, Tabs, Card, Skeleton } from "antd";
import PageContainer from "layout/default-sidebar-layout/PageContainer";
import Breadcrumb from "../breadcrumb";
import { translate } from "hoc/create-lang";
import { getStationTypes } from "api/CategoryApi";
import * as _ from "lodash";
import { connect } from "react-redux";
import TableConfig from "./table";
import { getConfigQAQC, putConfigQAQC } from "api/CategoryApi";

const { TabPane } = Tabs;

const i18n = {
  beyondMeasuringRange: translate("qaqcConfig.beyondMeasuringRange"),
  deviceError: translate("qaqcConfig.deviceError"),
  deviceCalibration: translate("qaqcConfig.deviceCalibration"),

  btnSave: translate("addon.save")
};

@connect(state => ({
  isInitLoaded: state.stationAuto.isInitLoaded,
  stationList: state.stationAuto.list
}))
@Form.create()
export default class QAQC_Config extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isInitLoaded: false,
      activeTabkey: "tab1",
      tabList: []
    };
    this.getData = this.getData.bind(this);
  }

  dataTable = [];

  handleSubmit = () => {
    console.log("aaa");
    this.props.form.validateFields(async (err, values) => {
      console.log("aaa");
      if (!err) {
        console.log("Received values of form: ", values);
      }
      let measureConfig = await this.getData();
      console.log("measureConfig", measureConfig);
      let response = await putConfigQAQC({
        ...values,
        measureConfig
      });
      console.log("response", response);
    });
  };

  async getData() {
    let result = {};
    for (var i = 0; i < this.dataTable.length; i++) {
      let item = this.dataTable[i];
      let data = await item.getTableData();
      result = _.merge(result, data);
    }
    return result;
  }

  onTabChange = (key, type) => {
    console.log(key, type);
    this.setState({ activeTabkey: key });
  };

  async componentDidMount() {
    let stationTypes = await getStationTypes({}, { isAuto: true });
    if (stationTypes.success) {
      let tabList = stationTypes.data.map(item => {
        return {
          key: item.key,
          tab: item.name,
          name: item.name
        };
      });
      this.setState({
        tabList,
        activeTabkey: _.result(stationTypes.data, "[0].key", "")
      });
    }

    let response = await getConfigQAQC();

    let dataForm = {};
    if (response.success) {
      const { data } = response;
      console.log("data,", data);
      // const { setFieldsValue } = this.props.form;

      // setTimeout(()=>{

      // },5000)
      // setFieldsValue({
      //   beyondMeasuringRange: data.beyondMeasuringRange,
      //   deviceError: data.deviceError,
      //   deviceCalibration: data.deviceCalibration,
      //   ...data.measureConfig
      // })
      dataForm = {
        beyondMeasuringRange: data.beyondMeasuringRange,
        deviceError: data.deviceError,
        deviceCalibration: data.deviceCalibration,
        ...data.measureConfig
      };
    }
    // console.log('datqa',data)

    this.setState({ isInitLoaded: true }, () => {
      const { setFieldsValue } = this.props.form;
      setFieldsValue(dataForm);
    });
  }

  getMeasuring() {
    let result = [];
    let stations = this.props.stationList.filter(
      item => _.result(item, "stationType.key") === this.state.activeTabkey
    );
    stations.map(station => {
      let measures = station.measuringList.map(mea => mea.key);
      result = _.union(result, measures);

      return null;
    });

    return result;
  }

  getMeasuringByType(type) {
    let result = [];
    let stations = this.props.stationList.filter(
      item => _.result(item, "stationType.key") === type
    );
    stations.map(station => {
      let measures = station.measuringList.map(mea => mea.key);
      result = _.union(result, measures);

      return null;
    });

    return result;
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <PageContainer
          {...this.props.wrapperProps}
          backgroundColor={"#fafbfb"}
        />
        <Breadcrumb items={["configNew"]} />
        <Form style={{ padding: 24 }}>
          {!this.state.isInitLoaded && (
            <Skeleton
              title={false}
              paragraph={{ rows: 3, width: [200, 200, 200] }}
            />
          )}

          {this.state.isInitLoaded && (
            <div>
              <Form.Item style={{ marginBottom: 8 }}>
                {getFieldDecorator("beyondMeasuringRange", {
                  valuePropName: "checked"
                })(<Checkbox>{i18n.beyondMeasuringRange}</Checkbox>)}
              </Form.Item>
              <Form.Item style={{ marginBottom: 8 }}>
                {getFieldDecorator("deviceError", {
                  valuePropName: "checked"
                })(<Checkbox>{i18n.deviceError}</Checkbox>)}
              </Form.Item>
              <Form.Item style={{ marginBottom: 8 }}>
                {getFieldDecorator("deviceCalibration", {
                  valuePropName: "checked"
                })(<Checkbox>{i18n.deviceCalibration}</Checkbox>)}
              </Form.Item>
            </div>
          )}

          <Card
            loading={!this.state.isInitLoaded || !this.props.isInitLoaded}
            style={{ width: "100%" }}
          >
            <Tabs defaultActiveKey={this.state.activeTabkey} onChange={e => {}}>
              {this.state.tabList.map(tab => {
                let measures = this.getMeasuringByType(tab.key);

                let dataTableMeasures = measures.map(item => {
                  return {
                    key: item,
                    zero: false,
                    negative: false
                  };
                });
                return (
                  <TabPane forceRender={true} tab={tab.name} key={tab.key}>
                    <TableConfig
                      form={this.props.form}
                      getRef={ref => this.dataTable.push(ref)}
                      dataTableMeasures={dataTableMeasures}
                      type={tab.key}
                    />
                  </TabPane>
                );
              })}
            </Tabs>
          </Card>

          <br />
          <Button block type="primary" onClick={this.handleSubmit}>
            {i18n.btnSave}
          </Button>
        </Form>
      </div>
    );
  }
}
