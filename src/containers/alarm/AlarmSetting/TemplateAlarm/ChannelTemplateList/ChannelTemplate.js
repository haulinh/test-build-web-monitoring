import { Icon, Input, Tooltip } from 'antd'
import { Clearfix } from 'components/elements'
import Text from 'components/elements/text'
import { Flex } from 'components/layouts/styles'
import { keyBy } from 'lodash'
import styled from 'styled-components'

import React, { Component } from 'react'
import { channelOptions } from '../../constants'

const Container = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 16px;
  color: #111827;
`
const { TextArea } = Input

export default class ChannelTemplate extends Component {
  render() {
    const { form, channelKey } = this.props

    const channelsObj = keyBy(channelOptions, 'value')
    const isMerge = channelKey === 'merge'

    form.getFieldDecorator(`${channelKey}.active`)
    form.getFieldDecorator(`${channelKey}.type`)

    return (
      <Container>
        <Text fontSize={18} fontWeight={700}>
          {isMerge ? 'Merge Template' : channelsObj[channelKey].label}
        </Text>
        <Clearfix height={13} />

        <Flex alignItems="center" gap={5}>
          Template
          <Tooltip placement="top" title={'Tooltip custom'}>
            <Icon type="info-circle" style={{ color: '#A2A7B3' }} />
          </Tooltip>
          <Text fontWeight={500} style={{ color: '#A2A7B3' }}>
            :
          </Text>
        </Flex>
        <Clearfix height={5} />

        {form.getFieldDecorator(`${channelKey}.template`)(
          <TextArea
            autoSize={{ minRows: 3, maxRows: 3 }}
            style={{ resize: 'none' }}
          />
        )}
      </Container>
    )
  }
}
