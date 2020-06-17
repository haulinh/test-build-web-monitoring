import React from 'react'
import styled from 'styled-components'
// import PropTypes from 'prop-types'

import { Result, Button } from 'antd'
import { translate } from 'hoc/create-lang'
import slug from 'constants/slug'

const WrapperView = styled.div`
  flex:1
`

const i18n = {
  title: translate('pageInfo.body3'),
  next: translate('actions.next'),
}
export default function AqiListStatus(props) {
  return (
    <WrapperView>
      <Result
        icon={<img alt="" src={'/images/list.svg'} width="auto" />}
        title={i18n.title}
        extra={
          <Button
            onClick={() => {
              window.location = slug.aqi.config
            }}
            type="primary"
          >
            {i18n.next}
          </Button>
        }
      />
    </WrapperView>
  )
}

AqiListStatus.propTypes = {}
