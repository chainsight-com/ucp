import { CryptoPipe } from './crypto.pipe';

describe('CryptoPipe', () => {
  it('create an instance', () => {
    const pipe = new CryptoPipe();
    expect(pipe).toBeTruthy();
  });
});
