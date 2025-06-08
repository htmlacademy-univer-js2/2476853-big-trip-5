import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import duration from 'dayjs/plugin/duration';
import {FilterTypes} from '../const-values';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(duration);

const formatDate = (date, type) => date ? dayjs(date).format(type) : '';

const getDuration = (startDate, endDate) => {
  const differenceInMilliseconds = dayjs(endDate).diff(dayjs(startDate));
  const timeDuration = dayjs.duration(differenceInMilliseconds);

  const daysValue = Math.floor(timeDuration.asDays());
  const hoursValue = timeDuration.hours();
  const minutesValue = timeDuration.minutes();

  const days = daysValue > 0 ? `${String(daysValue).padStart(2, '0')}D ` : '';
  const hours = daysValue > 0 || hoursValue > 0 ? `${String(hoursValue).padStart(2, '0')}H ` : '';
  const minutes = `${String(minutesValue).padStart(2, '0')}M`;

  return `${days}${hours}${minutes}`.trim();
};

const filterByTime = {
  [FilterTypes.EVERYTHING]: (events) => events,
  [FilterTypes.FUTURE]: (events) => events.filter((event) => dayjs().isBefore(dayjs(event.dateFrom))),
  [FilterTypes.PRESENT]: (events) => events.filter(
    (event) => dayjs().isSameOrAfter(dayjs(event.dateFrom)) && dayjs().isSameOrBefore(dayjs(event.dateTo))
  ),
  [FilterTypes.PAST]: (events) => events.filter((event) => dayjs().isAfter(dayjs(event.dateTo)))
};

export {formatDate, getDuration, filterByTime};
