import React from "react";
import { Checkbox, Form, Button, Tabs, Card } from "antd";
import PageContainer from "layout/default-sidebar-layout/PageContainer";
import Breadcrumb from "../breadcrumb";
import { translate } from "hoc/create-lang";
import { getStationTypes } from "api/CategoryApi";
import * as _ from "lodash";
import { connect } from "react-redux";
import TableConfig from "./table";

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
  state = {
    isInitLoaded: false,
    activeTabkey: "tab1",
    tabList: []
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };

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

    this.setState({ isInitLoaded: true });
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
        <Form style={{ padding: 24 }} onSubmit={this.handleSubmit}>
          <Form.Item style={{ marginBottom: 8 }}>
            {getFieldDecorator("beyondMeasuringRange", {})(
              <Checkbox>{i18n.beyondMeasuringRange}</Checkbox>
            )}
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }}>
            {getFieldDecorator("deviceError", {})(
              <Checkbox>{i18n.deviceError}</Checkbox>
            )}
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }}>
            {getFieldDecorator("deviceCalibration", {})(
              <Checkbox>{i18n.deviceCalibration}</Checkbox>
            )}
          </Form.Item>

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
                  <TabPane tab={tab.name} key={tab.key}>
                    <TableConfig
                      getRef={ref => (this.TableConfig = ref)}
                      dataTableMeasures={dataTableMeasures}
                      type={tab.key}
                    />
                  </TabPane>
                );
              })}
            </Tabs>
          </Card>

          <br />
          <Button
            block
            type="primary"
            onClick={e => {
              e.preventDefault();
              console.log("this.refs", this.TableConfig.getTableData());
            }}
          >
            {i18n.btnSave}
          </Button>
        </Form>
      </div>
    );
  }
}
