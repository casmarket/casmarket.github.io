import { LitElement, html, css } from 'lit';
import yaml from 'js-yaml';

customElements.define('event-list', class extends LitElement {
	static styles = css`
		:host {
			--heading-color: #FAFAFA;
			--heading2: url("heading2.png");
		}

		div {
			display: grid;
			grid-template-columns: auto auto;
			justify-content: center;
			gap: 1em;
		}

		img {
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
		return html`<link rel="stylesheet" href="common.css" />
		<nav>${[ '常設', '季節' ].map(heading => html`<h2>${heading}</h2>
			<div>${this.eventIdNamePairs.filter(({permanent}) => heading === '常設' ? permanent : !permanent)
				.map(({ id, name }) => html`
					<a href="./${id}/"><img src="${id}/images/casmarket-${id}-poster-wide.png" alt="${name}" /></a>
				`)}
			</div>`)}</nav>`;
	}
});
