import moment from 'moment';

export function convertBirthday(birthday) {
  return moment(birthday).utc().format('DD MMMM YYYY');
}
