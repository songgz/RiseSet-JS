describe("RiseSet-JS", function() {
	var one_hour, one_min, one_sec, one_millisec, one_arcmin, one_arcsec, tenth_arcsec;

	beforeEach(function() {
		one_hour     = 1/24;
		one_min      = 1/1440;
		one_sec      = 1/86400;
		one_millisec = 1/86400000;
		one_arcmin   = 1/60;
		one_arcsec   = 1/3600;
		tenth_arcsec = one_arcsec/10;
	});

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
	
	it("the nutations and obliquities of the ecliptic on 10 April 1987 should be close to the expected values", function() {
		var ajd = riseset.dateToAJD(new Date(1987,3,10));
		expect(riseset.nutationLongitude(ajd)).toBeCloseTo(-3.788/3600,tenth_arcsec);
		expect(riseset.nutationObliquity(ajd)).toBeCloseTo(9.443/3600,tenth_arcsec);
		expect(riseset.obliquityOfEcliptic(ajd)).toBeCloseTo(23+26/60+27.407/3600,tenth_arcsec);
		expect(riseset.trueObliquity(ajd)).toBeCloseTo(23+26/60+36.850/3600,tenth_arcsec);
	});
	
	it("the mean and apparent sidereal times on 10 April 1987 should be close to their expected values", function() {
		var ajd = riseset.dateToAJD(new Date(1987,3,10));
		expect(riseset.meanSiderealTime(ajd)).toBeCloseTo((13+10/60+46.3668/3600)*15,tenth_arcsec);
		expect(riseset.apparentSiderealTime(ajd)).toBeCloseTo((13+10/60+46.1351/3600)*15,tenth_arcsec);
	});
});
