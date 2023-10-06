import moment from "moment";
import { utcTimeString } from "~/configs";

const parseUTC = (date, format = null) => {
  if (!date) return ''
  return moment(date)
    .format(format ? format : utcTimeString);
}
export default parseUTC;
