/* Jasmine helper functions for RiseSet-JS
 * Murtaza Gulamali
 */

beforeEach(function() {
  this.addMatchers({
    toBeCloseTo: function(expectedValue,error) {
      var observedValue = this.actual;
      return (observedValue >= expectedValue-error)
          && (observedValue <= expectedValue+error);
    }
  })
});
