import { Form, Icon, Input, message, Skeleton, Table, Typography } from 'antd'
import languageApi from 'api/languageApi'
import Editable from 'components/core/editable'
import HighlightedText from 'components/core/HighlightedText'
import { FormItem } from 'components/layouts/styles'
import { flatten, unflatten } from 'flat'
import { get, isEmpty, set } from 'lodash'
import React from 'react'
import { DEVICE, i18n } from '../index'

const { Text } = Typography

const languageConfig = {
  vi: 'vi',
  en: 'en',
  tw: 'tw',
}

function getOptions(obj) {
  return Object.keys(obj).reduce((acc, cur) => {
    acc.push({
      key: cur,
      children: recurseList(obj[cur], cur),
    })
    return acc
  }, [])
}

function recurseList(obj, keyParent) {
  return Object.keys(obj).reduce((acc, cur) => {
    if (obj[cur] instanceof Object) {
      let data = {
        key: `${keyParent}.${cur}`,
        ...obj[cur],
      }
      const children = recurseList(obj[cur], data.key)
      if (children.length) {
        data.children = children
      }
      acc.push(data)
    }
    return acc
  }, [])
}

const getValueMappingLanguage = (key, value) => {
  const valueMappingLanguage = Object.values(languageConfig).reduce(
    (base, currentLanguageConfigKey) => {
      const defaultValuePathLanguage = get(value, ['vi', key])
      const valuePathLanguage = {
        [key]: get(
          value,
          [currentLanguageConfigKey, key],
          defaultValuePathLanguage
        ),
      }

      return {
        ...base,
        [currentLanguageConfigKey]: valuePathLanguage,
      }
    },

    {} // initialValue
  )

  return valueMappingLanguage
}

const TableTranslate = ({
  form,
  isExpandAllRows,
  loading,
  dataSource,
  device,
  pattern,
  ...props
}) => {
  if (loading) return <Skeleton />

  if (isEmpty(dataSource))
    return (
      <div>
        <Text disabled>{i18n().emptyView}</Text>
      </div>
    )

  const handleSave = async ({ value, path, locale, device }) => {
    const dataSourceUpdate = set(dataSource, path, value)

    const res = await languageApi.updateLanguage(
      locale,
      dataSourceUpdate[locale],
      device
    )
    if (res && res.success) {
      message.success(i18n().success)
    } else {
      message.error(i18n().error)
    }
  }

  const dataOptions = Object.entries(dataSource)
    .filter(([keyDevice]) => !device || device === keyDevice)
    .reduce(
      (base, [keyDevice, value]) => {
        // util logic help dataLanguage
        const dataLanguage = Object.keys(value.vi || {}).map(key => {
          return getValueMappingLanguage(key, value)
        })

        const dataTree = dataLanguage.reduce((base, dataLanguageItem) => {
          const key = Object.keys(flatten(dataLanguageItem.vi)).reduce(
            (base, currentKey) => {
              return {
                ...base,
                [currentKey]: {
                  keyDevice,
                  vi: get(dataLanguageItem, `vi.${currentKey}`),
                  en: get(dataLanguageItem, `en.${currentKey}`),
                  tw: get(dataLanguageItem, `tw.${currentKey}`),
                },
              }
            },
            {}
          )

          const keyUnflat = unflatten(key)

          return { ...base, ...keyUnflat }
        }, {})

        return [...base, ...getOptions(dataTree)]
      },

      [] // initialValue
    )

  const columns = [
    {
      title: i18n().colKey,
      dataIndex: 'key',
      key: 'key',
    },

    {
      title: i18n().colDevice,
      dataIndex: 'keyDevice',
      key: 'keyDevice',
      render: value => {
        const icon = {
          [DEVICE.MOBILE]: <Icon style={{ fontSize: '1rem' }} type="mobile" />,
          [DEVICE.WEB]: <Icon style={{ fontSize: '1rem' }} type="global" />,
        }
        return icon[value]
      },
    },

    ...Object.values(languageConfig).map(languageConfigItemKey => {
      return {
        dataIndex: languageConfigItemKey,
        key: languageConfigItemKey,
        title: i18n()[languageConfigItemKey],
        width: '20%',
        render: (value, record) => {
          if (value) {
            const fieldNamePath = `${languageConfigItemKey}.${record.key}`
            const optionsField = {
              initialValue: value,
              trigger: 'onBlur',
              valuePropName: 'defaultValue',
            }

            const valueSave = form.getFieldValue(fieldNamePath) || value
            return (
              <React.Fragment>
                {value && (
                  <Editable
                    text={
                      <HighlightedText text={valueSave} pattern={pattern} />
                    }
                    onOk={() =>
                      handleSave({
                        value: valueSave,
                        path: fieldNamePath,
                        locale: languageConfigItemKey,
                        device: record.keyDevice,
                      })
                    }
                    onCancel={() => {
                      form.setFieldsValue({ [fieldNamePath]: value })
                    }}
                  >
                    <FormItem>
                      {form.getFieldDecorator(
                        fieldNamePath,
                        optionsField
                      )(<Input />)}
                    </FormItem>
                  </Editable>
                )}
              </React.Fragment>
            )
          }
        },
      }
    }),
  ]

  return (
    <Table
      pagination={
        !isExpandAllRows && {
          pageSize: 20,
        }
      }
      defaultExpandAllRows={isExpandAllRows}
      columns={columns}
      dataSource={dataOptions}
    />
  )
}

export default Form.create()(TableTranslate)
