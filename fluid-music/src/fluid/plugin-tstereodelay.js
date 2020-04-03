const plugin = require('./plugin');
const fluid = { plugin };

// These helpers convert "useful" units like DBfs and milliseconds to the
// normalized equvalients that work with "#TStereo Delay" parameters.
const db2Level = v => (v + 50) / 68; // For "Wet" and "Dry" params
const ms2Time = v => v / 5000;       // For "L Delay" and "R Delay" params

/**
 * This is a helper class for Tracktion's #TStereoDelay VST2 plugin, which is
 * available on Mac, Windows, and Linux.
 *
 * To use any method in this module other than `select`, make sure that a
 * `#TStereo Delay` plugin instance is selected by first calling
 * `pluginTStereoDelay.select()`.
 *
 * Internal Plugins like "volume", "insert", "auxsend", and "auxreturn" work
 * with `fluid.plugin.setParamExplicit` AND `fluid.plugin.setParamNormalized`.
 *
 * For VSTs it is not possible to use setParamNormalized. This module provides
 * some useful adapters for specifying paramter values in useful units like
 * decibels and milliseconds, making it easier to read and write delay
 * parameters in code.
 *
 * `#TStereo Delay` has several wet/dry controls:
 * - "Wet" - This is the value that appears in the UI
 * - "Wet Level" - Extra control that appears only in tracktion's bottom bar
 * - "Dry"
 * - "Dry Level"
 * This module uses "Wet" and "Dry", because it makes it easier to understand
 * from when the plugin is viewed in a GUI.
 *
 * The `#TStereo Delay` has some limited tempo sync abilities. When sync is
 * enabled, the following parameters indicate the delay time:
 * - "L Note Delay"
 * - "L Note Offset"
 * - "R Note Delay"
 * - "R Note Offset"
 * When sync is disabled, the following params indicate the delay time:
 * - "L Delay"
 * - "R Delay"
 */
const pluginTStereoDelay = {
  /**
   * Get or Create a `#TStereo Delay` plugin on the given track
   * @param {number} [pluginId] - optional index of the plugin to use
   */
  select(pluginId) {
    return fluid.plugin.select('#TStereo Delay', 'vst', pluginId);
  },

  /**
   * Zero the selected `#TStereo Delay` plugin, resetting to sensible defaults.
   */
  zero() {
    return [
      fluid.plugin.setParamExplicit('Dry', 0), // Set dry signal to minumum (0%)
      pluginTStereoDelay.setWetDbfs(0),        // Set wet signal to unity gain
      pluginTStereoDelay.setDelayMs(0),
      pluginTStereoDelay.disableSync(),
      pluginTStereoDelay.setFeedbackLeft(0),
      pluginTStereoDelay.setFeedbackRight(0),
    ];
  },

  /**
   * @param {number} delayMs delay time in milliseconds
   */
  setDelayLeftMs(delayMs) {
    return fluid.plugin.setParamExplicit('L Delay', ms2Time(delayMs));
  },

  /**
   * @param {number} delayMs delay time in milliseconds
   */
  setDelayRightMs(delayMs) {
    return fluid.plugin.setParamExplicit('R Delay', ms2Time(delayMs));
  },

  /**
   * Set Delay time for both left and right channels
   * @param {number} delayMs delay time in milliseconds
   */
  setDelayMs(delayMs) {
    return [
      pluginTStereoDelay.setDelayLeftMs(delayMs),
      pluginTStereoDelay.setDelayRightMs(delayMs),
    ];
  },

  /**
   * Set the Wet signal level
   * @param {number} db Wet signal level in DBFS (0 = unity gain)
   */
  setWetDbfs(db) {
    return fluid.plugin.setParamExplicit('Wet', db2Level(db));
  },

  /**
   * Set the Dry signal level
   * @param {number} db Dry signal level in DBFS (0 = unity gain)
   */
  setDryDbfs(db) {
    return fluid.plugin.setParamExplicit('Dry', db2Level(db));
  },

  /**
   * If the left channel has non-zero feedback, pan it accross the left/right
   * inputs.
   * @param {number} pan 0=center -1=left 1=right
   */
  setCrossfeedLeft(pan) {
    return fluid.plugin.setParamExplicit('L Cross FB', pan * 0.5 + 0.5);
  },

  /**
   * If the right channel has non-zero feedback, pan it accross the left/right
   * inputs.
   * @param {number} pan 0=center -1=left 1=right
   */
  setCrossfeedRight(pan) {
    return fluid.plugin.setParamExplicit('R Cross FB', pan * 0.5 + 0.5);
  },

  /**
   * Set the feedback amount from the left delay back into the plugin input.
   * @param {number} amt Left feedback amount. 0=none 1=100% -1=100%(inverted)
   */
  setFeedbackLeft(amt) {
    return fluid.plugin.setParamExplicit('L Feedback', amt * 0.5 + 0.5);
  },

  /**
   * Set the feedback amount from the right delay back into the plugin input.
   * @param {number} amt Right feedback amount. 0=none 1=100% -1=100%(inverted)
   */
  setFeedbackRight(amt) {
    return fluid.plugin.setParamExplicit('R Feedback', amt * 0.5 + 0.5);
  },

  /**
   * Set the feedback amount from both left and rights delays.
   * @param {number} amt Right feedback amount. 0=none 1=100% -1=100%(inverted)
   */
  setFeedback(amt) {
    return [
      fluid.plugin.setParamExplicit('L Feedback', amt * 0.5 + 0.5),
      fluid.plugin.setParamExplicit('R Feedback', amt * 0.5 + 0.5),
    ];
  },

  /**
   * #TStereo Delay has a 'Sync' feature, which is not currently well supported
   * by this fluid module. I recommend disabling it. If you want to use the sync
   * feature, you must use the `fluid.plugin.setParam` methods.
   * 
   * Note that Waveform's sync feature does not follow tempo automation, so it
   * is probably best to just calculate tempos in milliseconds and specify them
   * using the `fluid.pluginTStereoDelay.setDelayMs` helpers.
   */
  disableSync() {
    return fluid.plugin.setParamExplicit('Sync', 0);
  },
}

module.exports = pluginTStereoDelay;

// Dry Level
// Wet Level
// Enable
// Input
// Sync
// L Source
// L Feedback
// L Cross FB
// L Note Delay
// L Note Offset
// L Delay
// L Pan
// L Low Cut
// L High Cut
// R Source
// R Feedback
// R Cross FB
// R Note Delay
// R Note Offset
// R Delay
// R Pan
// R Low Cut
// R High Cut
// Wet
// Dry