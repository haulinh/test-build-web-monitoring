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
  Spin,
  Row,
  Col
} from "antd";
import { Clearfix } from "containers/map/map-default/components/box-analytic-list/style";
import {
  getConfigWqiWeight,
  postConfigWqiWeight
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

  add: translate("wqiConfigCalculation.add"),
  required: translate("wqiConfigCalculation.required"),
  colLevel: translate("wqiConfigCalculation.colLevel"),
  colMin: translate("wqiConfigCalculation.colMin"),
  colMax: translate("wqiConfigCalculation.colMax"),
  colColor: translate("wqiConfigCalculation.colColor"),
  colBackgroundColor: translate("wqiConfigCalculation.colBackgroundColor"),
  colDescription: translate("wqiConfigCalculation.colDescription"),

  colGroupParam: translate("wqiConfigCalculation.colGroupParam"),
  valWeightParam: translate("wqiConfigCalculation.valWeightParam"),

  colGroupI: translate("wqiConfigCalculation.colGroupI"),
  colGroupII: translate("wqiConfigCalculation.colGroupII"),
  colGroupIII: translate("wqiConfigCalculation.colGroupIII"),
  colGroupIV: translate("wqiConfigCalculation.colGroupIV"),
  colGroupV: translate("wqiConfigCalculation.colGroupV"),
};

@Form.create({})
export default class TabTrongSo extends React.Component {
  idIncrement = 0;
  state = {
    isLoaded: false,
    isSubmit: false,
    dataSource: [{}],
    isLocked: false
  };

  columns = [
    {
      title: i18n.colGroupParam,
      dataIndex: "name",
      key: "name",
      align: "center",
      render: () => i18n.valWeightParam
    },
    {
      title: i18n.colGroupI,
      dataIndex: "groupI",
      key: "groupI",
      align: "center",
      render: (text, record, index) => {
        const { getFieldDecorator } = this.props.form;
        return (
          <Form.Item style={{ textAlign: "left", marginBottom: "initial" }}>
            {getFieldDecorator(`groupI`, {
              rules: [
                {
                  required: true,
                  message: i18n.required
                }
              ]
            })(
              <InputNumber
              min={0}
                style={{ width: "100%" }}
                placeholder={i18n.groupI}
              />
            )}
          </Form.Item>
        );
      }
    },
    {
      title: i18n.colGroupII,
      dataIndex: "groupII",
      key: "groupII",
      align: "center",
      render: (text, record, index) => {
        const { getFieldDecorator } = this.props.form;
        return (
          <Form.Item style={{ textAlign: "left", marginBottom: "initial" }}>
              {getFieldDecorator(`groupII`, {
                rules: [
                  {
                    required: true,
                    message: i18n.required
                  }
                ]
              })(
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder={i18n.groupII}
                />
              )}
          </Form.Item>
        );
      }
    },
    {
      title: i18n.colGroupIII,
      dataIndex: "groupIII",
      key: "groupIII",
      align: "center",
      render: (text, record, index) => {
        const { getFieldDecorator } = this.props.form;
        return (
          <Form.Item style={{ textAlign: "left", marginBottom: "initial" }}>
              {getFieldDecorator(`groupIII`, {
                rules: [
                  {
                    required: true,
                    message: i18n.required
                  }
                ]
              })(
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder={i18n.groupIII}
                />
              )}
          </Form.Item>
        );
      }
    },
    {
      title: i18n.colGroupIV,
      dataIndex: "groupIV",
      key: "groupIV",
      align: "center",
      render: (text, record, index) => {
        const { getFieldDecorator } = this.props.form;
        return (
          <Form.Item style={{ textAlign: "left", marginBottom: "initial" }}>
              {getFieldDecorator(`groupIV`, {
                rules: [
                  {
                    required: true,
                    message: i18n.required
                  }
                ]
              })(
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder={i18n.groupIV}
                />
              )}
          </Form.Item>
        );
      }
    },
    {
      title: i18n.colGroupV,
      dataIndex: "groupV",
      key: "groupV",
      align: "center",
      render: (text, record, index) => {
        const { getFieldDecorator } = this.props.form;
        return (
          <Form.Item style={{ textAlign: "left", marginBottom: "initial" }}>
              {getFieldDecorator(`groupV`, {
                rules: [
                  {
                    required: true,
                    message: i18n.required
                  }
                ]
              })(
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder={i18n.groupV}
                />
              )}
          </Form.Item>
        );
      }
    },
  ];

  submit = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({ isSubmit: true });
        try {
          const response = await postConfigWqiWeight(values);
          if (response.success) {
            message.success(i18n.updateSuccess);
          }
        } finally {
          this.setState({ isSubmit: false });
        }
      }
    });
  };

  async componentDidMount() {
    const response = await getConfigWqiWeight();
    if (response.success) {
      const transformData = _.get(response, "data.value", {})

      this.setState(
        {
          isLoaded: true,
        },
        () => {
          this.props.form.setFieldsValue(transformData);
        }
      );
    }
  }

  render() {
    return (
      <Spin spinning={!this.state.isLoaded}>
        <Clearfix height={16} />
        <Table
          size="small"
          bordered
          dataSource={this.state.dataSource}
          columns={this.columns}
          pagination={false}
        />
        <Clearfix height={16} />
        <Row gutter={12}>
          <Col xs={24}>
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
