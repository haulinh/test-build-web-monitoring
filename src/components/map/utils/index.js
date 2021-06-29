import React from 'react'
import { getApps } from 'config'

export function getGoogleMapProps(lang = 'en') {
  const key = getApps().googleMapKey
  return {
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${key}&v=3.exp&language=${lang}&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100vh` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }
}
