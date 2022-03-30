import React from 'react'
import {Form, Icon, Input, Modal} from 'antd'
import {FlagIcon} from 'react-flag-kit'
import {FormWrapper, FormItem, FlagLabel} from './styled'
import {Warning} from './warning'
import {translate as t} from 'hoc/create-lang'
import get from 'lodash/get'
import {getLanguage} from 'utils/localStorage'

const i18n = {
  title: t('languageSetup.setup'),
  okText: t('global.save'),
  cancelText: t('global.back'),
  lang: {
    vi: t('language.list.colVI'),
    en: t('language.list.colEN'),
    tw: t('language.list.colTW'),
  }
}

const LangConfig =[ 
  {lang: 'vi', code: 'VN', label: i18n.lang.vi },
  {lang: 'en', code: 'US', label: i18n.lang.en},
  {lang: 'tw', code: 'TW', label: i18n.lang.tw } 
] 

@Form.create({})
class Language extends React.Component {
  state = {
    content: null,
    isVisible: false,
    isWarning: false,
    values: []
  }

  setInit = () => {
    const {content} = this.state
    const {form, language} = this.props

    const getContent = (lang) => 
      lang === getLanguage() && !!content && get(language, lang) !== content
        ? content
        : get(language, lang)

    form.setFieldsValue({
      vi: getContent('vi'),
      en: getContent('en'),
      tw: getContent('tw'),
    })
  }

  openLanguageModal = () => {
    this.setState({isVisible: true}, this.setInit)
  }

  closeLanguageModal = (cb) => {
    const {form} = this.props
    this.setState({isVisible: false}, () => {
      typeof cb === 'function' && cb()

      form.resetFields()
    })
  }

  onChange = (content) => this.setState({content})

  getValues = async () => {
    const {form} = this.props
    const formValues = await form.validateFields();

    const values = Object.keys(formValues)
      .map(lang => {
        const content = (formValues[lang] || '').trim()
        if (!!content) return {lang, content}
      })
      .filter(Boolean)

    return values;
  }

  handleSubmit = async () => {
    const values = await this.getValues()
    this.setState({values})

    if(values.length === 0) {
      this.closeLanguageModal()
      return
    }

    if(values.length < LangConfig.length) {
      this.setState({isWarning: true})
      return
    }

    const {form, onChange, onChangeLanguage} = this.props
    const formValues = form.getFieldsValue()

    this.closeLanguageModal(() => {
      const lang = getLanguage()
      const item = values.find(item => item.lang === lang) || values[0]
      this.onChange(item.content)
      onChange(item.content)
      onChangeLanguage(formValues)
    })
  }

  handleConfirm = () => {
    this.setState(
      {isWarning: false},
      () => {
        this.fillEmpty()
        this.handleSubmit()
      }
    );
  }

  fillEmpty = () => {
    const {form} = this.props
    const {values} = this.state

    const valueMaps = new Map(values.map(item => [item.lang, item]))
    const defaultValue = values[0]

    const results = LangConfig
      .map(item => valueMaps.get(item.lang) || {...item, content: defaultValue.content})
      .reduce((prev, item) => ({
        ...prev,
        [item.lang]: item.content
      }), {})

    form.setFieldsValue(results)
  }

  renderFormItemLabel = (item) => {
    return (
      <FlagLabel>
        <FlagIcon code={item.code} size={22} />
        <span>{item.label}</span>
      </FlagLabel>
    )
  }

  getModalOptions = () => ({
    centered: true,
    closable: false,
    okText: i18n.okText,
    cancelText: i18n.cancelText,
    title: i18n.title,
    bodyStyle: {height: 280}
  })

  render(){
    const {form, rules} = this.props
    const {isWarning, isVisible, content, values} = this.state
    const {getFieldDecorator} = form

    return (
      <React.Fragment>
        <Input 
          value={content}
          onChange={e => this.onChange(e.target.value)}
          addonAfter={<Icon type="setting" onClick={this.openLanguageModal} />}
        />

        <Modal
          {...this.getModalOptions()}
          visible={isVisible}
          onCancel={this.closeLanguageModal}
          onOk={this.handleSubmit}
        >
          <FormWrapper className="form-language">
            {LangConfig.map(item =>
              <FormItem key={item.lang} label={this.renderFormItemLabel(item)}>
                {getFieldDecorator(item.lang, {rules})(
                  <Input autoFocus={getLanguage() === item.lang} />
                )}
              </FormItem>
            )}
          </FormWrapper>
        </Modal>

        <Modal
          {...this.getModalOptions()}
          cancelText={i18n.cancelText}
          visible={isWarning}
          onCancel={() => this.setState({isWarning: false})}
          onOk={this.handleConfirm}
        >
          <Warning lang={get(values, '0.content')} />
        </Modal>
      </React.Fragment>
    )
  }
}

export default Language
