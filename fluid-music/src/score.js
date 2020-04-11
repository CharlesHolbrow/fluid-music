const tab = require('./tab');

const parseTab     = tab.parseTab;
const parseRhythm  = tab.parseRhythm;
const reservedKeys = tab.reservedKeys;

/**
 * score.parse recurses over a score object, typically extracted from a YAML
 * file. It is somewhat similar to tab.parse, except that it expects a different
 * input format, and outputs a more structured document that resembles the track
 * and clip model that most DAWs use.
 *
 * In the input - arrays indicate a sequence
 * In the output - arrays are a collection of clips (with .duration/.startTime)
 *
 * @param {Object|Array|String} object - Typically this is the only argument you
 *    need. This is a score object that represents multiple tracks.
 *
 * @param {string} [rhythm] rhythm string, if not specified, `object`
 *    must have a `.r` property.
 * @param {Object|Array} [noteLibrary] An object or array noteLibrary (see
 *    parseTab for details). If not specified, `object` must have a
 *    `.noteLibrary` property.
 * @param {number} [startTime]
 * @param {string} [vPattern]
 * @param {Object|Array} [vLibrary]
 * @param {Object} [tracksObject] This is a container for all tracks. It is
 *    returned when `object` is a JS Object (as opposed to a string or array).
 * @param {string} [trackKey] The name of the track that we are currently parsing.
 * @returns {Object} representation of the score.
 */
const parse = function(object, rhythm, noteLibrary, startTime, vPattern, vLibrary, tracksObject, trackKey) {
  if (typeof startTime !== 'number') startTime = 0;
  if (object.hasOwnProperty('noteLibrary')) noteLibrary = object.noteLibrary;
  if (object.hasOwnProperty('vLibrary')) vLibrary = object.vLibrary;
  if (object.hasOwnProperty('r')) rhythm = object.r;
  if (object.hasOwnProperty('v')) vPattern = object.v;

  if (rhythm === undefined || noteLibrary === undefined)
    throw new Error('tab.parse could not find rhythm AND a noteLibrary');

  // Internally, there are three handlers for (1)arrays (2)strings (3)objects
  //
  // All three handlers must:
  // - return an object that has a .duration property. Duration are interperated
  //   differently for Arrays, Objects, and Strings found in the input object.
  //   - Array:  sum of the duration of the array's elements
  //   - Object: duration of the longest child
  //   - string: duration of the associated rhythm string
  //
  // The array and object handlers must:
  // - call score.parse on children
  // - pass the appropriate tracksObject/trackKey to each score.parse call
  //
  // The string handler must:
  // - create clips with a .startTime and .duration
  // - add those clips to the tracksObjects[trackKey].clips array
  //
  // The object handler:
  // - Must return a fully parsed representation of the score
  if (Array.isArray(object)) {
    let duration = 0;
    const results = [];
    for (let o of object) {
      let result = parse(o, rhythm, noteLibrary, startTime + duration, vPattern, vLibrary, tracksObject, trackKey);
      results.push(result);
      duration += result.duration;
    }
    results.duration = duration;
    return results
  } else if (typeof object === 'string') {
    // We have a string that can be parsed with parseTab
    const a = parseRhythm(rhythm);
    const duration = a.totals[a.totals.length-1];
    const result = parseTab(rhythm, object, noteLibrary, vPattern, vLibrary);
    result.startTime = startTime;
    result.duration = duration;

    if (!tracksObject[trackKey]) tracksObject[trackKey] = {clips:[]};
    tracksObject[trackKey].clips.push(result);

    return result;
  } else {
    // Assume we have a JavaScript Object
    const isOutermost = (tracksObject === undefined);
    if (isOutermost) tracksObject = { };

    let duration = 0;
    for (let [key, val] of Object.entries(object)) {
      if (reservedKeys.hasOwnProperty(key)) continue;

      // Ensure track and track.clips exists
      if (!tracksObject.hasOwnProperty(key)) {
        tracksObject[key] = { clips: [] };
      }

      let result = parse(val, rhythm, noteLibrary, startTime, vPattern, vLibrary, tracksObject, key);
      if (result.duration > duration) duration = result.duration;
    }

    tracksObject.duration = duration;
    return tracksObject;
  }
};
  
module.exports = {
  parse,
}