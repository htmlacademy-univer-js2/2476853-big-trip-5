import dayjs from 'dayjs';

const DATE_FORMAT = 'D MMM';

const formatDate = (date) => date ? dayjs(date).format(DATE_FORMAT) : '';

const getDuration = (startDate, endDate) => dayjs(endDate).diff(startDate, 'd');

export {formatDate, getDuration};
