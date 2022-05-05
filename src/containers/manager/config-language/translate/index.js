import { Form, Icon, Input, message, Skeleton, Table, Typography } from 'antd'
import languageApi from 'api/languageApi'
import Editable from 'components/core/editable'
import HighlightedText from 'components/core/HighlightedText'
import { FormItem } from 'components/layouts/styles'
import { flatten } from 'flat'
import { get, isEmpty, set } from 'lodash'
import React from 'react'
import { DEVICE, i18n } from '../index'

const { Text } = Typography

const languageConfig = {
  vi: 'vi',
  en: 'en',
  tw: 'tw',
}

const TableTranslate = ({
  form,
  isExpandAllRows,
  loading,
  dataSource,
  dataSourceOriginal,
  device,
  pattern,
  setData,
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
    set(dataSourceOriginal, `${device}.${locale}.${path}`, value)
    set(dataSource, `${device}.${locale}.${path}`, value)

    setData(dataSourceOriginal, dataSource)

    const res = await languageApi.updateLanguage(
      locale,
      get(dataSourceOriginal, [device, locale]),
      device
    )

    if (res && res.success) {
      message.success(i18n().success)
      return
    }

    message.error(i18n().error)
  }

  const dataOptions = Object.entries(dataSource)
    .filter(([keyDevice]) => !device || device === keyDevice)
    .reduce(
      (base, [keyDevice, value]) => {
        // util logic help dataLanguage

        const dataLanguage = Object.keys(value.vi || {}).map(key => {
          const valueFlat = flatten(value.vi[key])
          return {
            key: key,
            children: Object.keys(valueFlat).map(keyLang => {
              return {
                key: `${key}.${keyLang}`,
                keyDevice,
                vi: get(value, `vi.${key}.${keyLang}`, '-'),
                tw: get(value, `tw.${key}.${keyLang}`, '-'),
                en: get(value, `en.${key}.${keyLang}`, '-'),
              }
            }),
          }
        })

        return [...base, ...dataLanguage]
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
                <Editable
                  text={<HighlightedText text={valueSave} pattern={pattern} />}
                  onOk={() =>
                    handleSave({
                      value: valueSave,
                      path: record.key,
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
