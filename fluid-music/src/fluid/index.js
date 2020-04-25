/* Recipes cannot import the root level index file, because it would cause a
circular dependency. This internal file just aggregates OSC message helpers.

This file is not imported by the root level index file, because that interferes
with VS Code's type inference. VS Code type inference struggles with objects
defined in one file, and extended in another file.

TLDR: When adding a new module to the fluid folder, it should be imported
in this file, AND the root level index.js file. */

const plugin = require('./plugin');
const sampler = require('./sampler');
const audioclip = require('./audioclip');
const audiotrack = require('./audiotrack');
const midiclip = require('./midiclip');
const transport = require('./transport');
const global = require('./global');
const clip = require('./clip');
const tempo = require('./tempo');
const pluginTStereoDelay = require('./plugin-tstereodelay');
const pluginZebra2Vst2 = require('./plugin-zebra2-vst2');


/**
 * @module fluid
 */
module.exports = {
  audioclip,
  audiotrack,
  clip,
  global,
  midiclip,
  plugin,
  pluginTStereoDelay,
  pluginZebra2Vst2,
  sampler,
  tempo,
  transport,
};