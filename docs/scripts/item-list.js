import { LitElement, html, css } from 'lit';

customElements.define('item-list', class extends LitElement {
	static styles = css`
		:host {
			max-width: var(--width);
			display: grid;
			--cell-height: 3em;
			--badge-image-width: calc(var(--cell-height) * 0.8);
			--exhivitor-link-image-width: calc(var(--cell-height) * 0.6);
			--exhivitor-link-width: calc(var(--exhivitor-link-image-width) + 1em);
			grid-template-columns:
				2em
				var(--cell-height)
				calc(var(--badge-image-width) + 1em)
				minmax(0, 1fr)
				minmax(0, 1fr)
				var(--exhivitor-link-width)
				var(--exhivitor-link-width);
			--gap: 0.3rem;
			row-gap: var(--gap);
			margin-bottom: 1em;
		}

		:host > section,
		table,
		tbody,
		tr {
			display: contents;
		}

		hgroup,
		[href*="images/map-"],
		ul {
			grid-column: span 7;
			list-style: none;
			padding: unset;
		}

		hgroup {
			color: white;
			background: url("../images/heading-catalogue.png") no-repeat center / contain;
			width: 22.5em;
			max-width: 90%;
			height: 4em;
			text-align: left;
			margin: 1.2em 2em;
			position: relative
		}

		hgroup > * {
			margin: unset;
		}

		h1 {
			position: absolute;
			left: 0.5em;
			bottom: 0;
			font-family: serif;
			font-size: 2em;
		}

		h2 {
			position: absolute;
			right: 0.5em;
			font-family: sans-serif;
			font-size: 2.5em;
		}

		:is([href*="images/map-"], [href*="posters/"]) img {
			max-width: 100%;
		}

		thead {
			display: none;
		}

		tr > * {
			font-weight: normal;
			background: var(--header-color);
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.exhibitor,
		.item {
			justify-content: start;
		}

		:is(.exhibitor, .item) * {
			max-width: 100%;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.item {
			padding-left: 0.5em;
		}

		.icon {
			background: unset;
		}

		.icon img {
			height: var(--cell-height);
		}

		.badge * {
			display: block;
			height: calc(var(--badge-image-width));
		}

		.exhivitor-link * {
			display: block;
			height: calc(var(--exhivitor-link-image-width));
		}

		.icon,
		.badge,
		.item {
			margin-left: var(--gap);
		}
	`;

	static properties = {
		showPosters: { type: Boolean },
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
			[ 'simple', 'シンプル会場', null ],
			[ 'theme1', 'テーマ会場', '1. リアル' ],
			[ 'theme2', 'テーマ会場', '2. ファンタジー' ],
			this.showPosters && [ 'poster', '広告', null ],
		].filter(classInfo => classInfo && this.catalogue.some(item => item.classId === classInfo[0]))
			.map(([ classId, heading, subHeading ]) => html`<section>
				<hgroup>
					<h1>${heading}</h1>
					${subHeading && html`<h2>${subHeading}</h2>`}
				</hgroup>
				${classId === 'poster'
					? html`<ul>${this.catalogue.filter(item => item.classId === classId).map(item => html`
						<li>
							<a target="_blank" href="${item.poster}"><img src="${item.poster}" /></a>
						</li>
					`)}</ul>`
					: html`<a target="_blank" href="images/map-${classId}.png">
						<img src="images/map-${classId}.png" />
					</a>
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
								<td class="exhibitor">
									<span title="${item.exhibitor.name}">${item.exhibitor.name}</span>
								</td>
								<td class="item">${ classId === 'simple'
									? html`<a rel="external" target="_blank" href="${item.item.url}"
										title="${item.item.title}">${item.item.title}</a>`
									: null}</td>
								<td class="exhivitor-link">${item.exhibitor.twitterURL && html`
									<a rel="external" target="_blank" href="${item.exhibitor.twitterURL}"
									title="Twitter プロフィール"><img src="../images/twitter-logo.png" alt="Twitter" /></a>
								`}</td>
								<td class="exhivitor-link">
									<a rel="external" target="_blank" href="${item.exhibitor.tsoURL}"
										title="THE SEED ONLINE ユーザーページ">
										<img src="../images/theseedonline-logo.png" alt="THE SEED ONLINE" />
									</a>
								</td>
							</tr>`)}</tbody>
						</table>`}
			</section>`);
	}
});
