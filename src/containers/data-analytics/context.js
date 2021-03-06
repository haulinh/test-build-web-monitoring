import React from 'react'

const AnalyzeDataContext = React.createContext()

export const AnalyzeDataProvider = AnalyzeDataContext.Provider
export const AnalyzeDataConsumer = AnalyzeDataContext.Consumer

export default AnalyzeDataContext