import { LitElement, html, css } from 'lit';
import yaml from 'js-yaml';

customElements.define('common-footer', class extends LitElement {
	static styles = css`
		#staff address {
			display: flex;
			justify-content: center;
			font-style: normal;
			width: var(--width);
			max-width: 100%;
			margin: 0 auto;
		}

		#staff thead {
			display: none;
		}

		#staff ul {
			list-style: none;
			margin: unset;
			padding: unset;
			text-align: center;
		}

		#staff img {
			width: 5em;
		}
	`;

	static properties = {
		staff: { type: Array },
	};

	constructor()
	{
		super();

		if (!this.staff) {
			this.staff = [ ];
			(async () => {
				this.staff = yaml.load(await (await fetch('staff.yaml')).text());
			})();
		}
	}

	render()
	{
		return html`<link rel="stylesheet" href="../common.css" />
		<link rel="stylesheet" href="../cas-market.css?20221016" />

		<footer>
			<section id="contact">
				<h2>お問い合わせ</h2>
				<p>Twitterアカウント <a rel="external" target="_blank"
					href="https://twitter.com/i/user/1277870007758684161">@virtualcast_fes</a>
					へのダイレクトメッセージ (DM) にてお問い合わせください。</p>
			</section>

			<section id="staff">
				<h2>スタッフ</h2>
				<address>
					<table class="table">
						<thead>
							<tr>
								<th>アイコン</th>
								<th>役割</th>
								<th>名前</th>
							</tr>
						</thead>
						<tbody>${this.staff && this.staff.map(member => html`<tr>
							<td><img src="images/${member.icon}" /></td>
							<td><ul>${member.roles.map(role => html`<li>${role}</li>`)}</ul></td>
							<td><a rel="external" target="_blank" href="${member.url}">${member.name}</a>
							</td>
						</tr>`)}</tbody>
					</table>
				</address>
			</section>
		</footer>`;
	}
});
