import { Button, Form, Icon } from 'antd'
import styled from 'styled-components'
import React from 'react'
import { translate as t } from 'hoc/create-lang'

export const Header = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #3b3b3b;
`

export const BoxShadow = styled.div`
  background: #ffffff;
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  padding: 12px;
`

export const FormItem = styled(Form.Item)`
  margin-bottom: 16px;
  font-size: 14;
  font-weight: 600;
  .ant-form-item-label {
    line-height: unset;
    label {
      margin: 0;
    }
  }
`

const Title = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 22px;
  color: #ffffff;
`

const FormLayout = styled.div`
  background: #ffffff;
  border-radius: 0px 0px 10px 10px;
`

const HeaderSearch = styled.div`
  height: 40px;
  background: linear-gradient(90deg, #1e8acf 0%, #55d1f2 99.02%);
  border-radius: 4px 4px 0px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
`

export const Search = ({ loading, onSearch, children }) => {
  return (
    <React.Fragment>
      <HeaderSearch>
        <Title>{t('apiSharingNew.detailPage.label.chooseCondition')}</Title>
        <Button
          size="small"
          type="primary"
          onClick={onSearch}
          loading={loading}
        >
          <Icon type="search" />
          {t('apiSharingNew.button.search')}
        </Button>
      </HeaderSearch>
      <FormLayout>{children}</FormLayout>
    </React.Fragment>
  )
}

export const Clearfix = styled.div`
  ${props => (props.height ? `height: ${props.height}px;` : '')};
  ${props => (props.width ? `width: ${props.width}px;` : '')};
`
