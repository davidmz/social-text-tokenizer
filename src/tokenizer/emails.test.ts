import { tokenize, Email } from './emails';
import { tableTest } from './test-helpers';

tableTest('emails', tokenize, [
  [
    'aa@bb.ru bb@xn--80aaazglcmlcj.xn--p1ai',
    [new Email(0, 'aa@bb.ru'), new Email(9, 'bb@xn--80aaazglcmlcj.xn--p1ai')],
  ],
  ['john+smith@gmail.com', [new Email(0, 'john+smith@gmail.com')]],
  ['freefeed.net@gmail.com', [new Email(0, 'freefeed.net@gmail.com')]],
  ['супер@окна.рф!!!', [new Email(0, 'супер@окна.рф')]],
]);

describe('Email class', () => {
  describe('pretty', () => {
    it('should not change regular email', () => {
      expect(new Email(0, 'user@example.com').pretty).toBe('user@example.com');
    });

    it('should de-punycode host part', () => {
      expect(new Email(0, 'user@xn--80aaazglcmlcj.xn--p1ai').pretty).toBe('user@замкинаокна.рф');
    });

    it('should not de-punycode user part', () => {
      expect(new Email(0, 'xn--p1ai@xn--80aaazglcmlcj.xn--p1ai').pretty).toBe(
        'xn--p1ai@замкинаокна.рф'
      );
    });
  });
});
