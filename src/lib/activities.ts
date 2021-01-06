/**
 * The math in this file is ported from GWToolboxpp's source (https://github.com/HasKha/GWToolboxpp/blob/master/GWToolboxdll/Windows/DailyQuestsWindow.cpp)
 * @todo make it more robust with date-fns
 */

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const MILLISECONDS_PER_WEEK = MILLISECONDS_PER_DAY * 7;

import nicholasSandford from '../../assets/activities/nicholas-sandford.json';
import nicholasTheTraveler from '../../assets/activities/nicholas-the-traveler.json';
import pveBonus from '../../assets/activities/pve-bonus.json';
import pvpBonus from '../../assets/activities/pvp-bonus.json';
import vanguard from '../../assets/activities/vanguard.json';
import wanted from '../../assets/activities/wanted.json';
import zaishenBounty from '../../assets/activities/zaishen-bounty.json';
import zaishenCombat from '../../assets/activities/zaishen-combat.json';
import zaishenMission from '../../assets/activities/zaishen-mission.json';
import zaishenVanquish from '../../assets/activities/zaishen-vanquish.json';
import { intervalToDuration } from 'date-fns';

export const ACTIVITIES = {
    'nicholas-sandford': {
        data: nicholasSandford,
        startDate: new Date(1239260400000),
        period: MILLISECONDS_PER_DAY,
    },
    'nicholas-the-traveler': {
        data: nicholasTheTraveler,
        startDate: new Date(1323097200000),
        period: MILLISECONDS_PER_WEEK,
    },
    'pve-bonus': {
        data: pveBonus,
        startDate: new Date(1368457200000),
        period: MILLISECONDS_PER_WEEK,
    },
    'pvp-bonus': {
        data: pvpBonus,
        startDate: new Date(1368457200000),
        period: MILLISECONDS_PER_WEEK,
    },
    'vanguard': {
        data: vanguard,
        startDate: new Date(1276012800000),
        period: MILLISECONDS_PER_DAY,
    },
    'wanted': {
        data: wanted,
        startDate: new Date(1276012800000),
        period: MILLISECONDS_PER_DAY,
    },
    'zaishen-bounty': {
        data: zaishenBounty,
        startDate: new Date(1299168000000),
        period: MILLISECONDS_PER_DAY,
    },
    'zaishen-combat': {
        data: zaishenCombat,
        startDate: new Date(1256227200000),
        period: MILLISECONDS_PER_DAY,
    },
    'zaishen-mission': {
        data: zaishenMission,
        startDate: new Date(1299168000000),
        period: MILLISECONDS_PER_DAY,
    },
    'zaishen-vanquish': {
        data: zaishenVanquish,
        startDate: new Date(1299168000000),
        period: MILLISECONDS_PER_DAY,
    },
};

export function getActivity<T extends keyof typeof ACTIVITIES>(type: T, date: Date = new Date()): typeof ACTIVITIES[T]['data'][0] {
    const { data, startDate, period } = ACTIVITIES[type];
    const index = getIndex(data, startDate, period, date);
    return data[index];
}

export function getActivityMeta<T extends keyof typeof ACTIVITIES>(type: T, date: Date = new Date()): {
    activity: typeof ACTIVITIES[T]['data'][0],
    startDate: Date,
    endDate: Date,
    weeklyCountdown: string,
    dailyCountdown: string,
} {
    const { data, startDate, period } = ACTIVITIES[type];
    const index = getIndex(data, startDate, period, date);
    const endDate = getActivityEndDate(type, date);
    return {
        activity: data[index],
        startDate: getActivityStartDate(type, date),
        endDate: getActivityEndDate(type, date),
        weeklyCountdown: getWeeklyCountdown(endDate),
        dailyCountdown: getDailyCountdown(endDate),
    };
}

// @fixme using a generic type for data messes with the functions above, will have to look into this and clean up
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getIndex(data: any[], startDate: Date, period: number, date: Date) {
    const elapsedTime = date.getTime() - startDate.getTime();
    const elapsedRotations = Math.floor(elapsedTime / period);
    return elapsedRotations % data.length;
}

function getActivityStartDate<T extends keyof typeof ACTIVITIES>(type: T, date: Date) {
    const { startDate, period } = ACTIVITIES[type];
    const elapsedTime = date.getTime() - startDate.getTime();
    const timestamp = Math.floor(elapsedTime / period) * period + startDate.getTime();
    return new Date(timestamp);
}

function getActivityEndDate<T extends keyof typeof ACTIVITIES>(type: T, date: Date) {
    const { startDate, period } = ACTIVITIES[type];
    const elapsedTime = date.getTime() - startDate.getTime();
    const timestamp = Math.floor(elapsedTime / period) * period + startDate.getTime() + period;
    return new Date(timestamp);
}

function getWeeklyCountdown(endDate: Date) {
    const now = new Date();
    const { days } = intervalToDuration({
        start: now,
        end: endDate,
    });
    return `${days} days, ${getDailyCountdown(endDate)}`;
}

function getDailyCountdown(endDate: Date) {
    const now = new Date();
    const { hours, minutes, seconds } = intervalToDuration({
        start: now,
        end: endDate,
    });
    return `${hours}h ${minutes}m`;
}
