import { Technique, UseContext } from '../fluid-interfaces'
import { AutomationLane, AutomationPoint } from '../FluidAutomation'
import { FluidPlugin } from '../FluidPlugin'
import { FluidSession } from '../FluidSession'
import { FluidTrack, FluidReceive } from '../FluidTrack'
import { Nudge, TechniqueClass } from './basic'

export interface PluginAutoTechniqueClass extends TechniqueClass {
  new(options: PluginAutoOptions) : Technique
}

/**
 * An automation event on a track
 */
export class TrackAutomation implements Technique {
  paramKey : string
  value : number = 0
  curve : number = 0

  constructor (options : AutoOptions) {
    this.paramKey = options.paramKey
    if (typeof options.paramKey !== 'string') throw new Error('TrackAutomation constructor missing paramKey:'+JSON.stringify(options))
    if (typeof options.value === 'number') this.value = options.value
    if (typeof options.curve === 'number') this.curve = options.curve
  }

  use ({ startTimeSeconds, track } : UseContext) {
    const point : AutomationPoint = {
      startTimeSeconds,
      value: (this.value as number),
      curve: 0,
    }

    if (typeof this.curve === 'number') point.curve = this.curve

    const automation = track.automation

    if (!automation.hasOwnProperty(this.paramKey))
      automation[this.paramKey] = new AutomationLane

    automation[this.paramKey].points.push(point)

    return null
  }
}
export interface AutoOptions {
  paramKey : string
  value? : number
  curve? : number
}

export class TrackGainAutomation implements Technique {
  gainDb : number
  curve : number = 0

  constructor(options : { gainDb: number, curve?: number }|number) {
    if (typeof options === 'number') {
      this.gainDb = options
    } else {
      this.gainDb = options.gainDb
      if (typeof options.curve === 'number') this.curve = options.curve
    }
  }

  use(context : UseContext) {
    new TrackAutomation({ paramKey: 'gainDb', value: this.gainDb, curve: this.curve }).use(context)
  }
}

export class TrackGainAutomationRamp implements Technique {
  gainDb : number
  curve : number = 0

  constructor(options : { gainDb: number, curve?: number }|number) {
    if (typeof options === 'number') options = { gainDb: options }
    this.gainDb = options.gainDb
    if (typeof options.curve === 'number') this.curve = options.curve
  }

  use (context : UseContext) {
    const currentPoint = context.track.automation.gainDb.getLastPointAt(context.startTimeSeconds)
    const currentValue = (typeof currentPoint?.value === 'number') ? currentPoint.value : 0
    // Notice that when there are no automation points, the default value is 0,
    // not track.gainDb. This is because the track automation and track gain are
    // applied in sequence, and we do not want to apply the track's gainDb twice.

    new TrackGainAutomation({ gainDb: currentValue, curve: this.curve }).use(context)
    const newStartTime = context.startTime + context.duration
    const newStartTimeSeconds = context.startTimeSeconds + context.durationSeconds
    context.startTime = newStartTime
    context.startTimeSeconds = newStartTimeSeconds
    new TrackGainAutomation({ gainDb: this.gainDb }).use(context)
  }
}

/**
 * Identifies a plugin on an arbitrary track
 */
 export interface PluginSelector {
  pluginName : string

  /** ex: 'VST2', 'VST3', 'AudioUnit' */
  pluginType : string

  /**
   * The selected track may have multiple plugins with the same name. Index from
   * within those plugins. Most of the time this isn't needed, because it is
   * unusual to have more than one plugin with the same name on a particular
   * track.
   */
  nth? : number
}

