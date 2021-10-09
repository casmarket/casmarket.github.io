const LOCALE = 'ja';

/**
 * 日時を読みやすい表記で返します。
 * @param {Object} params
 * @param {Date} params.date
 * @param {boolean} params.ending
 * @param {boolean} params.displayYear
 * @param {boolean} params.displayTime
 * @returns {string}
 */
export function toHumanReadable({ date, ending, displayYear, displayTime })
{
	if (ending) {
		// 1秒前に (dateTimeが翌日の00:00:00なら23:59:59に)
		date.setSeconds(date.getSeconds() - 1);
	}
	const options = { month: 'long', day: 'numeric', weekday: 'short' };
	if (displayYear) {
		Object.assign(options, { year: 'numeric' });
	}
	if (displayTime) {
		Object.assign(options, { hour: '2-digit', minute: '2-digit' });
	}
	return date.toLocaleString(LOCALE, options);
}
