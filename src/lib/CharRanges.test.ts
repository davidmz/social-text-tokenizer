import CharRanges from './CharRanges';

describe('CharRanges', () => {
  let cr: CharRanges;
  beforeEach(() => (cr = new CharRanges()));

  describe('add', () => {
    it('should add range duroing initialization', () => {
      const cr = new CharRanges([1, 2]);
      expect(cr.ranges).toEqual([[1, 2]]);
    });

    it('should add range', () => {
      cr.add([1, 2]);
      expect(cr.ranges).toEqual([[1, 2]]);
    });

    it('should add range without explicit end', () => {
      cr.add(1);
      expect(cr.ranges).toEqual([[1, 1]]);
    });

    it('should add range with incorrect code order', () => {
      cr.add([2, 1]);
      expect(cr.ranges).toEqual([[1, 2]]);
    });

    it('should merge adjacent ranges', () => {
      cr.add([2, 1]);
      expect(cr.ranges).toEqual([[1, 2]]);
    });

    it('should not add range contained in existing ranges', () => {
      cr.add([1, 10], [1, 5], [2, 5], [2, 10]);
      expect(cr.ranges).toEqual([[1, 10]]);
    });

    it('should extend existing ranges', () => {
      cr.add([1, 10], [2, 15]);
      expect(cr.ranges).toEqual([[1, 15]]);
    });

    it('should extend existing ranges to left', () => {
      cr.add([3, 10]);
      cr.add([1, 5]);
      expect(cr.ranges).toEqual([[1, 10]]);
    });

    it('should add non-overlaping range', () => {
      cr.add([1, 5]);
      cr.add([7, 10]);
      expect(cr.ranges).toEqual([[1, 5], [7, 10]]);
    });

    it('should join range if overlapped', () => {
      cr.add([1, 5]);
      cr.add([7, 10]);
      cr.add([4, 7]);
      expect(cr.ranges).toEqual([[1, 10]]);
    });
  });

  describe('addChars', () => {
    it('should add chars from string', () => {
      cr.addChars('123');
      expect(cr.ranges).toEqual([[49, 51]]);
    });
  });

  describe('remove', () => {
    it('should not remove range if it outside of existing ranges', () => {
      cr.add([1, 5], [6, 7]);
      cr.remove([8, 10]);
      expect(cr.ranges).toEqual([[1, 7]]);
    });

    it('should remove existing range if it is overlapped by range to remove', () => {
      cr.add([1, 5], [7, 9]);
      cr.remove([6, 9]);
      expect(cr.ranges).toEqual([[1, 5]]);
    });

    it('should remove existing ranges if they are overlapped by range to remove', () => {
      cr.add([1, 5], [7, 9]);
      cr.remove([1, 9]);
      expect(cr.ranges).toEqual([]);
    });

    it('should shrink existing range at right if it is partially overlapped by range to remove', () => {
      cr.add([1, 5]);
      cr.remove([3, 9]);
      expect(cr.ranges).toEqual([[1, 2]]);
    });

    it('should shrink existing range at left if it is partially overlapped by range to remove', () => {
      cr.add([1, 5]);
      cr.remove([1, 3]);
      expect(cr.ranges).toEqual([[4, 5]]);
    });

    it('should split existing range if removed area is inside it', () => {
      cr.add([1, 5]);
      cr.remove([2, 3]);
      expect(cr.ranges).toEqual([[1, 1], [4, 5]]);
    });

    it('should remove multiple ranges', () => {
      cr.add([1, 5], [7, 9], [11, 15]);
      cr.remove([2, 3], 8, [12, 15]);
      expect(cr.ranges).toEqual([[1, 1], [4, 5], [7, 7], [9, 9], [11, 11]]);
    });
  });

  describe('toString', () => {
    it('should return string representation of ranges', () => {
      cr.add([1, 5]);
      cr.add(7);
      cr.add([9, 10]);
      expect(cr.toString()).toBe('\\u0001-\\u0005\\u0007\\u0009-\\u000a');
    });
  });
});
