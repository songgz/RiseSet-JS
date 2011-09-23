/* Jasmine specifications for RiseSet-JS
 * Murtaza Gulamali
 *
 * Expected values taken from Meeus, J. (1991) Astronomical Algorithms, William-Bell Inc.,
 * Richmond, VA, USA. ISBN: 0943396352
 */

describe("RiseSet-JS", function() {
	// define levels of accuracy for test functions
	var one_hour, one_min, one_sec, one_millisec, one_arcmin, one_arcsec, tenth_arcsec;

	beforeEach(function() {
		one_hour     = 1/24;
		one_min      = 1/1440;
		one_sec      = 1/86400;
		one_millisec = one_sec/1000;
		one_arcmin   = 1/60;
		one_arcsec   = 1/3600;
		tenth_arcsec = one_arcsec/10;
	});

	// Examples 7a, 7b and subsequent table
	it("the Astronomical Julian dates should be close to their corresponding dates", function() {
		var dates = [ 1957,  9,  4.81, 2436116.31,
		               333,  0, 27.5,  1842713.0,
		              2000,  0,  1.5,  2451545.0,
		              1987,  0, 27.0,  2446822.5,
		              1987,  5, 19.5,  2446966.0,
		              1988,  0, 27.0,  2447187.5,
		              1988,  5, 19.5,  2447332.0,
		              1900,  0,  1.0,  2415020.5,
		              1600,  0,  1.0,  2305447.5,
		              1600, 11, 31.0,  2305812.5,
		               837,  3, 10.3,  2026871.8,
		             -1000,  6, 12.5,  1356001.0,
		             -1000,  1, 29.0,  1355866.5,
		             -1001,  7, 17.9,  1355671.4,
		             -4712,  0,  1.5,        0.0];
		var date;
		for (var i=0, ii=dates.length/4; i<ii; i+=4) {
			h  = (dates[i+2]-Math.floor(dates[i+2]))*24;
			m  = (h-Math.floor(h))*60;
			s  = (m-Math.floor(m))*60;
			ms = (s-Math.floor(s))*1000;
			date = new Date(dates[i],dates[i+1],dates[i+2],h,m,s,ms);
			expect(riseset.dateToAJD(date)).toBeCloseTo(dates[i+3],one_millisec);
		}
	});
	
	// Example 7c and subsequent exercise
	it("the dates should match their corresponding Astronomical Julian Dates", function() {
		var dates = [2436116.31, 1957, 9,  4, 19, 26, 24, 0,
		             1842713.0,   333, 0, 27, 12,  0,  0, 0,
		             1507900.13, -584, 4, 28, 15,  7, 12, 0];
		var date;
		for (var i=0, ii=dates.length/8; i<ii; i+=8) {
			date = riseset.AJD_ToDate(dates[i]);
			expect(date.getFullYear()).toEqual(dates[i+1]);
			expect(date.getMonth()).toEqual(dates[i+2]);
			expect(date.getDate()).toEqual(dates[i+3]);
			expect(date.getHours()).toEqual(dates[i+4]);
			expect(date.getMinutes()).toEqual(dates[i+5]);
			expect(date.getSeconds()).toEqual(dates[i+6]);
			expect(date.getMilliseconds()).toEqual(dates[i+7]);
		}
	});
	
	// Example 21a
	it("the nutations and obliquities of the ecliptic on 10 April 1987 should be close to the expected values", function() {
		var ajd = riseset.dateToAJD(new Date(1987,3,10));
		expect(riseset.nutationLongitude(ajd)).toBeCloseTo(-3.788/3600,tenth_arcsec);
		expect(riseset.nutationObliquity(ajd)).toBeCloseTo(9.443/3600,tenth_arcsec);
		expect(riseset.obliquityOfEcliptic(ajd)).toBeCloseTo(23+26/60+27.407/3600,tenth_arcsec);
		expect(riseset.trueObliquity(ajd)).toBeCloseTo(23+26/60+36.850/3600,tenth_arcsec);
	});
	
	// Example 11a
	it("the mean and apparent sidereal times on 10 April 1987 should be close to their expected times", function() {
		var ajd = riseset.dateToAJD(new Date(1987,3,10));
		expect(riseset.meanSiderealTime(ajd)).toBeCloseTo((13+10/60+46.3668/3600)*15,tenth_arcsec);
		expect(riseset.apparentSiderealTime(ajd)).toBeCloseTo((13+10/60+46.1351/3600)*15,tenth_arcsec);
	});

	// Example 11b
	it("the mean sidereal time at 19:21 on 10 April 1987 should be close to its expected time", function() {
		var ajd = riseset.dateToAJD(new Date(1987,3,10,19,21));
		expect(riseset.meanSiderealTime(ajd)).toBeCloseTo(128.7378734,tenth_arcsec);
	});
	
	// Example 24a
	it("the apparent position of the Sun on 13 October 1992 should be close to its expected position", function() {
		var ajd = riseset.dateToAJD(new Date(1992,9,13));
		var position = riseset.solarPosition(ajd);
		expect(position[0]).toBeCloseTo(-161.61918,tenth_arcsec);
		expect(position[1]).toBeCloseTo(-7.78507,tenth_arcsec);
	});
});
