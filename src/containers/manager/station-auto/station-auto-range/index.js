import React from 'react'
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Spin
} from 'antd'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { mapPropsToFields } from 'utils/form'
import createLanguageHoc, { langPropTypes } from '../../../../hoc/create-lang'
import InputNumberCell from 'components/elements/input-number-cell'
import Breadcrumb from '../breadcrumb'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'

const FormItem = Form.Item

@Form.create({
  mapPropsToFields: ({ initialValues }) => {
    if (!initialValues) return
    return mapPropsToFields({ initialValues })
  }
})
@createLanguageHoc
@autobind
export default class StationAutoForm extends React.PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
    isEdit: PropTypes.bool,
    initialValues: PropTypes.object,
    lang: langPropTypes
  }
  // async componentWillMount() {
  //   await this.props.getItem()
  // }
  handleSubmit(e) {
    console.log(this.props.data.name);
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) return
      const data = {
        key: values.key,
        name: values.name,
        min:values.min,
        max:values.max
      }
      // Callback submit form Container Component
      console.log(JSON.stringify(data))

     // this.props.onSubmit(data)
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { t } = this.props.lang
    const formItemLayout = {
      labelCol: {
        sm: { span: 6, offset: 0 }
      },
      wrapperCol: {
        sm: { span: 17, offset: 0 }
      }
    }

    return (
  <PageContainer {...this.props.wrapperProps}>
        <Breadcrumb
          items={[
            'list',
            {
              id: 'edit',
              name: 'Station Range'
                // this.props.isLoaded && this.props.data
                //   ? this.props.data.name
                //   : null
            }
          ]}
        />
      <Form onSubmit={this.handleSubmit}>
        <Row gutter={8}>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label={t('stationAutoManager.form.key.label')}
            >
              {getFieldDecorator('key', {
                rules: [
                  {
                    required: true,
                    message: t('stationAutoManager.form.key.error')
                  }
                ]
              })(
                <Input
                  disabled={this.props.isEdit}
                  placeholder={t('stationAutoManager.form.key.placeholder')}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label={t('stationAutoManager.form.name.label')}
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: t('stationAutoManager.form.name.error')
                  }
                ]
              })(
                <Input
                  placeholder={t('stationAutoManager.form.name.placeholder')}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label={t('stationAutoManager.range.min')}
            >
              {getFieldDecorator('min', {
                rules: [{ required: true }]
              })(
                <InputNumberCell
                  editable={true}
                  size="small"
                  min={1}
                  max={1000000}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label={t('stationAutoManager.range.max')}
            >
              {getFieldDecorator('max', {
                rules: [{ required: true }]
              })(
                <InputNumberCell
                  editable={true}
                  size="small"
                  min={1}
                  max={1000000}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={24} />
        </Row>
        <FormItem>
          <Button style={{ width: '100%' }} type="primary" htmlType="submit">
            {t('addon.save')}
          </Button>
        </FormItem>
      </Form>
  </PageContainer>
    )
  }
}
