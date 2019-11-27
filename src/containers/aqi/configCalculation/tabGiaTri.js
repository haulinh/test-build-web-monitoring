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
  Input,
  Icon,
  Popconfirm,
  Spin,
  Select,
  Skeleton
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
  required1D_1H: translate("aqiConfigCalculation.required1D_1H"),
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

@Form.create({})
export default class TabMucDo extends React.Component {
  idIncrement = 0;
  state = {
    isLoaded: false,
    isSubmit: false,
    dataSource: [],
    dataMeasuringObj: {},
    dataMeasures: null
  };

  createColumn = (keyMeasure, type) => {
    return {
      key: `${keyMeasure}_${type}`,
      title: `Giá trị ${keyMeasure} ${type}`,
      align: "center",
      children: [
        {
          title: "Tối thiểu",
          align: "center",
          key: `${keyMeasure}_${type}_min`,
          render: (text, record, index) => {
            const { getFieldDecorator, getFieldValue } = this.props.form;
            const path = `[${record.key}].${type}.${keyMeasure}`;
            const fliedName = `aqiQCLevel${path}.min`;
            // console.log(record, path, keyMeasure, "toios theieu");
            // console.log(getFieldValue(`aqiQCLevel${path}.min`));
            return (
              <Form.Item style={{ textAlign: "left", marginBottom: "initial" }}>
                {getFieldDecorator(fliedName, {
                  onChange: val => {
                    const { setFieldsValue, getFieldValue } = this.props.form;
                    setFieldsValue({
                      [fliedName]: getFieldValue(fliedName)
                    });
                  },
                  rules: [
                    {
                      required: !getFieldValue(fliedName),
                      message: i18n.required
                    }
                  ]
                })(
                  <InputNumber
                    style={{ width: "100%" }}
                    
                  />
                )}
              </Form.Item>
            );
          }
        },
        {
          title: "Tối đa",
          align: "center",
          key: `${keyMeasure}_${type}_max`,
          render: (text, record, index) => {
            const { getFieldDecorator, getFieldValue } = this.props.form;
            // const path = `[${record.key}].${type}.${keyMeasure}`;
            const path = `[${record.key}].${type}.${keyMeasure}`;
            const fliedName = `aqiQCLevel${path}.max`;

            return (
              <Form.Item style={{ textAlign: "left", marginBottom: "initial" }}>
                {getFieldDecorator(fliedName, {
                  onChange: val => {
                    const { setFieldsValue, getFieldValue } = this.props.form;
                    setFieldsValue({
                      [fliedName]: getFieldValue(fliedName)
                    });
                  },
                  rules: [
                    {
                      required: !getFieldValue(fliedName),
                      message: i18n.required
                    }
                  ]
                })(
                  <InputNumber
                    style={{ width: "100%" }}
                    
                  />
                )}
              </Form.Item>
            );
          }
        }
      ]
    };
  };
  getColumns = () => {
    const { dataMeasures } = this.state;
    // console.log("---------");
    // console.log(dataMeasures);
    let dynamicColumns = [];
    _.forEach(dataMeasures, (item, index) => {
      let column1h = {};
      let column8h = {};
      let column24h = {};
      const type = {
        "1h": "1h",
        "8h": "8h",
        "24h": "24h"
      };
      if (_.get(item, type["1h"], false)) {
        // console.log(item,"----")
        column1h = this.createColumn(item.keyMeasure, type["1h"]);
        dynamicColumns.push(column1h);
      }
      if (_.get(item, type["8h"], false)) {
        column8h = this.createColumn(item.keyMeasure, type["8h"]);
        dynamicColumns.push(column8h);
      }
      if (_.get(item, type["24h"], false)) {
        column24h = this.createColumn(item.keyMeasure, type["24h"]);
        dynamicColumns.push(column24h);
      }
    });

    return [
      {
        title: "Cấp độ",
        dataIndex: "name",
        key: "name",
        width: 100,
        align: "center",
        fixed: "left",
        render: (text, record, index) => {
          const { getFieldDecorator, getFieldValue } = this.props.form;

          return (
            <Form.Item style={{ textAlign: "left", marginBottom: "initial" }}>
              {getFieldDecorator(`aqiQCLevel[${record.key}].name`, {
                onChange: val => {
                  const { setFieldsValue, getFieldValue } = this.props.form;
                  setFieldsValue({
                    [`aqiQCLevel[${record.key}].name`]: getFieldValue(
                      `aqiQCLevel[${record.key}].name`
                    )
                  });
                },
                rules: [
                  {
                    required: !getFieldValue(`aqiQCLevel[${record.key}].name`),
                    message: i18n.required1D_1H
                  }
                ]
              })(
                <Input style={{ width: "100%" }}  />
              )}
            </Form.Item>
          );
        }
      },
      {
        title: "Giá trị i",
        align: "center",
        children: [
          {
            title: "Tối thiểu",
            dataIndex: "min",
            key: "min",
            align: "center",
            render: (text, record, index) => {
              const { getFieldDecorator, getFieldValue } = this.props.form;
              return (
                <Form.Item
                  style={{ textAlign: "left", marginBottom: "initial" }}
                >
                  {getFieldDecorator(`aqiQCLevel[${record.key}].min`, {
                    onChange: val => {
                      const { setFieldsValue, getFieldValue } = this.props.form;
                      setFieldsValue({
                        [`aqiQCLevel[${record.key}].min`]: getFieldValue(
                          `aqiQCLevel[${record.key}].min`
                        )
                      });
                    },
                    rules: [
                      {
                        required: !getFieldValue(
                          `aqiQCLevel[${record.key}].min`
                        ),
                        message: i18n.required
                      }
                    ]
                  })(
                    <InputNumber style={{ width: "100%" }}/>
                  )}
                </Form.Item>
              );
            }
          },
          {
            title: "Tối đa",
            dataIndex: "max",
            key: "max",
            align: "center",
            render: (text, record, index) => {
              const { getFieldDecorator, getFieldValue } = this.props.form;
              return (
                <Form.Item
                  style={{ textAlign: "left", marginBottom: "initial" }}
                >
                  {getFieldDecorator(`aqiQCLevel[${record.key}].max`, {
                    onChange: val => {
                      const { setFieldsValue, getFieldValue } = this.props.form;
                      setFieldsValue({
                        [`aqiQCLevel[${record.key}].max`]: getFieldValue(
                          `aqiQCLevel[${record.key}].max`
                        )
                      });
                    },
                    rules: [
                      {
                        required: !getFieldValue(
                          `aqiQCLevel[${record.key}].max`
                        ),
                        message: i18n.required
                      }
                    ]
                  })(
                    <InputNumber
                      style={{ width: "100%" }}
                    />
                  )}
                </Form.Item>
              );
            }
          }
        ]
      },
      ...dynamicColumns,
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
  };

  submit = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({ isSubmit: true });
        console.log("Received values of form: ", values);
        try {
          const transformData = {
            aqiQCMeasures: this.state.dataMeasures,
            aqiQCLevel: _.get(values, "aqiQCLevel", [])
          };
          // console.log(transformData, "------");
          const response = await postConfigAqiQC(transformData);
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
    const index = this.idIncrement++;
    this.setState({
      dataSource: [
        ...this.state.dataSource,
        {
          key: index
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
      let transformData = _.get(response, "data.value.aqiQCLevel", []);
      let DataMeasure = _.get(response, "data.value.aqiQCMeasures", {});
      DataMeasure = _.values(DataMeasure);

      let dataSource = _.map(transformData, item => {
        return {
          ...item,
          key: this.idIncrement++
        };
      });
      this.setState(
        {
          dataMeasuringObj,
          dataMeasures: DataMeasure,
          dataSource: dataSource,
          isLoaded: true
        },
        () => {
          // console.log(dataSource, "dataSource");
          this.props.form.setFieldsValue({
            aqiQCLevel: dataSource
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
          columns={this.getColumns()}
          dataSource={this.state.dataSource}
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
