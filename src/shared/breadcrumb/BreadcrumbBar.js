import { autobind } from 'core-decorators'
import PropTypes from 'prop-types'
import React from 'react'
import { withRouter } from 'react-router-dom'
import { connectAutoDispatch } from 'redux/connect'
import { deleteBreadcrumb } from 'shared/breadcrumb/action'
import styled from 'styled-components'
import { SHAPE, TEXT } from 'themes/color'
import injectBreadcrumb from './injectBreadcrumb'

const BreadcrumbBarStyle = styled.div`
  display: flex;
  flex-direction: row;
`

const BreadCrumbItem = styled.a`
  font-size: ${props => (props.last ? 22 : 18)}px;
  display: flex;
  align-items: center;
  font-weight: 600;
  i {
    margin-right: 8px;
  }
  &:hover {
    text-decoration: none;
  }
  ${props =>
    props.last
      ? `
    color: ${TEXT.NORMAL} !important;
  `
      : `
    position: relative;
    top: 1px;
    color: ${TEXT.GRAY} !important;
  `} ${props =>
    !props.first
      ? `
    ::before{
      display: inline-block;
      padding-right: .5rem;
      padding-left: .5rem;
      font-family: 'simple-line-icons';
      color: ${SHAPE.GRAYBOLD};
      content: "\\e606";
      font-size: 18px;
      position: relative;
      top: 2px;
    }
  `
      : null};
`

const SpanIcon = styled.span`
  position: relative;
  top: 2px;
`
@connectAutoDispatch(null, {
  deleteBreadcrumb,
})
@withRouter
@autobind
class BreadcrumbItem extends React.PureComponent {
  handleClick(e) {
    const { first, deleteBreadcrumb, length } = this.props
    e.preventDefault()
    if (length === 1) return
    if (first) {
      deleteBreadcrumb({
        id: 'detail',
        // autoDestroy: true,
      })
    }

    if (!this.props.last) {
      this.props.history.push(this.props.href)
    }
  }

  render() {
    return (
      <BreadCrumbItem
        onClick={this.handleClick}
        first={this.props.first}
        href={this.props.href}
        last={this.props.last}
        length={this.props.length}
      >
        {this.props.icon ? <SpanIcon>{this.props.icon} &nbsp;</SpanIcon> : null}
        {this.props.name}
      </BreadCrumbItem>
    )
  }
}

function BreadcrumbBar({ breadcrumbs, isReload }) {
  return (
    <BreadcrumbBarStyle>
      {breadcrumbs.map((breadcrumb, index) => (
        <BreadcrumbItem
          key={breadcrumb.id}
          {...breadcrumb}
          index={index}
          first={index === 0}
          length={breadcrumbs.length}
          last={index === breadcrumbs.length - 1}
          isReload={isReload}
        />
      ))}
    </BreadcrumbBarStyle>
  )
}
BreadcrumbBar.propTypes = {
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.any,
      name: PropTypes.any,
      href: PropTypes.any,
    })
  ),
}

export default injectBreadcrumb(BreadcrumbBar)