/**
 * Inserts an automation point for a specific plugin on an arbitrary track
 */
 export class PluginAutomation implements Technique {

  /**
   * There are three possible types for `options.plugin`
   * - a pluginSelector object `{ pluginName: string, pluginType: string, nth?: number}`
   * - a 'pluginName' string - gets the first instance only
   * - a plugin constructor function (instanceof) - gets the first instance only
   *
   * ```
   * // Several different plugin selectors may be used
   * const plugin = fluid.plugins.DragonflyHallVst2
   * const op1 = { value: 15, paramKey: 'sizeMeters', plugin: plugin }
   * const op2 = { value: 10, paramKey: 'sizeMeters', plugin: 'DragonflyHallReverb' }
   * const op3 = fluid.plugins.DragonflyHallVst2.makeAutomation.sizeMeters(30)
   * op3.plugin.nth = 2 // Select an instance other than the first
   *
   * const tLibraryVerb = {
   *  b: new techniques.PluginAutomation(op1),
   *  c: new techniques.PluginAutomation(op2),
   *  a: new techniques.PluginAutomation(op3),
   * }
   * ```
   */
  constructor (options : PluginAutoOptions) {
    if (!options.plugin) {
      console.log(options)
      throw new Error('Cannot create PluginAuto technique without a .plugin selector')
    }

    this.plugin = (typeof options.plugin !== 'string' && typeof options.plugin !== 'function') ? {...options.plugin} : options.plugin
    this.paramKey = options.paramKey // ex: 'sizeMeters'
    if (typeof options.value === 'number') this.value = options.value
    if (typeof options.curve === 'number') this.curve = options.curve
  }

  // Mandatory members
  plugin : PluginSelector|string|any
  paramKey : string

  // members with default values
  value : number = 0
  curve : number = 0

  use ({ track, startTimeSeconds } : UseContext) {

    const point : AutomationPoint = {
      startTimeSeconds,
      value: this.value,
      curve: this.curve,
    }

    const automationLane = this.resolvePlugin(track).getAutomationLane(this.paramKey)
    automationLane.points.push(point)

    return null
  }

  /** @internal */
  resolvePlugin(track : FluidTrack) : FluidPlugin {
    // We will not cache the plugin, because we may want to re-use the same
    // technique on another track


    if (typeof this.plugin === 'string') {
      for (const p of track.plugins) {
        if (p.pluginName === this.plugin) {
          return p
        }
      }
      throw new Error('Plugin automation failed to resolve plugins (string)')
    } else if (typeof this.plugin === 'function') {
      for (const p of track.plugins) {
        if (p instanceof this.plugin) {
          return p
        }
      }
      throw new Error('Plugin automation failed to resolve plugin (instanceof)')
    }

    // Assume plugin selector
    const nth     = this.plugin.nth || 0
    const matches = track.plugins.filter(plugin =>
      plugin.pluginName === this.plugin.pluginName &&
      plugin.pluginType === this.plugin.pluginType);

    if (nth >= matches.length) {
      const needed = nth - matches.length + 1
      if (needed > 0) throw new Error(`${needed} missing ${this.plugin.pluginName} plugins of on ${track.name} track`)
    }

    return matches[nth]
  }

}
export interface PluginAutoOptions extends AutoOptions {
  plugin : PluginSelector|string|any
}

/**
 * Unlike [[PluginAutomation]], using `PluginAutomationRamp` always inserts two
 * automation points (instead of one). The `.use(context)` method tries to find
 * the starting value, and then ramps from that value to the value specified by
 * `options.value` over the course of the triggering event.
 *
 * ```
 * // Several different plugin selectors may be used
 * const plugin = fluid.plugins.DragonflyHallVst2
 * const op1 = { value: 15, paramKey: 'sizeMeters', plugin: plugin }
 * const op2 = { value: 10, paramKey: 'sizeMeters', plugin: 'DragonflyHallReverb' }
 * const op3 = fluid.plugins.DragonflyHallVst2.makeAutomation.sizeMeters(30)
 * op3.plugin.nth = 2 // Select an instance other than the first
 *
 * const tLibraryVerb = {
 *  b: new techniques.PluginAutomationRamp(op1),
 *  c: new techniques.PluginAutomationRamp(op2),
 *  a: new techniques.PluginAutomationRamp(op3),
 * }
 * ```
 */
export class PluginAutomationRamp implements Technique {
  curve : number = 0
  rampStartOptions : PluginAutoOptions
  rampEndTechnique : PluginAutomation

  constructor(options : PluginAutoOptions) {
    this.rampStartOptions = {...options}

    options = {...options}
    if (typeof options.curve === 'number') {
      this.curve = options.curve
      delete options.curve
    }

    this.rampEndTechnique = new PluginAutomation(options)
  }

  use(context : UseContext) {
    const paramKey = this.rampStartOptions.paramKey
    const plugin = this.rampEndTechnique.resolvePlugin(context.track)
    const automationLane = plugin.getAutomationLane(paramKey)
    const lastPoint = automationLane.getLastPointAt(context.startTimeSeconds)
    const lastValue = (lastPoint && typeof lastPoint.value === 'number')
      ? lastPoint.value
      : (typeof plugin.parameters[paramKey] === 'number')
        ? plugin.parameters[paramKey]
        : this.rampEndTechnique.value

    if (lastValue !== null) {
      const rampStartOptions = { ...this.rampStartOptions }
      rampStartOptions.value = lastValue
      new PluginAutomation(rampStartOptions).use(context)
    }

    new Nudge(context.durationSeconds, this.rampEndTechnique).use(context)
  }
}

/**
 * SendAutomation inserts a single automation point from the track on which it
 * is used to a track of your choice.
 */
