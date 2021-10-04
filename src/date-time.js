import { LitElement, html } from 'lit';

const LOCALE = 'ja';

customElements.define('date-time', class extends LitElement {
	static properties = {
		dateTime: { converter: {
			fromAttribute: value => new Date(value),
			toAttribute: value => value.toISOString(),
		} },
		displayYear: { type: Boolean },
		displayTime: { type: Boolean },
		ending: { type: Boolean },
	};

	render()
	{
		const date = new Date(this.dateTime);
		if (this.ending) {
			// 1秒前に (dateTimeが翌日の00:00:00なら23:59:59に)
			date.setSeconds(date.getSeconds() - 1);
		}
		const options = { month: 'long', day: 'numeric', weekday: 'short' };
		if (this.displayYear) {
			Object.assign(options, { year: 'numeric' });
		}
		if (this.displayTime) {
			Object.assign(options, { hour: '2-digit', minute: '2-digit' });
		}
		return html`<time datetime="${this.dateTime.toISOString()}">${date.toLocaleString(LOCALE, options)}</time>`;
	}
});
