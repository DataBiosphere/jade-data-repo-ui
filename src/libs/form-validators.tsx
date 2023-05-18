import _ from 'lodash';
import isEmail from 'validator/lib/isEmail';

export const isValidEmail = (emails: string[]) => {
  const emailErrors = _.filter(emails, (v: string) => !isEmail(v));
  return emailErrors.length === 0 || `Invalid emails: "${emailErrors.join('", "')}"`;
};
