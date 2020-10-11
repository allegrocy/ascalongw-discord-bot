/**
 * The math in this file is ported from GWToolboxpp's source (https://github.com/HasKha/GWToolboxpp/blob/master/GWToolboxdll/Windows/DailyQuestsWindow.cpp)
 * @todo make it more robust with date-fns
 */

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const MILLISECONDS_PER_WEEK = MILLISECONDS_PER_DAY * 7;

const ACTIVITIES = {
    'nicholas-sandford': {
        data: require('./activities/nicholas-sandford.json'),
        startDate: new Date(1239260400000),
        period: MILLISECONDS_PER_DAY,
    },
    'nicholas-the-traveler': {
        data: require('./activities/nicholas-the-traveler.json'),
        startDate: new Date(1323097200000),
        period: MILLISECONDS_PER_WEEK,
    },
    'pve-bonus': {
        data: require('./activities/pve-bonus.json'),
        startDate: new Date(1368457200000),
        period: MILLISECONDS_PER_WEEK,
    },
    'pvp-bonus': {
        data: require('./activities/pvp-bonus.json'),
        startDate: new Date(1368457200000),
        period: MILLISECONDS_PER_WEEK,
    },
    'vanguard': {
        data: require('./activities/vanguard.json'),
        startDate: new Date(1276012800000),
        period: MILLISECONDS_PER_DAY,
    },
    'wanted': {
        data: require('./activities/wanted'),
        startDate: new Date(1276012800000),
        period: MILLISECONDS_PER_DAY,
    },
    'zaishen-bounty': {
        data: require('./activities/zaishen-bounty.json'),
        startDate: new Date(1299168000000),
        period: MILLISECONDS_PER_DAY,
    },
    'zaishen-combat': {
        data: require('./activities/zaishen-combat.json'),
        startDate: new Date(1256227200000),
        period: MILLISECONDS_PER_DAY,
    },
    'zaishen-mission': {
        data: require('./activities/zaishen-mission.json'),
        startDate: new Date(1299168000000),
        period: MILLISECONDS_PER_DAY,
    },
    'zaishen-vanquish': {
        data: require('./activities/zaishen-vanquish.json'),
        startDate: new Date(1299168000000),
        period: MILLISECONDS_PER_DAY,
    },
};

module.exports.getActivity = function getActivity(type, date) {
    const checkDate = date || new Date();
    const { data, startDate, period } = ACTIVITIES[type];
    const index = getIndex(data, startDate, period, checkDate);
    return data[index];
};

module.exports.getActivityMeta = function getActivityMeta(type, date) {
    const checkDate = date || new Date();
    const { data, startDate, period } = ACTIVITIES[type];
    const index = getIndex(data, startDate, period, checkDate);
    return {
        activity: data[index],
        startDate: getActivityStartDate(type, checkDate),
        endDate: getActivityEndDate(type, checkDate),
    };
};

function getIndex(data, startDate, period, date) {
    const elapsedTime = date.getTime() - startDate.getTime();
    const elapsedRotations = Math.floor(elapsedTime / period);
    return elapsedRotations % data.length;
}

function getActivityStartDate(type, date) {
    const { startDate, period } = ACTIVITIES[type];
    const elapsedTime = date.getTime() - startDate.getTime();
    const timestamp = Math.floor(elapsedTime / period) * period + startDate.getTime();
    return new Date(timestamp);
}

function getActivityEndDate(type, date) {
    const { startDate, period } = ACTIVITIES[type];
    const elapsedTime = date.getTime() - startDate.getTime();
    const timestamp = Math.floor(elapsedTime / period) * period + startDate.getTime() + period;
    return new Date(timestamp);
}