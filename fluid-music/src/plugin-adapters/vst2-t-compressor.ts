import { PluginType, FluidPlugin, PluginAutomationEvent } from '../plugin';
const pluginName = '#TCompressor'
const pluginType = PluginType.VST2

export interface TCompressorParameters {
  enable? : number;
  mode? : number;
  thresholdDb? : number;
  ratio? : number;
  attackMs? : number;
  holdMs? : number;
  releaseMs? : number;
  inputDb? : number;
  makeUpDb? : number;
  softKneeDb? : number;
  lookaheadMs? : number;
  limit? : number;
  useSidechainTrigger? : number;
  monitorSidechain? : number;
  softClip? : number;
  softClipThresholdDb? : number;
  peakDetection? : number;
  useSumDetection? : number;
  enableAutoMakeUpGain? : number;
  filter? : number;
  filterType? : number;
  freqHz? : number;
  q? : number;
  gainDb? : number;
}
const parameterLibrary = {
  enable: { name: 'Enable', index: 0, isLinear: false, choices: {"0":0,"1":1} },
  mode: { name: 'Mode', index: 1, isLinear: false, choices: {"0":0,"1":1} },
  thresholdDb: { name: 'Threshold', index: 2, isLinear: true, range: [-60, 0] as [number, number], units: 'db' },
  ratio: { name: 'Ratio', index: 3, isLinear: false, range: [1, 100] as [number, number], powerFuncB: 5 },
  attackMs: { name: 'Attack', index: 4, isLinear: true, range: [0.1, 100] as [number, number], units: 'ms' },
  holdMs: { name: 'Hold', index: 5, isLinear: true, range: [0, 1000] as [number, number], units: 'ms' },
  releaseMs: { name: 'Release', index: 6, isLinear: true, range: [1, 1000] as [number, number], units: 'ms' },
  inputDb: { name: 'Input', index: 7, isLinear: true, range: [-20, 20] as [number, number], units: 'db' },
  makeUpDb: { name: 'Make-up', index: 8, isLinear: true, range: [-20, 20] as [number, number], units: 'db' },
  softKneeDb: { name: 'Soft Knee', index: 9, isLinear: true, range: [0, 60] as [number, number], units: 'db' },
  lookaheadMs: { name: 'Lookahead', index: 10, isLinear: true, range: [0, 10] as [number, number], units: 'ms' },
  limit: { name: 'Limit', index: 11, isLinear: false, choices: {"0":0,"1":1} },
  useSidechainTrigger: { name: 'Use Sidechain Trigger', index: 12, isLinear: false, choices: {"0":0,"1":1} },
  monitorSidechain: { name: 'Monitor Sidechain', index: 13, isLinear: false, choices: {"0":0,"1":1} },
  softClip: { name: 'Soft Clip', index: 14, isLinear: false, choices: {"off":0,"on":1} },
  softClipThresholdDb: { name: 'Threshold (2)', index: 15, isLinear: true, range: [-60, 0] as [number, number], units: 'db' },
  peakDetection: { name: 'Peak Detection', index: 16, isLinear: false, choices: {"0":0,"1":1} },
  useSumDetection: { name: 'Use Sum Detection', index: 17, isLinear: false, choices: {"0":0,"1":1} },
  enableAutoMakeUpGain: { name: 'Auto', index: 18, isLinear: false, choices: {"off":0,"on":1} },
  filter: { name: 'Filter', index: 19, isLinear: false, choices: {"off":0,"on":1} },
  filterType: { name: 'Type', index: 20, isLinear: false, choices: {"0":0,"1":0.1428571492433548,"2":0.2857142984867096,"3":0.4285714626312256,"4":0.5714285969734192,"5":0.7142857313156128,"6":0.8571429252624512,"7":1} },
  freqHz: { name: 'Freq', index: 21, isLinear: false, range: [10, 20000] as [number, number], units: 'hz', powerFuncB: 5 },
  q: { name: 'Q', index: 22, isLinear: false, range: [0.025, 40] as [number, number], powerFuncB: 5 },
  gainDb: { name: 'Gain', index: 23, isLinear: true, range: [-30, 30] as [number, number], units: 'db' }
}
const makeAutomation = {
  enable (value? : number) : PluginAutomationEvent {
    const event : PluginAutomationEvent = {
      type: 'pluginAuto',
      pluginSelector: { pluginName, pluginType },
      paramKey: 'enable',
      startTime: 0,
      duration: 0,
      curve: 0,
    };
    if (typeof value === 'number') event.value = value;
    return event;
  },
  mode (value? : number) : PluginAutomationEvent {
    const event : PluginAutomationEvent = {
      type: 'pluginAuto',
      pluginSelector: { pluginName, pluginType },
      paramKey: 'mode',
      startTime: 0,
      duration: 0,
      curve: 0,
    };
    if (typeof value === 'number') event.value = value;
    return event;
  },
  thresholdDb (value? : number) : PluginAutomationEvent {
    const event : PluginAutomationEvent = {
      type: 'pluginAuto',
      pluginSelector: { pluginName, pluginType },
      paramKey: 'thresholdDb',
      startTime: 0,
      duration: 0,
      curve: 0,
    };
    if (typeof value === 'number') event.value = value;
    return event;
  },
  ratio (value? : number) : PluginAutomationEvent {
    const event : PluginAutomationEvent = {
      type: 'pluginAuto',
      pluginSelector: { pluginName, pluginType },
      paramKey: 'ratio',
      startTime: 0,
      duration: 0,
      curve: 0,
    };
    if (typeof value === 'number') event.value = value;
    return event;
  },
  attackMs (value? : number) : PluginAutomationEvent {
    const event : PluginAutomationEvent = {
      type: 'pluginAuto',
      pluginSelector: { pluginName, pluginType },
      paramKey: 'attackMs',
      startTime: 0,
      duration: 0,
      curve: 0,
    };
    if (typeof value === 'number') event.value = value;
    return event;
  },
  holdMs (value? : number) : PluginAutomationEvent {
    const event : PluginAutomationEvent = {
      type: 'pluginAuto',
      pluginSelector: { pluginName, pluginType },
      paramKey: 'holdMs',
      startTime: 0,
      duration: 0,
      curve: 0,
    };
    if (typeof value === 'number') event.value = value;
    return event;
  },
  releaseMs (value? : number) : PluginAutomationEvent {
    const event : PluginAutomationEvent = {
      type: 'pluginAuto',
      pluginSelector: { pluginName, pluginType },
      paramKey: 'releaseMs',
      startTime: 0,
      duration: 0,
      curve: 0,
    };
    if (typeof value === 'number') event.value = value;
    return event;
  },
  inputDb (value? : number) : PluginAutomationEvent {
    const event : PluginAutomationEvent = {
      type: 'pluginAuto',
      pluginSelector: { pluginName, pluginType },
      paramKey: 'inputDb',
      startTime: 0,
      duration: 0,
      curve: 0,
    };
    if (typeof value === 'number') event.value = value;
    return event;
  },
  makeUpDb (value? : number) : PluginAutomationEvent {
    const event : PluginAutomationEvent = {
      type: 'pluginAuto',
      pluginSelector: { pluginName, pluginType },
      paramKey: 'makeUpDb',
      startTime: 0,
      duration: 0,
      curve: 0,
    };
    if (typeof value === 'number') event.value = value;
    return event;
  },
  softKneeDb (value? : number) : PluginAutomationEvent {
    const event : PluginAutomationEvent = {
      type: 'pluginAuto',
      pluginSelector: { pluginName, pluginType },
      paramKey: 'softKneeDb',
      startTime: 0,
      duration: 0,
      curve: 0,
    };
    if (typeof value === 'number') event.value = value;
    return event;
  },
  lookaheadMs (value? : number) : PluginAutomationEvent {
    const event : PluginAutomationEvent = {
      type: 'pluginAuto',
      pluginSelector: { pluginName, pluginType },
      paramKey: 'lookaheadMs',
      startTime: 0,
      duration: 0,
      curve: 0,
    };
    if (typeof value === 'number') event.value = value;
    return event;
  },
  limit (value? : number) : PluginAutomationEvent {
    const event : PluginAutomationEvent = {
      type: 'pluginAuto',
      pluginSelector: { pluginName, pluginType },
      paramKey: 'limit',
      startTime: 0,
      duration: 0,
      curve: 0,
    };
    if (typeof value === 'number') event.value = value;
    return event;
  },
  useSidechainTrigger (value? : number) : PluginAutomationEvent {
    const event : PluginAutomationEvent = {
      type: 'pluginAuto',
      pluginSelector: { pluginName, pluginType },
      paramKey: 'useSidechainTrigger',
      startTime: 0,
      duration: 0,
      curve: 0,
    };
    if (typeof value === 'number') event.value = value;
    return event;
  },
  monitorSidechain (value? : number) : PluginAutomationEvent {
    const event : PluginAutomationEvent = {
      type: 'pluginAuto',
      pluginSelector: { pluginName, pluginType },
      paramKey: 'monitorSidechain',
      startTime: 0,
      duration: 0,
      curve: 0,
    };
    if (typeof value === 'number') event.value = value;
    return event;
  },
  softClip (value? : number) : PluginAutomationEvent {
    const event : PluginAutomationEvent = {
      type: 'pluginAuto',
      pluginSelector: { pluginName, pluginType },
      paramKey: 'softClip',
      startTime: 0,
      duration: 0,
      curve: 0,
    };
    if (typeof value === 'number') event.value = value;
    return event;
  },
  softClipThresholdDb (value? : number) : PluginAutomationEvent {
    const event : PluginAutomationEvent = {
      type: 'pluginAuto',
      pluginSelector: { pluginName, pluginType },
      paramKey: 'softClipThresholdDb',
      startTime: 0,
      duration: 0,
      curve: 0,
    };
    if (typeof value === 'number') event.value = value;
    return event;
  },
  peakDetection (value? : number) : PluginAutomationEvent {
    const event : PluginAutomationEvent = {
      type: 'pluginAuto',
      pluginSelector: { pluginName, pluginType },
      paramKey: 'peakDetection',
      startTime: 0,
      duration: 0,
      curve: 0,
    };
    if (typeof value === 'number') event.value = value;
    return event;
  },
  useSumDetection (value? : number) : PluginAutomationEvent {
    const event : PluginAutomationEvent = {
      type: 'pluginAuto',
      pluginSelector: { pluginName, pluginType },
      paramKey: 'useSumDetection',
      startTime: 0,
      duration: 0,
      curve: 0,
    };
    if (typeof value === 'number') event.value = value;
    return event;
  },
  enableAutoMakeUpGain (value? : number) : PluginAutomationEvent {
    const event : PluginAutomationEvent = {
      type: 'pluginAuto',
      pluginSelector: { pluginName, pluginType },
      paramKey: 'enableAutoMakeUpGain',
      startTime: 0,
      duration: 0,
      curve: 0,
    };
    if (typeof value === 'number') event.value = value;
    return event;
  },
  filter (value? : number) : PluginAutomationEvent {
    const event : PluginAutomationEvent = {
      type: 'pluginAuto',
      pluginSelector: { pluginName, pluginType },
      paramKey: 'filter',
      startTime: 0,
      duration: 0,
      curve: 0,
    };
    if (typeof value === 'number') event.value = value;
    return event;
  },
  filterType (value? : number) : PluginAutomationEvent {
    const event : PluginAutomationEvent = {
      type: 'pluginAuto',
      pluginSelector: { pluginName, pluginType },
      paramKey: 'filterType',
      startTime: 0,
      duration: 0,
      curve: 0,
    };
    if (typeof value === 'number') event.value = value;
    return event;
  },
  freqHz (value? : number) : PluginAutomationEvent {
    const event : PluginAutomationEvent = {
      type: 'pluginAuto',
      pluginSelector: { pluginName, pluginType },
      paramKey: 'freqHz',
      startTime: 0,
      duration: 0,
      curve: 0,
    };
    if (typeof value === 'number') event.value = value;
    return event;
  },
  q (value? : number) : PluginAutomationEvent {
    const event : PluginAutomationEvent = {
      type: 'pluginAuto',
      pluginSelector: { pluginName, pluginType },
      paramKey: 'q',
      startTime: 0,
      duration: 0,
      curve: 0,
    };
    if (typeof value === 'number') event.value = value;
    return event;
  },
  gainDb (value? : number) : PluginAutomationEvent {
    const event : PluginAutomationEvent = {
      type: 'pluginAuto',
      pluginSelector: { pluginName, pluginType },
      paramKey: 'gainDb',
      startTime: 0,
      duration: 0,
      curve: 0,
    };
    if (typeof value === 'number') event.value = value;
    return event;
  }
}
export class TCompressor extends FluidPlugin {
  constructor(
    public readonly parameters : TCompressorParameters = {},
  ) { super(pluginName, pluginType) }

  readonly parameterLibrary = parameterLibrary;
  readonly makeAutomation = makeAutomation;

  // Static members
  static readonly parameterLibrary = parameterLibrary;
  static readonly makeAutomation = makeAutomation;
}