export class SendAutomation implements Technique {
  /** The destination track */
  private destinationTrack? : FluidTrack
  private unresolvedTrackName? : string

  /** gain in dB */
  value : number = 0
  curve : number = 0

  /**
   * Accepts three parameters:
   * - `options.to` can be a FluidTrack instance or a track name string. A
   * send will be created on the track if it does not exist already. If the
   * track does not exist, using this technique will throw an error.
   * - `options.value` send level in dBFS
   * - `options.curve` optional automation curve, defaults to 0
   * ```
   * const tLibrarySynth = {
   *   a: new techniques.SendAutomation({ to: 'verb', value: -6, curve: -0.5 })
   *   b: new techniques.SendAutomation({ to: 'verb', value: -12, curve: -0.5 })
   * }
   * ```
   */
  constructor(options : SendAutoOptions) {
    if (options.to instanceof FluidTrack) this.destinationTrack = options.to
    else if (typeof options.to === 'string') this.unresolvedTrackName = options.to
    else throw new Error('send automation options.to must be a FluidTrack OR a track name string')

    if (typeof options.value === 'number') this.value = options.value
    if (typeof options.curve === 'number') this.curve = options.curve
  }

  use(context : UseContext) {
    const receive = this.getOrCreateReceive(context.session, context.track)
    // At this point, we have everything we need: sourceTrack, destinationTrack, and receive
    receive.automation.gainDb.points.push({
      startTimeSeconds: context.startTimeSeconds,
      value: this.value,
      curve: this.curve
    })
  }

  /**
   * Get the destination track, assigning it to this.destionationTrack if
   * needed, and throwing if it is unspecified or if it cannot be found.
   * @internal
   */
  resolveDestinationTrack(session : FluidSession) {
    if (this.destinationTrack) return this.destinationTrack
    if (!this.unresolvedTrackName) throw new Error('SendAutomation cannot resolve without a target track or target track name')
    const track = session.getTrackByName(this.unresolvedTrackName)
    if (!track) throw new Error(`Send automation cannot resolve "${this.unresolvedTrackName}" track. Track not found in session.`)
    this.destinationTrack = track
    return track
  }

  /** @internal */
  getOrCreateReceive(session : FluidSession, sourceTrack : FluidTrack) {
    const destinationTrack = this.resolveDestinationTrack(session)
    let receive : FluidReceive|undefined
    for (const existingReceive of destinationTrack.receives) {
      if (existingReceive.from === sourceTrack) {
        receive = existingReceive
        break
      }
    }

    if (!receive) {
      receive = new FluidReceive({ from: sourceTrack })
      destinationTrack.receives.push(receive)
    }
    return receive
  }
}
export interface SendAutoOptions {
  to: string|FluidTrack
  curve? : number
  value? : number
}

/**
 * Unlike [[SendAutomation]], which always inserts one automation point, using
 * SendAutomationRamp always inserts two automation points. The `use` method
 * identifies the current value at the beginning of the event, and ramps to the
 * new value over the duration of the triggering event.
 * ```
 * const tLibrarySynth = {
 *   a: new techniques.SendAutomationRamp({ to: 'verb', value: -6, curve: -0.5 })
 *   b: new techniques.SendAutomationRamp({ to: 'verb', value: -12, curve: -0.5 })
 * }
 * ```
 */
export class SendAutomationRamp implements Technique {
  curve : number = 0
  rampEndTechnique : SendAutomation

  /**
   * Accepts three parameters:
   * - `options.to` can be a FluidTrack instance or a track name string. A
   * send will be created on the track if it does not exist already. If the
   * track does not exist, using this technique will throw an error.
   * - `options.value` send level in dBFS
   * - `options.curve` optional automation curve, defaults to 0
   */
  constructor(options : SendAutoOptions) {
    if (typeof options.curve === 'number') {
      this.curve = options.curve
      options = {...options}
      delete options.curve
    }
    this.rampEndTechnique = new SendAutomation(options)
  }

  use (context : UseContext) {
    const receiveTrack = this.rampEndTechnique.resolveDestinationTrack(context.session)
    const receive = this.rampEndTechnique.getOrCreateReceive(context.session, context.track)
    const automationLane = receive.automation.gainDb

    const lastPoint = automationLane.getLastPointAt(context.startTimeSeconds)
    const lastValue = (lastPoint && typeof lastPoint.value === 'number') ? lastPoint.value : receive.gainDb

    // ramp start automation point
    new SendAutomation({
      to: receiveTrack,
      value: lastValue,
      curve: this.curve,
    }).use(context)

    // ramp end automation point
    new Nudge(context.durationSeconds, this.rampEndTechnique).use(context)
  }
}
