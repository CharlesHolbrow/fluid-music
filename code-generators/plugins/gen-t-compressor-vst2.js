const tCompReport = require('./reports/t-compressor-vst2')
const fluid = require('../..')

for (const paramInfo of tCompReport.params) {
  if (paramInfo.name === 'Threshold (2)') paramInfo.key = 'softClipThresholdDb'
  else if (paramInfo.name === 'Auto') paramInfo.key = 'enableAutoMakeUpGain'
  else if (paramInfo.name === 'Type') paramInfo.key = 'filterType'
  else if (paramInfo.name === 'Freq') paramInfo.powerFuncB = 5
  else if (paramInfo.name === 'Q') paramInfo.powerFuncB = 5
  else if (paramInfo.name === 'Ratio') paramInfo.powerFuncB = 5
}

const moduleString = fluid.gen.generatePluginModule(tCompReport, { internal: true })
const fs = require('fs')
const path = require('path')
const filename = path.join(__dirname, '..', '..', 'src', 'plugin-adapters', 't-compressor-vst2.ts')
fs.createWriteStream(filename).write(moduleString)

