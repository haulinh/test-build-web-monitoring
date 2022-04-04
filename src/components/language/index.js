import {Form, Input, Modal} from 'antd'
import iconLanguage from 'assets/svg-icons/IconLanguage.svg'
import {translate as t} from 'hoc/create-lang'
import get from 'lodash/get'
import React from 'react'
import {FlagIcon} from 'react-flag-kit'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {getLanguage} from 'utils/localStorage'
import {LangConfig} from './helper'
import {FlagLabel, FormItem, FormWrapper} from './styled'
import {Warning} from './warning'
export * from './helper'

const i18n = {
  title: t('languageSetup.setup'),
  okText: t('global.save'),
  cancelText: t('global.back'),
}
const InputWrapper = styled(Input)`
  span.ant-input-group-addon{
    cursor: pointer;
    background: #ffffff;
    &:hover{
      background: rgb(230, 247, 255);
    }
  }
`

const IconWrapper = styled.img`
  width: 25px;
`

@Form.create({})
@connect(
  state => ({
    languageContents: get(state, 'language.languageContents')
  })
)
class Language extends React.Component {
  state = {
    content: null,
    isVisible: false,
    isWarning: false,
    values: []
  }

  componentWillReceiveProps(props){
    const {content} = this.state
    const {itemId, type, id: field, languageContents, onChange, onChangeLanguage} = this.props

    if(content === null && props.value) {
      const language = get(languageContents, `${type}.${itemId}.language.${field}`);
      let content = props.value
      if(language) content = language[getLanguage()]
      this.setState({content}, () => {
        onChange(content)
        onChangeLanguage(language)
      })
    }
  }

  getLanguages = () => {
    const {content} = this.state
    const {language} = this.props

    const getContent = (lang) =>
      lang === getLanguage() && !!content && get(language, lang) !== content
        ? content
        : get(language, lang, content)

    return {
      vi: getContent('vi'),
      en: getContent('en'),
      tw: getContent('tw'),
    }
  }

  setInitValues = () => {
    const {form} = this.props
    const initialValues = this.getLanguages()
    form.setFieldsValue(initialValues)
  }

  openLanguageModal = () => {
    this.setState({isVisible: true}, this.setInitValues)
  }

  closeLanguageModal = (cb) => {
    const {form} = this.props
    this.setState({isVisible: false}, () => {
      typeof cb === 'function' && cb()
      form.resetFields()
    })
  }

  timeOut = null
  onChange = (content) => {
    this.setState({content})
    clearTimeout(this.timeOut)
    this.timeOut = setTimeout(() => {
      const {onChange} = this.props
      onChange(content);
    }, 500)
  }

  getValues = async () => {
    const {form} = this.props
    const formValues = await form.validateFields();

    const values = Object.keys(formValues)
      .map(lang => {
        const content = (formValues[lang] || '').trim()
        if (!!content) return {lang, content}
        return null
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
      onChange(item.content, formValues)
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
    bodyStyle: {height: 300}
  })

  render(){
    const {form, rules, placeholder, itemId, size} = this.props
    const {isWarning, isVisible, content, values} = this.state
    const formValues = form.getFieldsValue()

    const disabled = !!itemId &&
      Object.values(formValues).every(item => !item)

      return (
      <React.Fragment>
        <InputWrapper
          size={size}
          value={content}
          placeholder={placeholder}
          onChange={e => this.onChange(e.target.value)}
          addonAfter={
            <IconWrapper
              alt=""
              src={iconLanguage}
              onClick={this.openLanguageModal}
            />
          }
        />

        <Modal
          {...this.getModalOptions()}
          visible={isVisible}
          onCancel={this.closeLanguageModal}
          onOk={this.handleSubmit}
          okButtonProps={{disabled}}
        >
          <FormWrapper className="form-language">
            {LangConfig.map(item =>
              <FormItem key={item.lang} label={this.renderFormItemLabel(item)}>
                {form.getFieldDecorator(item.lang, {rules})(
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
