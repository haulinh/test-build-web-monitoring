import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 32px;
  background-color: #f1f1f1;
  border-radius: 4px;
`

export const Desc = styled.div`
  color: gray;
  font-size: 15px;
  margin-bottom: 32px;
`

export const Heading = styled.h3`
  color: #5c89ff;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 24px;
`

export const Title = styled.h2`
  color: #000;
`

export const Wrapper = styled.div`
  > div + div {
    margin-top: 8px;
  }
`

export const Flex = styled.div`
  display: flex;
  flex-direction: row;
`

export const Label = styled.label`
  font-size: 17px;
  color: #000;
  font-weight: 500;
  flex: 2;
  margin: 0;
`

export const Content = styled.span`
  font-size: 16px;
  color: #005eff;
  font-weight: 300;
  flex: 3;
  margin: 0;
`
