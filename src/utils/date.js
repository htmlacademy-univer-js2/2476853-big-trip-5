import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import {FILTER_TYPES} from '../const-values';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const formatDate = (date, type) => date ? dayjs(date).format(type) : '';

const getDuration = (startDate, endDate) => dayjs(endDate).diff(startDate, 'd');

const filterByTime = {
  [FILTER_TYPES.EVERYTHING]: (events) => events,
  [FILTER_TYPES.FUTURE]: (events) => events.filter((event) => dayjs().isBefore(dayjs(event.dateFrom))),
  [FILTER_TYPES.PRESENT]: (events) => events.filter(
    (event) => dayjs().isSameOrAfter(dayjs(event.dateFrom)) && dayjs().isSameOrBefore(dayjs(event.dateTo))
  ),
  [FILTER_TYPES.PAST]: (events) => events.filter((event) => dayjs().isAfter(dayjs(event.dateTo)))
};

export {formatDate, getDuration, filterByTime};
