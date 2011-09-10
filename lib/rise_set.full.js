/* RiseSet-JS - Full Version
 * Copyright (c) 2011 Murtaza Gulamali under the terms of the MIT License.
 */
 
/* global namespace */
var riseset = {};

/* degrees/radians conversion functions */
riseset.d2r = function(x) { return 0.0174532925199433*x };
riseset.r2d = function(x) { return 57.2957795130823*x };

/* is the specified Date in the Julian calendar (ie. before 5 October 1582)? */
riseset.isJulian = function(date) {
	if (date.getFullYear()<1582) {
		return true;
	} else if (date.getFullYear()==1582) {
		if (date.getMonth()<10) {
			return true;
		} else if (date.getMonth()==10) {
			if (date.getDate()<5) {
				return true;
			}
		}
	}
	return false;
};

/* Astronomical Julian date corresponding to specified Date */
riseset.dateToAJD = function(date) {
	var y = date.getFullYear(), m = date.getMonth()+1, a, b;
	var d = date.getDate()+date.getHours()/24+date.getMinutes()/1440+date.getSeconds()/86400+date.getMilliseconds()/86400000;
	if (m<3) {
		y--;
		m += 12;
	}
	riseset.isJulian(date) ? (b = 0) : (a = Math.floor(y/100), b = 2-a+Math.floor(a/4));
	return Math.floor(365.25*(y+4716)) + Math.floor(30.6001*(m+1)) + d + b - 1524.5;
};

/* Date corresponding to specified Astronomical Julian date */
riseset.AJD_ToDate = function(ajd) {
	var a, b, c, d, e, f, z, alpha, m, y;
	z = Math.floor(ajd+0.5);
	f = (ajd+0.5-z);
	if (z<2299161) {
		a = z;
	} else {
		alpha = Math.floor((z-1867216.25)/36524.25);
		a = z+1+alpha-Math.floor(alpha/4);
	}
	b = a + 1524;
	c = Math.floor((b-122.1)/365.25);
	d = Math.floor(365.25*c);
	e = Math.floor((b-d)/30.6001);
	var day = b-d-Math.floor(30.6001*e)+f;
	var hrs = (day-Math.floor(day))*24;
	var min = (hrs-Math.floor(hrs))*60;
	var sec = (min-Math.floor(min))*60;
	var msc = (sec-Math.floor(sec))*1000;
	(e<14) ? (m = e-2) : (m = e-14);
	(m<2) ? (y = c-4715) : (y = c-4716);
	return new Date(y,m,day,hrs,min,sec,msc);
};

/* mean anomaly of the Sun (Earth) [degrees] */
riseset.solarMeanAnomaly = function(ajd) {
	var t = (ajd-2451545.0)/36525;
	return (357.52772 + 35999.050340*t - 0.0001603*t*t - t*t*t/300000);
};

/* mean anomaly of the Moon [degrees] */
riseset.lunarMeanAnomaly = function(ajd) {
	var t = (ajd-2451545.0)/36525;
	return (134.96298 + 477198.867398*t + 0.0086972*t*t + t*t*t/56250);
};


/* nutation in longitude [degrees] */
riseset.nutationLongitude = function(ajd) {
	var t = (ajd-2451545.0)/36525;
	var o = riseset.d2r(125.04452 - 1934.136261*t + 0.0020708*t*t + t*t*t/45000);
	var l = riseset.d2r(280.4665 + 36000.7698*t);
	var lp = riseset.d2r(218.3165 + 481267.8813*t);
	return (-17.20*Math.sin(o) - 1.32*Math.sin(2*l) - 0.23*Math.sin(2*lp) + 0.21*Math.sin(2*o))/3600;
};

/* nutation in obliquity [degrees] */
riseset.nutationObliquity = function(ajd) {
	var t = (ajd-2451545.0)/36525;
	var o = riseset.d2r(125.04452 - 1934.136261*t + 0.0020708*t*t + t*t*t/45000);
	var l = riseset.d2r(280.4665 + 36000.7698*t);
	var lp = riseset.d2r(218.3165 + 481267.8813*t);
	return (9.20*Math.cos(o) + 0.57*Math.cos(2*l) + 0.10*Math.cos(2*lp) - 0.09*Math.cos(2*o))/3600;
};

/* nutation in right ascension [degrees] */
riseset.nutationRightAscension = function(ajd) {
	return (riseset.nutationLongitude(ajd)*Math.cos(riseset.d2r(riseset.trueObliquity(ajd))));
};

/* obliquity of the ecliptic [degrees] */
riseset.obliquityOfEcliptic = function(ajd) {
	var t = (ajd-2451545.0)/36525;
	return (23+26/60+21.448/3600 - 46.8150/3600*t - 0.00059/3600*t*t + 0.001813/3600*t*t*t);
};

/* true obliquity [degrees] */
riseset.trueObliquity = function(ajd) {
	return riseset.obliquityOfEcliptic(ajd) + riseset.nutationObliquity(ajd);
};

/* mean sidereal time at Greenwich [degrees] */
riseset.meanSiderealTime = function(ajd) {
	var t = (ajd-2451545.0)/36525;
	var m = (280.46061837 + 360.98564736629*(ajd-2451545.0) + 0.000387933*t*t - t*t*t/38710000) % 360;
	if (m<0) {
		m += 360;
	}
	return m;
};

/* apparent sidereal time at Greenwich [degrees] */
riseset.apparentSiderealTime = function(ajd) {
	return riseset.meanSiderealTime(ajd)+riseset.nutationRightAscension(ajd);
};
