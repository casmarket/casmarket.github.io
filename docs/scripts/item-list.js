import { LitElement, html, css } from 'lit';

customElements.define('item-list', class extends LitElement {
	static styles = css`
		#frontier #simple  {
			--work-count: 0;
		}
		section > section > h1  {
			text-align: left;
			position: relative;
			left: 2em;
		}
		section > section > h1 > img {
			width: 50%;
		}
		table {
			margin: 0 auto;
		}
		thead {
			display: none;
		}
		tbody {
				--grid-width: 100vw;
				grid-template-columns: auto;
			}

		tbody tr {
			display: grid;
			--gap: 0.2em;
			--no-width: 3em;
			--ratio-name-to-icon: 1.5;
			--icon-size: min(
				calc((var(--grid-width) - var(--gap) * 2 - var(--no-width)) / (1 + var(--ratio-name-to-icon))),
				4.5em
			);
			--grid-height: max(calc(var(--icon-size)), 1.5em);
			grid-template:
				"id icon name work1 twitter seed" var(--grid-height);
			gap: var(--gap);
			margin-bottom: 1em;
		}
		tbody tr > * {
			background: var(--header-color);
			display: flex;
			align-items: center;
			justify-content: center;
		}
		tbody tr a {
			max-width: 100%;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.id {
			grid-area: id;
		}
		.icon {
			grid-area: icon;
			background: unset;
		}
		.icon img {
			width: 100%;
		}
		.name {
			grid-area: name;
		}
		.badge img {
			height: 1.5em;
			margin-right: 0.2em;
		}
		.twitter {
			grid-area: twitter;
			margin-right: 0.2em;
		}
		.twitter img {
			height: 1.5em;
		}
		.seed {
			grid-area: seed;
			margin-right: 0.2em;
		}
		.seed img {
			height: 1.5em;
		}
		.work {
			grid-area: work;
		}
	`;

	static properties = {
		catalogue: { attribute: false },
	};

	constructor()
	{
		super();
		this.catalogue = [ ];
		(async () => {
			this.catalogue = await (await fetch('catalogue.json')).json();
		})();
	}


	render()
	{
		return [
			[ 'theme1', 'テーマ会場', '1. 機能' ],
			[ 'theme2', 'テーマ会場', '2. 機能' ],
			[ 'simple', 'シンプル会場', null ],
		].map(([ classId, heading, subHeading ]) => html`<section>
			<h1><img src="../images/heading-${classId}.png" alt="${heading} ${subHeading}" /></h1>
			<a target="_blank" href="images/map-${classId}.png"><img src="images/map-${classId}.png" /></a>
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>アイコン</th>
						<th>バッヂ</th>
						<th>出展者</th>
						<th>作品</th>
						<th>Twitter</th>
						<th>THE SEED ONLINE</th>
					</tr>
				</thead>
				<tbody>${this.catalogue.filter(item => item.classId === classId).map(item => html`<tr>
					<th class="id">${item.id}</th>
					<td class="icon"><img src="${item.exhibitor.icon}" /></td>
					<td class="badge">
						${item.badge && html`<img src="../images/${item.badge}.png" alt="${item.badge}" />`}
					</td>
					<td class="name">
						<a rel="external" target="_blank" href="${item.exhibitor.twitterURL}">${item.exhibitor.name}</a>
					</td>
					<td class="item">${ classId === 'simple'
						? html`<a rel="external" target="_blank" href="${item.item.url}">${item.item.title} </a>`
						: null}</td>
					<td class="twitter">
						<a rel="external" target="_blank" href="${item.exhibitor.twitterURL}">
							<img src="../images/twitter-logo.png" alt="Twitter" />
						</a>
					</td>
					<td class="seed">
						<a rel="external" target="_blank" href="${item.exhibitor.tsoURL}">
							<img src="../images/theseedonline-logo.png" alt="THE SEED ONLINE" />
						</a>
					</td>
				</tr>`)}</tbody>
			</table>
		</section>`);
	}
});
