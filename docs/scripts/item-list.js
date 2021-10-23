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
		.badge {
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
			this.catalogue = await (await fetch('../6/catalogue.json')).json();
			console.log(this.catalogue);
		})();
	}


	render()
	{
		return html`<section id="frontier">
		<h1>ルーム会場「オリンピア」</h1>
		<section>
			<h1><img src="images/theme-logp1.png" alt="機能" /></h1>
			<a target="_blank" href="../images/room1-map.png"><img src="../images/room1-map.png" /></a>
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>アイコン</th>
						<th>名前</th>
					</tr>
				</thead>
				<tbody>
					${this.catalogue && this.catalogue.filter(participant => participant.classId.includes('theme1'))
					.map(participant => html`<tr>
					<th class="id">${participant.id}</th>
					<td class="icon"><img src="${participant.exhibitor.icon}" /></td>
					<td class="name">
						<img src="../images/${participant.badge}.png" alt="[${participant.badge}]" class="badge" />
						<a rel="external" target="_blank" href="${participant.exhibitor.twitterURL}">
						${participant.exhibitor.name}</a>
					</td>
					<td class="twitter">
						<a rel="external" target="_blank" href="${participant.exhibitor.twitterURL}">
							<img src="../images/twitter-logo.png" alt="Twitter" />
						</a>
					</td>
					<td class="seed">
						<a rel="external" target="_blank" href="${participant.exhibitor.tsoURL}">
							<img src="../images/theseedonline-logo.png" alt="THE SEED ONLINE" />
						</a>
					</td>
				</tr>`)}
				</tbody>
			</table>
		</section>
		<section>
			<h1><img src="images/theme-logp2.png" alt="装飾" /></h1>
			<a target="_blank" href="images/room2-map.png"><img src="images/room2-map.png" /></a>
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>アイコン</th>
						<th>名前</th>
					</tr>
				</thead>
				<tbody>
					${this.catalogue && this.catalogue.filter(participant => participant.classId.includes('theme2'))
					.map(participant => html`<tr>
					<th class="id">${participant.id}</th>
					<td class="icon"><img src="${participant.exhibitor.icon}" /></td>
					<td class="name">
						<img src="../images/${participant.badge}.png" alt="[${participant.badge}]" class="badge" />
						<a rel="external" target="_blank" href="${participant.exhibitor.twitterURL}">
						${participant.exhibitor.name}</a>
					</td>
					<td class="twitter">
						<a rel="external" target="_blank" href="${participant.exhibitor.twitterURL}">
							<img src="../images/twitter-logo.png" alt="Twitter" />
						</a>
					</td>
					<td class="seed">
						<a rel="external" target="_blank" href="${participant.exhibitor.tsoURL}">
							<img src="../images/theseedonline-logo.png" alt="THE SEED ONLINE" />
						</a>
					</td>
				</tr>`)}
				</tbody>
			</table>
		</section>
	</section>
	<section id="simple">
		<h1>シンプル会場「神殿」</h1>
		<section>
		<h1><img src="images/simple-logo.png" alt="神殿" /></h1>
		<a target="_blank" href="images/simple-map.png"><img src="images/simple-map.png" /></a>
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>アイコン</th>
					<th>名前</th>
					<th>作品1</th>
				</tr>
			</thead>
			<tbody>
			${this.catalogue && this.catalogue.filter(participant => participant.classId.includes('simple'))
			.map(participant => html`<tr>
			<th class="id">${participant.id}</th>
			<td class="icon"><img src="${participant.exhibitor.icon}" /></td>
			<td class="name">
				<img src="../images/${participant.badge}.png" alt="[${participant.badge}]" class="badge" />
				<a rel="external" target="_blank" href="${participant.exhibitor.twitterURL}">
					${participant.exhibitor.name}
				</a>
			</td>
			<td class="work1">
				<a rel="external" target="_blank"
					href="${participant.item.url}"
					title="${participant.item.title}">
					${participant.item.title} </a>
			</td>
			<td class="twitter">
				<a rel="external" target="_blank" href="${participant.exhibitor.twitterURL}">
					<img src="../images/twitter-logo.png" alt="Twitter" />
				</a>
			</td>
			<td class="seed">
				<a rel="external" target="_blank" href="${participant.exhibitor.tsoURL}">
					<img src="../images/theseedonline-logo.png" alt="THE SEED ONLINE" />
				</a>
			</td>
		</tr>`)}
			</tbody>
		</table>
		</section>
	</section>`;
	}
});
