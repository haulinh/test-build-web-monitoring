import { Modal, Radio } from 'antd';
import React from 'react';
import { translate as t } from 'hoc/create-lang'

function i18n() {
  return{
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
        title={i18n().title}
        visible={showModal}
        onOk={handleOkModal}
        onCancel={handleCancelModal}
        okText={i18n().button.ok}
        cancelText={i18n().button.cancel}
      >
        <p>{i18n().content}</p>
        {radioOption.map(item => (
          <Radio.Group onChange={onChangeModal} value={langExport} >
            <Radio value={item.value}>{item.label}</Radio>
          </Radio.Group>
        ))}
      </Modal>
    )
  }
}