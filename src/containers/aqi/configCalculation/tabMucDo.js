import React from "react";
// import PropTypes from "prop-types";
// import styled from "styled-components";
import {
  message,
  // Tabs,
  Button,
  Table,
  Form,
  Input,
  InputNumber,
  Icon,
  Popconfirm,
  Spin
} from "antd";
import { Clearfix } from "containers/map/map-default/components/box-analytic-list/style";
import {
  getConfigAqiCalculation,
  postConfigAqiCalculation
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
  colDescription: translate("aqiConfigCalculation.colDescription")
};

let idIncrement = 0;

@Form.create({})
export default class TabMucDo extends React.Component {
  state = {
    isLoaded: false,
    isSubmit: false,
    dataSource: []
  };

  columns = [
    {
      title: i18n.colLevel,
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (text, record, index) => {
        const { getFieldDecorator } = this.props.form;
        return (
          <Form.Item style={{ textAlign: "left", marginBottom: "initial" }}>
            {getFieldDecorator(`levelList[${record.key}].name`, {
              rules: [
                {
                  required: true,
                  message: i18n.required
                }
              ]
            })(<Input placeholder="Mức độ" />)}
          </Form.Item>
        );
      }
    },
    {
      title: i18n.colMin,
      dataIndex: "min",
      key: "min",
      align: "center",
      render: (text, record, index) => {
        const { getFieldDecorator } = this.props.form;
        return (
          <Form.Item style={{ textAlign: "left", marginBottom: "initial" }}>
            {getFieldDecorator(`levelList[${record.key}].min`, {
              rules: [
                {
                  required: true,
                  message: i18n.required
                }
              ]
            })(
              <InputNumber
                style={{ width: "100%" }}
                placeholder={i18n.colMin}
              />
            )}
          </Form.Item>
        );
      }
    },
    {
      title: i18n.colMax,
      dataIndex: "max",
      key: "max",
      align: "center",
      render: (text, record, index) => {
        const { getFieldDecorator } = this.props.form;
        return (
          <Form.Item style={{ textAlign: "left", marginBottom: "initial" }}>
            {getFieldDecorator(`levelList[${record.key}].max`, {
              rules: [
                {
                  required: true,
                  message: i18n.required
                }
              ]
            })(
              <InputNumber
                style={{ width: "100%" }}
                placeholder={i18n.colMax}
              />
            )}
          </Form.Item>
        );
      }
    },
    {
      title: i18n.colColor,
      dataIndex: "address",
      key: "color",
      align: "center",
      render: (text, record, index) => {
        const { getFieldDecorator } = this.props.form;
        return (
          <Form.Item style={{ marginBottom: "initial" }}>
            {getFieldDecorator(`levelList[${record.key}].color`, {
              initialValue: "#1d89ce",
              rules: [
                {
                  required: true,
                  message: i18n.required
                }
              ]
            })(<input type="color" />)}
          </Form.Item>
        );
      }
    },
    {
      title: i18n.colDescription,
      dataIndex: "description",
      key: "description",
      align: "center",
      render: (text, record, index) => {
        const { getFieldDecorator } = this.props.form;
        return (
          <Form.Item style={{ textAlign: "left", marginBottom: "initial" }}>
            {getFieldDecorator(`levelList[${record.key}].description`, {
              rules: [
                {
                  required: true,
                  message: i18n.required
                }
              ]
            })(<Input placeholder={i18n.colDescription} />)}
          </Form.Item>
        );
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

  submit = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({ isSubmit: true });
        console.log("Received values of form: ", values);
        try {
          const transformData = _.get(values, "levelList", []).filter(i =>
            _.identity(i)
          );
          const response = await postConfigAqiCalculation(transformData);
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
    const response = await getConfigAqiCalculation();
    if (response.success) {
      const transformData = _.get(response, "data.value", []).filter(i =>
        _.identity(i)
      );
      transformData.map(i => (i.key = idIncrement++));
      this.setState(
        {
          dataSource: transformData,
          isLoaded: true
        },
        () => {
          this.props.form.setFieldsValue({
            levelList: transformData
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
