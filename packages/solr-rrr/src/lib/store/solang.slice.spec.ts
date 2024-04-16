import {
  SolangReducer,
} from './solang.slice';

describe('solang reducer', () => {
  it('should handle initial state', () => {
    expect(SolangReducer(undefined, { type: 'unknown' })).toEqual({
      config: {},
      apps: {}
    });
  });
});


