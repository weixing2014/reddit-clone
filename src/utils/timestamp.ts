import { Timestamp } from 'firebase/firestore';
import moment from 'moment';

export const convertTimestampToFromNowText = (timestamp: Timestamp) => {
  return moment(new Date(timestamp.seconds * 1000)).fromNow();
};
