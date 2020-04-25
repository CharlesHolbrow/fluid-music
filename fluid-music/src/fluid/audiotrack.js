/**
 * @namespace audiotrack
 */
const audiotrack = {
  /**
   * Select an audio track by name
   * @param {string} trackName
   */
  select(trackName) {
    if (typeof trackName !== 'string')
      throw new Error('audiotrack.Select requires track name string, got: ' + trackName);
    return {
      address: '/audiotrack/select',
      args: [{ type: 'string', value: trackName }],
    }
  },

  /**
   * Insert a audio file clip into the selected audio track. No effect if there
   * is no selected track.
   * @param {string} clipName name the new clip
   * @param {number} startTimeInWholeNotes clip start time in quarter notes
   * @param {string} fileName
   */
  insertWav (clipName, startTimeInWholeNotes, fileName){
    if (typeof clipName !== 'string')
      throw new Error('audiotrack.insertWav: clipName must be a string');
    if (typeof startTimeInWholeNotes !== 'number')
      throw new Error('audiotrack.insertWav: start time must be a number');
    if (typeof fileName !== 'string')
      throw new Error('audiotrack.insertWav: fileName must be a string');

    const args = [
      {type: 'string', value: clipName},
      {type: 'string', value: fileName},
      {type: 'float', value: startTimeInWholeNotes},
    ];
    return { address: '/audiotrack/insert/wav', args };
  },

  /**
   * Selects a track, ensuring that it has a bus return. Afterwords, other
   * tracks can add sends that target the track selected with this method.
   *
   * Use the audiotrack.send method to send from other tracks to a return.
   *
   * @param {string} busName - name of audiotrack (the return will be named
   *                           after the audio track).
   */
  selectReturnTrack(busName) {
    if (typeof busName !== 'string')
      throw new Error('bus.selectReturnTrack requires track name string, got: ' + busName);

    return {
      address: '/audiotrack/select/return',
      args: [{ type: 'string', value: busName }],
    }
  },

  /**
   * Adjust the send level to the specified bus, adding the send (post-gain) if
   * it does not yet exist. Use with audiotrack.selectReturnTrack(busName).
   * @param {string} busName The name of the return bus to send to
   * @param {number} [levelDb=0] default on the server is 0
   */
  send(busName, levelDb) {
    if (typeof busName !== 'string')
      throw new Error('send requires track name string, got: ' + busName);

    if (typeof levelDb !== undefined && typeof levelDb !== 'number')
      throw new Error('if send has a levelDb, it must be a number');

    const args =  [
      { type: 'string', value: busName },
      { type: 'string', value: 'ignored'},
      { type: 'string', value: 'post-gain'},
    ];

    if (typeof levelDb === 'number')
      args[1] = { type: 'float', value: levelDb };

    return { address: '/audiotrack/send/set/db', args };
  },

  /**
   * Mute or unmute the selected audio track.
   * @param {boolean} [mute=true] true if track should be muted. false = unmute.
   */
  mute(mute = true) {
    if (mute) return { address: '/audiotrack/mute'};
    else return { address: '/audiotrack/unmute'};
  },

  /**
   * Unmute the selected audio track.
   */
  unmute() { return { address: '/audiotrack/unmute'}},

  gain(dBFS) {
    if (typeof dBFS !== 'number')
      throw new Error('audiotrack.gain requires a number in dBFS');

    return {
      address: '/audiotrack/set/db',
      args: [{ type: 'float', value: dBFS }],
    };
  },

  /**
   * Render a region of the track to an audio file. If no time range is
   * supplied, the engine should use the loop time range.
   *
   * @param {string} outFilename output filename
   * @param {number} [startTimeInWholeNotes] start time in whole notes
   * @param {number} [durationInWholeNotes] duration in whole notes
   */
  renderRegion(outFilename, startTimeInWholeNotes, durationInWholeNotes) {
    if (typeof outFilename !== 'string')
      throw new Error('audiotrack.renderRegion requires a outputFilename string');

    const args =  [{ type: 'string', value: outFilename }];

    if (startTimeInWholeNotes !== undefined || durationInWholeNotes !== undefined) {
      if (typeof startTimeInWholeNotes !== 'number' ||
          typeof durationInWholeNotes !== 'number')
      {
        const msg =
          'An invalid time range was supplied to renderRegion: ' +
          'Both start and duration values must be numbers.';
        throw new Error(msg);
      }
    }

    if (typeof startTimeInWholeNotes === 'number') {
      args.push({ type: 'float', value: startTimeInWholeNotes });
      args.push({ type: 'float', value: durationInWholeNotes });
    }

    return { args, address: '/audiotrack/region/render' }
  },

  /**
   * Remove all clips (ex. audio, midi clips) from the selected audio track.
   */
  removeClips() {
    return { address: '/audiotrack/remove/clips' };
  },

  /**
   * Remove all automation from the track and from all the tracks plugins.
   */
  removeAutomation() {
    return { address: '/audiotrack/remove/automation'};
  },
}

module.exports = audiotrack;