import React from "react";
// import PropTypes from "prop-types";
// import styled from "styled-components";
import {
  message,
  // Tabs,
  Button,
  Table,
  Form,
  InputNumber,
  Icon,
  Popconfirm,
  Spin,
  Select
} from "antd";
import { Clearfix } from "containers/map/map-default/components/box-analytic-list/style";
import {
  getMeasurings,
  getConfigAqiQC,
  postConfigAqiQC
} from "api/CategoryApi";
import { translate } from "hoc/create-lang";
import * as _ from "lodash";

const i18n = {
  submit: translate("addon.save"),
  warning: translate("addon.warning"),
  refresh: translate("addon.refresh"),
  cancel: translate("addon.cancel"),
  updateSuccess: translate("addon.onSave.update.success"),
  updateError: translate("addon.onSave.update.error"),

  add: translate("aqiConfigCalculation.add"),
  required: translate("aqiConfigCalculation.required"),
  colLevel: translate("aqiConfigCalculation.colLevel"),
  colMin: translate("aqiConfigCalculation.colMin"),
  colMax: translate("aqiConfigCalculation.colMax"),
  colColor: translate("aqiConfigCalculation.colColor"),
  colDescription: translate("aqiConfigCalculation.colDescription"),

  colMeasureKey: translate("aqiConfigCalculation.colMeasureKey"),
  colMeasure: translate("aqiConfigCalculation.colMeasure"),
  colAvg1H: translate("aqiConfigCalculation.colAvg1H"),
  colAvg1D: translate("aqiConfigCalculation.colAvg1D"),
  colUnit: translate("aqiConfigCalculation.colUnit")
};

let idIncrement = 0;

@Form.create({})
export default class TabMucDo extends React.Component {
  state = {
    isLoaded: false,
    isSubmit: false,
    dataSource: [],
    dataMeasuringObj: {}
  };

  columns = [
    {
      title: i18n.colMeasureKey,
      dataIndex: "viewMeasure",
      key: "viewMeasure",
      align: "center",
      render: (text, record, index) => {
        const { getFieldValue } = this.props.form;
        const aqiQcList = getFieldValue(`aqiQcList[${record.key}].keyMeasure`);
        return aqiQcList;
      }
    },
    {
      title: i18n.colMeasure,
      dataIndex: "selectMeasure",
      key: "selectMeasure",
      align: "center",
      render: (text, record, index) => {
        const { getFieldDecorator } = this.props.form;
        return (
          <Form.Item style={{ textAlign: "left", marginBottom: "initial" }}>
            {getFieldDecorator(`aqiQcList[${record.key}].keyMeasure`, {
              rules: [
                {
                  required: true,
                  message: i18n.required
                }
              ]
            })(<this.SelectMeasure />)}
          </Form.Item>
        );
      }
    },
    {
      title: i18n.colAvg1H,
      dataIndex: "h",
      key: "h",
      align: "center",
      render: (text, record, index) => {
        const { getFieldDecorator } = this.props.form;
        return (
          <Form.Item style={{ textAlign: "left", marginBottom: "initial" }}>
            {getFieldDecorator(`aqiQcList[${record.key}].h`, {
              rules: [
                {
                  required: true,
                  message: i18n.required
                }
              ]
            })(
              <InputNumber
                style={{ width: "100%" }}
                placeholder={i18n.colAvg1H}
              />
            )}
          </Form.Item>
        );
      }
    },
    {
      title: i18n.colAvg1D,
      dataIndex: "d",
      key: "d",
      align: "center",
      render: (text, record, index) => {
        const { getFieldDecorator } = this.props.form;
        return (
          <Form.Item style={{ marginBottom: "initial" }}>
            {getFieldDecorator(`aqiQcList[${record.key}].d`, {
              rules: [
                {
                  required: true,
                  message: i18n.required
                }
              ]
            })(
              <InputNumber
                style={{ width: "100%" }}
                placeholder={i18n.colAvg1D}
              />
            )}
          </Form.Item>
        );
      }
    },
    {
      title: i18n.colUnit,
      dataIndex: "unit",
      key: "unit",
      align: "center",
      render: (text, record, index) => {
        const { getFieldValue } = this.props.form;
        const aqiQcList = getFieldValue("aqiQcList");
        const key = _.get(aqiQcList, `${record.key}.keyMeasure`);
        return _.get(this.state.dataMeasuringObj, `${key}.unit`);
      }
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record, index) => {
        return (
          <Popconfirm
            title="Are you sure delete this?"
            onConfirm={this.delete.bind(this, record.key)}
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
            placement="left"
          >
            <Icon
              type="delete"
              style={{ color: "red", fontSize: 24, cursor: "pointer" }}
            />
          </Popconfirm>
        );
      }
    }
  ];

  SelectMeasure = props => {
    return (
      <Select {...props} style={{ width: "100%" }}>
        {_.map(this.state.dataMeasuringObj, mea => {
          return (
            <Select.Option key={mea.key} value={mea.key}>
              {mea.name}
            </Select.Option>
          );
        })}
      </Select>
    );
  };

  submit = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({ isSubmit: true });
        console.log("Received values of form: ", values);
        try {
          let transformData = _.get(values, "aqiQcList", []).filter(
            i => _.identity(i.h) && _.identity(i.d) && _.identity(i.keyMeasure)
          );

          const response = await postConfigAqiQC(
            _.keyBy(transformData, "keyMeasure")
          );
          if (response.success) {
            message.success(i18n.updateSuccess);
          }
        } finally {
          this.setState({ isSubmit: false });
        }
      }
    });
  };

  add = () => {
    this.setState({
      dataSource: [
        ...this.state.dataSource,
        {
          key: idIncrement++
        }
      ]
    });
  };

  delete = key => {
    let tamp = this.state.dataSource.filter(item => item.key !== key);
    this.setState({
      dataSource: [...tamp]
    });
  };

  async componentDidMount() {
    let dataMeasuringObj = {};
    const resMeasuringList = await getMeasurings(
      { page: 1, itemPerPage: 100000 },
      {}
    );
    if (resMeasuringList.success) {
      dataMeasuringObj = _.keyBy(resMeasuringList.data, "key");
    }

    const response = await getConfigAqiQC();
    if (response.success) {
      let transformData = _.get(response, "data.value", {});
      let dataSource = _.map(transformData, item => {
        return {
          ...item,
          key: idIncrement++,
          keyMeasure: item.keyMeasure
        };
      });
      this.setState(
        {
          dataMeasuringObj,
          dataSource: dataSource,
          isLoaded: true
        },
        () => {
          this.props.form.setFieldsValue({
            aqiQcList: dataSource
          });
        }
      );
    }
  }

  render() {
    return (
      <Spin spinning={!this.state.isLoaded}>
        <Button type="primary" onClick={this.add}>
          {i18n.add}
        </Button>
        <Clearfix height={16} />
        <Table
          size="small"
          bordered
          dataSource={this.state.dataSource}
          columns={this.columns}
          pagination={false}
        />
        <Clearfix height={16} />
        <Button
          loading={this.state.isSubmit}
          block
          type="primary"
          onClick={this.submit}
        >
          {i18n.submit}
        </Button>
      </Spin>
    );
  }
}
