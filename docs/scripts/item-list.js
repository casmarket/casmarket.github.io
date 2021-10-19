import { LitElement, html, css } from 'lit';

customElements.define('item-list', class extends LitElement {
	static styles = css`
		#frontier {
			--work-count: 0;
		}

		#frontier > section > h1 {
			background: unset;
			width: unset;
			height: unset;
			line-height: unset;
		}

		#simple {
			--work-count: 1;
		}

		table {
			margin: 0 auto;
		}

		thead {
			display: none;
		}

		tbody {
			display: grid;
			grid-template-columns: auto auto;
			justify-content: center;
			--gap: 2em;
			gap: var(--gap);
			--grid-width: calc(50vw - var(--gap));
		}

		@media (max-width: 40em) {
			tbody {
				--grid-width: 100vw;
				grid-template-columns: auto;
			}
		}

		tbody tr {
			display: grid;
			--gap: 0.2em;
			--no-width: 3em;
			--ratio-name-to-icon: 1.5;
			--icon-size: min(
				calc((var(--grid-width) - var(--gap) * 2 - var(--no-width)) / (1 + var(--ratio-name-to-icon))),
				7.5em
			);
			--grid-height: max(calc(var(--icon-size) / (1 + var(--work-count))), 1.5em);
			grid-template:
				"id              icon             name                                             " var(--grid-height)
				"id              icon             work1                                            " calc(var(--grid-height) * min(1, var(--work-count)))
				"id              icon             work2                                            " calc(var(--grid-height) * min(1, var(--work-count) - 1))
				/var(--no-width) var(--icon-size) calc(var(--icon-size) * var(--ratio-name-to-icon));
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
			let response = await fetch('../6/catalogue.json');
			this.catalogue = await response.json();
			console.log(this.catalogue)
		})();
	}


	render()
	{
		return html`<section id="frontier">
		<h1>ルーム会場「オリンピア」</h1>
		<section>
			<h1><img src="images/room1-heading.png" alt="機能" /></h1>
			<a target="_blank" href="images/room1-map.png"><img src="images/room1-map.png" /></a>
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>アイコン</th>
						<th>名前</th>
					</tr>
				</thead>
				<tbody>
					${this.catalogue && this.catalogue.filter(participant => participant.classId.includes('theme1')).map(participant => html`<tr>
					<th class="id">${participant.id}</th>
					<td class="icon"><img src="${participant.exhibitor.icon}" /></td>
					<td class="name">
						<img src="images/${participant.badge}.png" alt="[${participant.badge}]" class="badge" />
						<a rel="external" target="_blank" href="${participant.exhibitor.twitterURL}">${participant.exhibitor.name}</a>
					</td>
					<td class="work1">
						<a rel="external" target="_blank"
							href="${participant.item.url}"
							title="${participant.item.title}">
							${participant.item.title} </a>
					</td>
				</tr>`)}
				</tbody>
			</table>
		</section>
		<section>
			<h1><img src="images/room2-heading.png" alt="装飾" /></h1>
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
					${this.catalogue && this.catalogue.filter(participant => participant.classId.includes('theme2')).map(participant => html`<tr>
					<th class="id">${participant.id}</th>
					<td class="icon"><img src="${participant.exhibitor.icon}" /></td>
					<td class="name">
						<img src="images/${participant.badge}.png" alt="[${participant.badge}]" class="badge" />
						<a rel="external" target="_blank" href="${participant.exhibitor.twitterURL}">${participant.exhibitor.name}</a>
					</td>
					<td class="work1">
						<a rel="external" target="_blank"
							href="${participant.item.url}"
							title="${participant.item.title}">
							${participant.item.title} </a>
					</td>
				</tr>`)}
				</tbody>
			</table>
		</section>
	</section>

	<section id="simple">
		<h1>シンプル会場「神殿」</h1>
		<a target="_blank" href="images/studio-map.png"><img src="images/studio-map.png" /></a>
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
			${this.catalogue && this.catalogue.filter(participant => participant.classId.includes('simple')).map(participant => html`<tr>
			<th class="id">${participant.id}</th>
			<td class="icon"><img src="${participant.exhibitor.icon}" /></td>
			<td class="name">
				<img src="images/${participant.badge}.png" alt="[${participant.badge}]" class="badge" />
				<a rel="external" target="_blank" href="${participant.exhibitor.twitterURL}">${participant.exhibitor.name}</a>
			</td>
			<td class="work1">
				<a rel="external" target="_blank"
					href="${participant.item.url}"
					title="${participant.item.title}">
					${participant.item.title} </a>
			</td>
		</tr>`)}
			</tbody>
		</table>
	</section>`;
	}
});
