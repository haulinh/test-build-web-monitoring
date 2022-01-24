import { Button, Col, Modal, Row, Typography } from 'antd'
import Clearfix from 'components/elements/clearfix'
import { default as React } from 'react'
import { translate } from 'hoc/create-lang'

const { Text } = Typography

class ModalContactExtend extends React.Component {
  render() {
    const {
      isShowModalExtend,
      confirmContinue,
      handleCancel,
      phone,
      email,
    } = this.props

    return (
      <Modal
        title={translate('infoLicense.modal.title')}
        width={554}
        centered
        visible={isShowModalExtend}
        footer={[
          <Row type="flex" justify="end">
            <Button
              key="submit"
              type="primary"
              onClick={confirmContinue}
              style={{ marginLeft: 10 }}
            >
              {translate('infoLicense.modal.button')}
            </Button>
          </Row>,
        ]}
        onCancel={handleCancel}
      >
        <div>
          <Row gutter={24}>
            <Col span={24}>
              <div
                style={{
                  fontStyle: 'italic',
                  fontWeight: 'bold',
                }}
              >
                {translate('infoLicense.modal.body.notification')}
              </div>
            </Col>
          </Row>
          <Clearfix height={10} />
          <Row gutter={24}>
            <Col span={8}>
              <Text>{translate('infoLicense.modal.body.phone')}</Text>
            </Col>
            <Col span={16}>
              <Text>{phone}</Text>
            </Col>
          </Row>
          <Clearfix height={4} />
          <Row gutter={24}>
            <Col span={8}>
              <Text>{translate('infoLicense.modal.body.email')}</Text>
            </Col>
            <Col span={16}>
              <Text>{email}</Text>
            </Col>
          </Row>
        </div>
      </Modal>
    )
  }
}

export default ModalContactExtend
