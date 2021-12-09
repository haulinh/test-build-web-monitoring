import { Button, Modal, Radio, Row } from 'antd';
import React from 'react';
import { translate as t } from 'hoc/create-lang'

function i18n() {
  return {
    title: t('modalExportLang.title'),
    content: t('modalExportLang.content'),
    language: {
      en: t('modalExportLang.language.en'),
      vi: t('modalExportLang.language.vi'),
      tw: t('modalExportLang.language.tw'),
    },
    button: {
      ok: t('modalExportLang.button.ok'),
      cancel: t('modalExportLang.button.cancel')
    }
  }
}

const radioOption = [
  { value: 'vi', label: i18n().language.vi },
  { value: 'en', label: i18n().language.en },
  { value: 'tw', label: i18n().language.tw },
]


export default class ModalLangExport extends React.Component {
  render() {
    const { showModal, handleOkModal, handleCancelModal, onChangeModal, langExport } = this.props
    return (
      <Modal
        width="360px"
        closable={false}
        footer={false}
        visible={showModal}
        onOk={handleOkModal}
        onCancel={handleCancelModal}
        okText={i18n().button.ok}
        cancelText={i18n().button.cancel}
        centered
      >
        <h4>{i18n().title}</h4>
        <p>{i18n().content}</p>
        {radioOption.map(item => (
          <Radio.Group onChange={onChangeModal} value={langExport} >
            <Radio value={item.value}>{item.label}</Radio>
          </Radio.Group>
        ))}

        <Row type="flex" justify="end" style={{ gap: 13, marginTop: 20 }}>
          <Button type="primary">{i18n().button.ok}</Button>
          <Button>{i18n().button.cancel}</Button>
        </Row>
      </Modal >
    )
  }
}