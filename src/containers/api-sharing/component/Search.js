import { Button } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { i18n } from '../constants'

const Header = styled.div`
  height: 40px;
  background: linear-gradient(90deg, #1e8acf 0%, #55d1f2 99.02%);
  border-radius: 4px 4px 0px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
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

export default function Search({ loading, onSearch, children }) {
  return (
    <React.Fragment>
      <Header>
        <Title>{i18n.detailPage.label.chooseCondition}</Title>
        <Button
          size="small"
          type="primary"
          onClick={onSearch}
          loading={loading}
        >
          {i18n.button.search}
        </Button>
      </Header>
      <FormLayout>{children}</FormLayout>
    </React.Fragment>
  )
}
