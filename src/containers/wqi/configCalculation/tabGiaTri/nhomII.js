import React from "react";
import PropTypes from "prop-types";
// import styled from "styled-components";
import {
  message,
  Button,
  Table,
  Form,
  InputNumber,
  Input,
  Icon,
  Popconfirm,
  Spin,
  Row,
  Col,
  Select,
} from "antd";
import { Clearfix } from "containers/map/map-default/components/box-analytic-list/style";
import { getConfigWqiMeaTable, postConfigWqiMeaTable } from "api/CategoryApi";
import { translate } from "hoc/create-lang";
import * as _ from "lodash";
import LockComp from "./lockComp";

const { Option } = Select;

const i18n = {
  submit: translate("addon.save"),
  warning: translate("addon.warning"),
  refresh: translate("addon.refresh"),
  cancel: translate("addon.cancel"),
  updateSuccess: translate("addon.onSave.update.success"),
  updateError: translate("addon.onSave.update.error"),
  required: translate("wqiConfigCalculation.required"),

  add: translate("wqiConfigCalculation.add"),
  collevel: translate("wqiConfigCalculation.collevel"),
  colMin2: translate("wqiConfigCalculation.colMin2"),
  colMax2: translate("wqiConfigCalculation.colMax2"),
  colValue: translate("wqiConfigCalculation.colValue"),
  colOperate: translate("wqiConfigCalculation.colOperate"),
};

@Form.create({})
export default class TabGiaTri_NhomII extends React.Component {
  static propTypes = {
    configMeasure: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isSubmit: false,
      dataSource: [],
      isLockFirst: {},
      isLockLast: {},
    };
    const styleWidth = { width: "100%" };
    const columnDynamic = [];
    props.configMeasure.forEach((item) => {
      columnDynamic.push({
        title: i18n.colValue + ' ' + item.keyMeasure,
        dataIndex: "i_" + item.keyMeasure,
        key: "i_" + item.keyMeasure,
        align: "center",
        width: 150,
        render: (text, record, index) => {
          const { getFieldDecorator } = this.props.form;
          return (
            <Form.Item
              style={{ textAlign: "left", marginBottom: "initial" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {getFieldDecorator(
                  `levelList[${record.key}].${item.keyMeasure}.min`,
                  {
                    rules: [
                      {
                        required: true,
                        message: i18n.required,
                      },
                    ],
                  }
                )(
                  <InputNumber
                    style={{ ...styleWidth }}
                    placeholder={i18n.colMin2}
                  />
                )}
              </div>
            </Form.Item>
          );
        },
      });
    });
    this.columns = [
      {
        title: i18n.colValue + " qi",
        dataIndex: "qi",
        key: "qi",
        align: "center",
        width: 150,
        render: (text, record, index) => {
          const { getFieldDecorator } = this.props.form;
          return (
            <Form.Item style={{ textAlign: "left", marginBottom: "initial" }}>
              {getFieldDecorator(`levelList[${record.key}].qi`, {
                rules: [
                  {
                    required: true,
                    message: i18n.required,
                  },
                ],
              })(<InputNumber style={{ ...styleWidth }} />)}
            </Form.Item>
          );
        },
      },
      {
        title: i18n.colOperate,
        dataIndex: "operate",
        key: "operate",
        align: "center",
        width: 50,
        render: (text, record, index) => {
          const { getFieldDecorator } = this.props.form;
          return (
            <Form.Item style={{ textAlign: "left", marginBottom: "initial" }}>
              {getFieldDecorator(`levelList[${record.key}].operate`, {
                rules: [
                  {
                    required: true,
                    message: i18n.required,
                  },
                ],
              })(
                <Select style={{ width: "100%" }}>
                  <Option value="lte">≤</Option>
                  <Option value="le">{"<"}</Option>
                  <Option value="gte">≥</Option>
                  <Option value="gt">{">"}</Option>
                </Select>
              )}
            </Form.Item>
          );
        },
      },
      ...columnDynamic,
      {
        title: "",
        dataIndex: "action",
        key: "action",
        width: 80,
        align: "center",
        render: (text, record, index) => {
          return (
            <Popconfirm
              title="Are you sure delete this?"
              onConfirm={this.delete.bind(this, record.key)}
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
        },
      },
    ];
    this.idIncrement = 0;
  }

  async componentDidMount() {
    const response = await getConfigWqiMeaTable();
    if (response.success) {
      const transformData = _.get(response, "data.value.groupII", []).filter(
        (i) => _.identity(i)
      );
      const lastRecord = transformData[transformData.length - 1];
      transformData.map((i) => (i.key = this.idIncrement++));

      const isLockFirst = this.state.isLockFirst;
      const firstItem = transformData[0] || {};
      for (let key in firstItem) {
        if (_.get(firstItem, `${key}.min`) === null) isLockFirst[key] = true;
      }

      const isLockLast = this.state.isLockLast;
      const lastItem = transformData[lastRecord] || {};
      for (let key in lastItem) {
        if (_.get(lastItem, `${key}.max`) === null) isLockLast[key] = true;
      }
      this.setState(
        {
          isLoaded: true,
          dataSource: transformData,
          isLockFirst,
          isLockLast,
        },
        () => {
          this.props.form.setFieldsValue({
            levelList: transformData,
          });
        }
      );
    }
  }
  add = () => {
    this.setState({
      dataSource: [
        ...this.state.dataSource,
        {
          key: this.idIncrement++,
        },
      ],
    });
  };
  delete = (key) => {
    let tamp = this.state.dataSource.filter((item) => item.key !== key);
    this.setState({
      dataSource: [...tamp],
    });
  };
  submit = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({ isSubmit: true });
        console.log("Received values of form: ", values);
        try {
          const transformData = _.get(values, "levelList", []).filter((i) =>
            _.identity(i)
          );
          const response = await postConfigWqiMeaTable({
            groupII: transformData,
          });
          if (response.success) {
            message.success(i18n.updateSuccess);
          }
        } finally {
          this.setState({ isSubmit: false });
        }
      }
    });
  };
  render() {
    return (
      <Spin spinning={!this.state.isLoaded}>
        <Table
          size="small"
          bordered
          columns={this.columns}
          dataSource={this.state.dataSource}
          pagination={false}
          scroll={{ x: 900 }}
        />
        <Clearfix height={16} />
        <Row gutter={12}>
          <Col xs={12}>
            <Button block type="primary" onClick={this.add}>
              {i18n.add}
            </Button>
          </Col>
          <Col xs={12}>
            <Button
              loading={this.state.isSubmit}
              block
              type="primary"
              onClick={this.submit}
            >
              {i18n.submit}
            </Button>
          </Col>
        </Row>
      </Spin>
    );
  }
}
