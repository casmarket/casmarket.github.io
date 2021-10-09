import { LitElement, html } from 'lit';
import * as dates from './dates.js';

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
		return html`<time datetime="${this.dateTime.toISOString()}">${dates.toHumanReadable({
			date,
			ending: this.ending,
			displayYear: this.displayYear,
			displayTime: this.displayTime,
		})}</time>`;
	}
});
