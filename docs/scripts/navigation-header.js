import { LitElement, html, css } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import yaml from 'js-yaml';

customElements.define('navigation-header', class extends LitElement {
	static styles = css`
		:host {
			font-size: 0.8em;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			display: flex;
			justify-content: center;
			background: var(--color);
			color: var(--heading-color);
		}

		:host > div {
			display: flex;
			width: min(var(--width), 100%);
			justify-content: space-between;
			position: relative;
		}

		:host .events summary {
			list-style: none;
			cursor: pointer;
		}

		:host .events summary::after {
			content: "◂";
			margin-left: 0.5em;
		}

		:host .events [open] summary::after {
			content: "▾";
		}

		:host .events ol {
			position: absolute;
			right: 0;
			background: var(--color);
			list-style: none;
			margin: unset;
			padding: unset;
			text-align: left;
		}

		:host .events li {
			margin: 1em;
		}

		:host a {
			color: inherit;
			font-weight: inherit;
		}
	`;

	static properties = {
		eventId: { type: String },
		anchorId: { type: String },
		anchorLinkText: { type: String },
		eventIdNamePairs: { attribute: false },
	};

	constructor()
	{
		super();

		this.eventIdNamePairs = [ ];
		(async () => {
			this.eventIdNamePairs = yaml.load(await (await fetch('../events.yaml')).text());
		})();

		this.anchorId = 'catalogue';
		this.anchorLinkText = 'カタログ';
	}

	render()
	{
		return html`<div>
			<nav>
				<a href="../">キャスポータル</a>
			</nav>
			<nav>
				<a href="#${this.anchorId}">${this.anchorLinkText}</a>
			</nav>
			<nav class="events">
				<details>
					<summary>イベント一覧</summary>
					<ol>${this.eventIdNamePairs && this.eventIdNamePairs.map(({ id, name }) => html`
						<li><a href="../${ifDefined(id !== this.eventId ? id : null)}/">${name}</a></li>
					`)}</ol>
				</details>
			</nav>
		</div>`;
	}
});
