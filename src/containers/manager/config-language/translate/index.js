import { Spin, Table, Form, Input, Button } from 'antd'
import { EditWrapper2 } from 'containers/ticket/Component'
import { flatten, unflatten } from 'flat'
import { get, keyBy, uniqueId } from 'lodash'
import { format } from 'prettier'
import React from 'react'
import { i18n } from '../index'

const languageConfig = {
  vi: 'vi',
  en: 'en',
  tw: 'tw',
}

function getOptions(obj) {
  return Object.keys(obj).reduce((acc, cur) => {
    acc.push({
      key: cur,
      id: uniqueId(),
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
        id: uniqueId(),
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

const TableTranslate = ({
  form,
  isExpandAllRows,
  loading,
  dataSource,
  ...props
}) => {
  console.log({ form })
  if (loading) return null
  const columns = [
    // { title: i18n().colDevice, width: 100, key: 'id', dataIndex: 'id' },
    {
      title: i18n().colKey,
      dataIndex: 'key',
      key: 'key',
    },
    // { title: i18n().colFeature },

    ...Object.values(languageConfig).map(languageConfigItemKey => {
      return {
        dataIndex: languageConfigItemKey,
        key: languageConfigItemKey,
        title: i18n()[languageConfigItemKey],
        width: '20%',
        render: (value, record, index) => {
          return (
            <React.Fragment>
              {value && (
                <div>
                  {/* {form.getFieldDecorator(record.key, { initialValue: value })(
                    <Input />
                  )} */}
                  <Button type="link">Save</Button>
                </div>
              )}
            </React.Fragment>
          )
        },
      }
    }),
  ]

  // util logic help dataLanguage
  const getValueMappingLanguage = key => {
    const valueMappingLanguage = Object.values(languageConfig).reduce(
      (base, currentLanguageConfigKey) => {
        const defaultValuePathLanguage = get(dataSource, ['vi', key])
        const valuePathLanguage = {
          [key]: get(
            dataSource,
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
  const dataLanguage = Object.keys(dataSource.en).map(key => {
    return getValueMappingLanguage(key)
  })

  // console.log({ dataLanguage })
  const dataTree = dataLanguage.reduce((base, dataLanguageItem) => {
    const key = Object.keys(flatten(dataLanguageItem.vi)).reduce(
      (base, currentKey) => {
        return {
          ...base,
          [currentKey]: {
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

  const dataOptions = getOptions(dataTree)

  return (
    <Table
      defaultExpandAllRows={isExpandAllRows}
      columns={columns}
      dataSource={dataOptions}
    />
  )
}

export default Form.create()(TableTranslate)
