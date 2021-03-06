import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import BreadcrumbBar from 'shared/breadcrumb/BreadcrumbBar'
import { SHAPE } from 'themes/color'
import { StickyContainer, Sticky } from 'react-sticky'
// import Clearfix from 'components/elements/clearfix'
import LoaderCircle from 'components/elements/loader-circle'
import { connect } from 'react-redux'

const HeaderFlex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 4px 0px;
`

export const Grid = styled.div`
  background-color: ${props => (props.hideBackground ? undefined : 'white')};
  overflow-x: hidden;
  overflow-y: hidden;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  padding: 0px 24px;
  .ant-table {
    overflow: auto;
  }
  .ant-table-body {
    margin: 0 !important;
    overflow: auto;
  }
`

export const GridSticky = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  padding: 8px 24px;
`

const BreadcrumbContainer = styled.div`
  // padding: 8px 0px;
  background-color: ${SHAPE.GRAYLIGHT};
  /* height: 68.8px; */
`

const PageBodyWrapper = styled.div`
  flex: 1 1 auto;
  position: relative;
  z-index: 1;
`

const AbsoluteLoading = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`
@connect(state => ({
  navigationIsOpen: state.theme.navigation.isOpen,
}))
export default class PageContainer extends React.PureComponent {
  static propTypes = {
    navigationIsOpen: PropTypes.bool,
    title: PropTypes.string,
    backgroundColor: PropTypes.string,
    hideTitle: PropTypes.bool,
    isLoading: PropTypes.bool,
    headerCustom: PropTypes.any,
    componentLoading: PropTypes.any,
    right: PropTypes.any,
  }

  renderHeader() {
    return (
      <Sticky key={this.props.navigationIsOpen}>
        {props => (
          <div
            style={{
              ...props.style,
              top: 0,
              zIndex: 100,
              borderBottom: '1px solid #eeeeee',
            }}
          >
            <BreadcrumbContainer style={this.props.style}>
              <GridSticky>
                {this.props.headerCustom ? (
                  this.props.headerCustom
                ) : (
                  <HeaderFlex>
                    <BreadcrumbBar />
                    {this.props.center}
                    {this.props.right}
                  </HeaderFlex>
                )}
              </GridSticky>
            </BreadcrumbContainer>
          </div>
        )}
      </Sticky>
    )
  }

  render() {
    return (
      <StickyContainer>
        <PageBodyWrapper
          color={this.props.backgroundColor}
          style={{ width: '100%' }}
        >
          <style
            type="text/css"
            dangerouslySetInnerHTML={{
              __html: 'body{background-color: #fafbfb;}',
            }}
          />
          {!this.props.hideTitle ? this.renderHeader() : null}
          {this.props.headerBottom}
          {!this.props.isLoading && (
            <Grid hideBackground={this.props.hideBackground}>
              <div className="animated fadeIn">{this.props.children}</div>
            </Grid>
          )}
          {this.props.isLoading &&
            (this.props.componentLoading ? (
              <Grid hideBackground={this.props.hideBackground}>
                <div className="animated fadeIn">
                  {this.props.componentLoading}
                </div>
              </Grid>
            ) : (
              <AbsoluteLoading>
                <LoaderCircle />
              </AbsoluteLoading>
            ))}
        </PageBodyWrapper>
      </StickyContainer>
    )
  }
}
