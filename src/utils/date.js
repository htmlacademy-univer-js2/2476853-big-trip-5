import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import duration from 'dayjs/plugin/duration';
import {FILTER_TYPES} from '../const-values';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(duration);

const formatDate = (date, type) => date ? dayjs(date).format(type) : '';

const getDuration = (startDate, endDate) => {
  const diffMs = dayjs(endDate).diff(dayjs(startDate));
  const dur = dayjs.duration(diffMs);
  const days = dur.days();
  const hours = dur.hours();
  const minutes = dur.minutes();
  const formattedDays = days > 0 ? `${String(days).padStart(2, '0')}D ` : '';
  const formattedHours = hours > 0 ? `${String(hours).padStart(2, '0')}H ` : '';
  const formattedMinutes = minutes > 0 ? `${String(minutes).padStart(2, '0')}M` : '';
  return `${formattedDays}${formattedHours}${formattedMinutes}`.trim();
};

const filterByTime = {
  [FILTER_TYPES.EVERYTHING]: (events) => events,
  [FILTER_TYPES.FUTURE]: (events) => events.filter((event) => dayjs().isBefore(dayjs(event.dateFrom))),
  [FILTER_TYPES.PRESENT]: (events) => events.filter(
    (event) => dayjs().isSameOrAfter(dayjs(event.dateFrom)) && dayjs().isSameOrBefore(dayjs(event.dateTo))
  ),
  [FILTER_TYPES.PAST]: (events) => events.filter((event) => dayjs().isAfter(dayjs(event.dateTo)))
};

export {formatDate, getDuration, filterByTime};
