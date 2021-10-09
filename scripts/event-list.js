import { LitElement, html, css } from 'lit';
import yaml from 'js-yaml';

customElements.define('event-list', class extends LitElement {
	static styles = css`
		nav {
			display: grid;
			grid-template-columns: auto auto;
			justify-content: center;
			gap: 1em;
		}

		nav a img {
			width: 20em;
			border-style: solid;
		}
	`;

	static properties = {
		eventIdNamePairs: { attribute: false },
	};

	constructor()
	{
		super();

		this.eventIdNamePairs = [ ];
		(async () => {
			this.eventIdNamePairs = yaml.load(await (await fetch('events.yaml')).text());
		})();
	}

	render()
	{
		return html`<nav>${this.eventIdNamePairs.map(({ id, name }) => html`
			<a href="./${id}/"><img src="${id}/images/casmarket-${id}-poster-wide.png" alt="${name}" /></a>
		`)}</nav>`;
	}
});
