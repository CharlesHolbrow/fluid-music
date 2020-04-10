const should = require('should');
const mocha = require('mocha');
const tab = require('../src/tab');

describe('parseScore', () => {
  const noteLibrary = [0, 1, 2, 3, 4, 5, 6];

  const r =  '1234'
  const p1 = '.0..'
  const clip1 = [{ n: 0, s: 0.25, l: 0.25 }];
  clip1.startTime = 0;
  clip1.duration = 1;

  const p2 = '01..';
  const clip2 = [{ n: 0, s: 0, l: 0.25 }, { n:1, s: 0.25, l: 0.25 }];
  clip2.duration = 1;
  

  it('should parse a very simple object', () => {
    const obj = { noteLibrary, r, p1 }

    tab.parseScore(obj).should.containDeep({
      p1: {
        clips: [clip1],
      },
    });
  });

  it('should treat a pattern array with .length=1 the same as a single string', () => {
    const s1 = { noteLibrary, r, p1: [p1]};
    const s2 = { noteLibrary, r, p1: p1 };

    const result1 = tab.parseScore(s1);
    const result2 = tab.parseScore(s2);
    result1.should.containDeep({
      p1: { clips: [ clip1 ]}
    });

    delete result1.p1.originalValue;
    delete result2.p1.originalValue;

    result1.should.deepEqual(result2);
  });

  it('should handle arrays', () => {
    const s1 = { noteLibrary, r, drums: [
      '.0..',
      '.1..',
    ]};
    const result1 = tab.parseScore(s1);
    const clip1 = [{n: 0, s: 0.25, l: 0.25}];
    const clip2 = [{n: 1, s: 0.25, l: 0.25}];
    
    clip1.startTime = 0;
    clip2.startTime = 1;
    clip1.duration  = clip2.duration = 1;
    
    result1.should.containDeep({
      drums: {
        clips: [ clip1, clip2 ],
      }
    });
  });

  it('should handle nested objects');
  it('should handle nested arrays', () => {
    const s1 = { noteLibrary, r, drums: [
      ['0...', '1...'],
      '2...', '3...'
    ]};
    const clip0 = [{n: 0, s: 0, l: 0.25}]; clip0.startTime = 0;
    const clip1 = [{n: 1, s: 0, l: 0.25}]; clip1.startTime = 1;
    const clip2 = [{n: 2, s: 0, l: 0.25}]; clip2.startTime = 2;
    const clip3 = [{n: 3, s: 0, l: 0.25}]; clip3.startTime = 3;

    const result1 = tab.parseScore(s1);
    result1.should.containDeep({
      duration: 4,
      drums: {
        clips: [ clip0, clip1, clip2, clip3 ],
      }
    });
  });

  it('should handle arrays that contain objects', () => {
    const s1 = { noteLibrary, r, drums: [
      '1...',
      { k: '0.1.' },
      ['2...', '3...']
    ]};

    const clip0 = [{n: 1, s: 0, l: 0.25}]; clip0.startTime = 0;
    const clip1 = [{n: 0, s: 0, l: 0.25}, { n:1, s: 0.5, l: 0.25 }]; clip1.startTime = 1;
    const clip2 = [{n: 2, s: 0, l: 0.25}]; clip2.startTime = 2;
    const clip3 = [{n: 3, s: 0, l: 0.25}]; clip3.startTime = 3;

    const result1 = tab.parseScore(s1);
    result1.should.containDeep({
      duration: 4,
      drums: {
        clips: [ clip0, clip2, clip3 ],
        k: {
          clips: [ clip1 ]
        }
      }
    });
  });
});