import React from "react";
// import styled from "styled-components";
import { Row, Col, Button, Form, DatePicker } from "antd";
import SelectAnt from "components/elements/select-ant";
import Clearfix from "components/elements/clearfix";
import PropTypes from "prop-types";
// import createLanguage, { langPropTypes } from "hoc/create-lang";
import { translate } from "hoc/create-lang";
import UserApi from "api/UserApi";
import * as _ from "lodash";
import moment from "moment-timezone";

// import ReactTelephoneInput from 'react-telephone-input/lib/withStyles'

const i18n = {
  labelUser: translate("dataLogger.searchForm.user"),
  labelTypeLog: translate("dataLogger.searchForm.typeLog"),
  labelFrom: translate("dataLogger.searchForm.from"),
  labelTo: translate("dataLogger.searchForm.to"),
  download: translate("dataLogger.searchForm.download")
};

class DataLoggerSearchForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func
  };

  state = {
    isLoading: false,
    dataUsers: []
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    const [resUser] = await Promise.all([UserApi.searchUser()]);
    if (resUser.success) {
      const dataSource = _.get(resUser, "data", []);
      this.setState({
        dataUsers: _.map(dataSource, item => {
          return {
            name: item.email,
            value: item.email
          };
        })
      });
    }
    // console.log("-----", this.state.dataUsers);
  }

  onSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // console.log("validateFields", err, values);
      if (err) return;
      const dataSearch = {
        ...values,
        from: values.from
          ? moment(values.from)
              .utc().startOf('days')
              .format()
          : undefined,
        to: values.to
          ? moment(values.to)
              .utc().startOf('days')
              .format()
          : undefined
      };

      // console.log(dataSearch, "dataSearch");
      if (this.props.onSubmit) this.props.onSubmit(dataSearch);
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form
        style={{ marginTop: "8px" }}
        className="fadeIn animated"
        onSubmit={this.onSubmit}
      >
        <Clearfix heigth={8} />
        <Row gutter={8}>
          <Col span={6}>
            {getFieldDecorator(`user`)(
              <SelectAnt
                isAll
                showSearch
                placeholder={i18n.labelUser}
                options={this.state.dataUsers}
              />
            )}
          </Col>
          {/* <Col span={6}>
            {getFieldDecorator(`typeLog`)(
              <Input placeholder={i18n.labelTypeLog} />
            )}
          </Col> */}
          <Col span={4}>
            {getFieldDecorator(`from`)(
              <DatePicker
                style={{ width: "100%" }}
                placeholder={i18n.labelFrom}
              />
            )}
          </Col>
          <Col span={4}>
            {getFieldDecorator(`to`)(
              <DatePicker
                style={{ width: "100%" }}
                placeholder={i18n.labelTo}
              />
            )}
          </Col>
          <Col span={4}>
            <Button
              shape="circle"
              icon="search"
              htmlType="submit"
              style={{ marginRight: "8px" }}
            />
            <Button type="primary" icon="download">
              {i18n.download}
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
export default Form.create({})(DataLoggerSearchForm);
