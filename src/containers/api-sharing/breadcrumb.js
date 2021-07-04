import slug from 'constants/slug'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { translate } from 'hoc/create-lang'
import React from 'react'
//import Icon from 'themes/icon'

const Breadcrumb = () =>
  createBreadcrumb({
    list: {
      id: 'list',
      href: slug.stationFixed.list,
      name: translate('stationFixedPoint.create.label'),
    },
    create: {
      id: 'create',
      href: slug.stationFixed.create,
      name: translate('stationFixedPoint.create.label'),
    },
    edit: {
      id: 'edit',
      href: slug.stationFixed.edit,
      name: translate('stationFixedPoint.edit.label'),
    },
  })()

const BreadcrumbApiSharing = ({ items }) => {
  return <Breadcrumb items={items} />
}

export default BreadcrumbApiSharing
