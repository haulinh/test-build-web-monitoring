export const addBreadcrumbFilter = (addBreadcrumb, url, name) => {
  addBreadcrumb({
    id: 'detail',
    icon: '',
    href: url,
    name,
    autoDestroy: true,
  })
}

export const updateBreadcrumbFilter = (updateBreadcrumb, url, name) => {
  updateBreadcrumb({
    id: 'detail',
    icon: '',
    href: url,
    name,
    autoDestroy: true,
  })
}

export const deleteBreadcrumbFilter = deleteBreadcrumb => {
  deleteBreadcrumb({
    id: 'detail',
  })
}
