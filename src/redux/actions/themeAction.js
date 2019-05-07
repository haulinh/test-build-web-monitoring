export const TOGGLE_NAVIGATION = 'THEME/toggle-navigation'
export const SELECT_MENU = 'THEME/select-menu'
export const CHANGE_OPEN_SUBMENU = 'THEME/change-open-submenu'

export function toggleNavigation(isOpen) {
  return {
    type: TOGGLE_NAVIGATION,
    isOpen
  }
}

export function selectMenu(menuKey) {
  return {
    type: SELECT_MENU,
    payload: menuKey
  }
}

export function changeOpenSubMenu(openSubMenu) {
  return {
    type: CHANGE_OPEN_SUBMENU,
    payload: openSubMenu
  }
}
