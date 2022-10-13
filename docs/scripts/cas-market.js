import { LitElement, html } from 'lit';
import yaml from 'js-yaml';
import './date-time.js';
import './navigation-header.js';
import './item-list.js';

const isDevelop = location.hostname === 'localhost';

customElements.define('cas-market', class extends LitElement {
	static properties = {
		eventId: { attribute: false },
		widePosterPath: { attribute: false },
		posterPaths: { attribute: false },
		eventName: { attribute: false },
		params: { attribute: false },
		beforeStarting: { attribute: false },
		staff: { attribute: false },
	};

	constructor()
	{
		super();

		addEventListener('hashchange', () => {
			this.jumpToAnchor();
		});

		this.eventId = /\/([0-9]+)\//u.exec(location.pathname)[1];

		document.body.style.margin = '0';
		this.style.cssText += `
			--background: url("${this.eventId}/images/background.png");
			--header: url("${this.eventId}/images/header.png");
			--heading1: url("${this.eventId}/images/heading1.png");
			--heading2: url("${this.eventId}/images/heading2.png");
			--heading3: url("${this.eventId}/images/heading3.png");
		`;

		this.widePosterPath = `images/casmarket-${this.eventId}-poster-wide.png`;
		this.posterPaths = [ this.widePosterPath ];

		this.params = { };
		[
			[ 'eventIdNamePairs', '../events.yaml'],
			[ 'params', 'params.yaml'],
			[ 'staff', 'staff.yaml'],
		].forEach(async ([propertyName, filePath]) => {
			const value = yaml.load(await (await fetch(filePath)).text());
			if (propertyName === 'eventIdNamePairs') {
				this.eventName = value.find(({ id }) => id === this.eventId).name;
			} else {
				this[propertyName] = value;
				if (propertyName === 'params') {
					this.beforeStarting = new Date().getTime() < this.params.period.start.getTime();
				}
			}
		});

		const posterPath = `images/casmarket-${this.eventId}-poster.png`;
		fetch(posterPath, { method: 'HEAD' }).then(response => {
			if (!response.ok) {
				return;
			}
			this.posterPaths = [ posterPath, ...this.posterPaths ];
		});
	}

	firstUpdated()
	{
		this.jumpToAnchor();
	}

	jumpToAnchor()
	{
		const anchor = this.shadowRoot.getElementById(location.hash.replace('#', ''));
		if (!anchor) {
			return;
		}
		setTimeout(() => {
			anchor.scrollIntoView();
		});
	}

	render()
	{
		return html`
<link rel="stylesheet" href="styles.css" />
<link rel="stylesheet" href="../common.css" />
<link rel="stylesheet" href="../cas-market.css?20221013" />
<header>
	<h1><a href=""><img src="images/title.png" alt="${this.eventName}" /></a></h1>

	<navigation-header eventid="${this.eventId}" @click="${function (event) {
		if (event.target.getAttribute('href')?.startsWith('#')) {
			this.jumpToAnchor();
		}
	}}"></navigation-header>
</header>

<main>
<section id="summary">
	<h2>キャスマーケットとは?</h2>
	<p>
		<strong>キャスマーケットは、データ提出が不要なマーケットです！</strong>
		バーチャルキャストが手掛ける「THE SEED ONLINE」のサービスを用いることで、
		「VRアイテム = VCI」をデータのやり取りなしで利用することができます。
	</p>
	<p>
		<strong>展示されているVCIは、その場で取り込んで即時使用することができます！</strong>
		THE SEED ONLINEでは、バーチャル空間内でアバター、アイテムを
		無料公開や販売することができる「ユーザストア」の機能があります。
	</p>
	<p>
		<strong>3ヶ月に1度のスパンで、年に4回マーケットを行っています！</strong>
		常に進化するバーチャルの世界とバーチャルキャスト、
		次々に登場する新しいVCIとの出会いの場になります。
	</p>
	<p>
		バーチャルキャストのクリエイターと、バーチャルで生きるみなさんの架け橋となりますように……。
	</p>

	<img src="images/images.png" />

	<p>
		※バーチャルキャスト非公式イベントです。
	</p>

	<section id="access">
		<h3 class="level4">楽しみ方</h3>
		<p>
			バーチャルキャストは、VR機材があれば無料で遊べるサービスです。
			キャスマーケットのルームでVCIを実際に試着したり、写真を撮ったり、取り込むことができます！
		</p>
		<p>
			充分にイベントを楽しむには、事前にTwitter連携を済ませたり、
			THE SEED ONLINEのアカウントを作成しておくことをオススメします。
		</p>
	</section>

	<section>
		<h3>開催日時</h3>
		<p>${this.params.period && html`
			<date-time datetime=${this.params.period.start.toISOString()} displayYear="" displayTime=""></date-time>
			以降 〜 <date-time datetime=${this.params.period.end.toISOString()} ending="" displayTime=""></date-time>
		`}</p>
		<p>バーチャルキャスト　ルームにて開催！</p>
	</section>

	<img src="${this.widePosterPath}" alt="" />

	<section>
		<h3 class="hidden">リンク</h3>
		<p>ハッシュタグ <a rel="external" target="_blank"
			href="https://twitter.com/hashtag/${this.params.hashTag
				&& encodeURIComponent(this.params.hashTag.replace('#', ''))}">${this.params.hashTag}</a></p>
		<p>
			Twitter
			<a rel="external" target="_blank" href="https://twitter.com/i/user/1277870007758684161">@virtualcast_fes</a>
		</p>
	</section>
</section>

<section id="catalogue">
	<h2>カタログ</h2>
	${this.params.cataloguePublicationDate
		&& (this.params.cataloguePublicationDate.getTime() < new Date().getTime() || isDevelop
		? html`<item-list></item-list>`
		: html`<p><date-time datetime="${this.params.cataloguePublicationDate}"></date-time> 公開予定！</p>`)
	}
</section>

<section id="pamphlet">
	<h2>スペシャルパンフレット</h2>
    <img src="images/pamphlet.png" alt="次回開催の支援にご協力ください！

キャスマーケットの全てを記録
収入はスタッフへのお礼と、広告費に使用します。

スペシャルパンフレット
ベッラパスタ　BOOTHにて　500円

収録内容
• 第1章　出展作品紹介　出展者と作品を一挙にご紹介！
• 第2章　マーケットが出来るまで　ワールド制作の流れやコンセプトといったノウハウを記録！" />
	<p>
		キャスマーケットでは開催ごとにスペシャルパンフレットを販売しています。${
		this.beforeStarting ? '\n開催当日に販売開始予定です。' : ''}
		マーケットの継続のためにご購入お願いします！
	</p>
	${!this.beforeStarting && this.params.pamphletURL ? html`<p><a rel="external" target="_blank"
		href="${this.params.pamphletURL}">${this.params.pamphletURL}</a></p>` : null}
</section>

<section id="exhibit">
	<h2>出展について</h2>
	<p>コンセプト　${this.params.concept}</p>
	<p>2タイプの会場から選んで出展できます。(両方への出展も可能)</p>
	<table id="venues">
		<thead>
			<tr>
				<th>概要</th>
				<th>イメージ</th>
				<th>ジャンル</th>
				<th>作業</th>
			</tr>
		</thead>
		<tbody>
			<tr class="simple">
				<th>
					<b>シンプル会場</b>
					<p>「${this.params.simpleTitle}」</p>
					<p>${this.params.simpleSummary}</p>
				</th>
				<td class="image"><img src="images/image-simple.png" /></td>
				<td class="genre">
					<dl>
						<div>
							<dt>ノージャンル</dt>
							<dd>ジャンルにとらわれないとっておきの1点</dd>
						</div>
					</dl>
				</td>
				<td>VCIのURLを共有するだけで出展申し込みが完了します。</td>
			</tr>
			<tr class="theme">
				<th>
					<b>テーマ会場</b>
					<p>「${this.params.themeTitle}」</p>
					<p>${this.params.themeSummary}</p>
				</th>
				<td class="image"><img src="images/image-theme.png" /></td>
				<td class="genre">
					<dl>
						<div>
							<dt>${this.params.theme1}</dt>
							<dd>${this.params.theme1Summary}</dd>
						</div>
						<div>
							<dt>${this.params.theme2}</dt>
							<dd>${this.params.theme2Summary}</dd>
						</div>
					</dl>
				</td>
				<td>開催前1週間で、ルームマネージャーの管理のもと、自由にVCIを設営します。</td>
			</tr>
		</tbody>
	</table>

	<section>
		<h3>出展申し込みリンク</h3>
		<p><a rel="external" target="_blank"
			href="${this.params.applicationURL}">${this.params.applicationURL}</a></p>
	</section>

	<section id="room-managers">
		<h3>${this.eventName}　ルームマネージャーの皆さん</h3>
		<table>
			<thead>
				<tr>
					<th>ルーム</th>
					<th>アイコン</th>
					<th>名前</th>
				</tr>
			</thead>
			<tbody>
				${this.staff && this.staff.filter(member => member.roles.includes('ルームマネージャー')).map(member => html`<tr>
					<th class="room">${member.managedRoom}</th>
					<td class="icon"><img src="images/${member.icon}" /></td>
					<td class="name">${member.name}</td>
				</tr>`)}
			</tbody>
		</table>
	</section>

	<section>
		<h3 class="hidden">Discord</h3>
		<p>出展者Discordにて、問い合わせを行ったり、他出展者との交流ができます。</p>
		<p><a rel="external" target="_blank" href="https://discord.gg/xUXadMJG7z">https://discord.gg/xUXadMJG7z</a></p>
	</section>

	<section>
		<h3>締め切り</h3>
		<dl>${this.params.applicationDeadline && html`
			<dt>出展申し込み</dt>
			<dd><date-time datetime="${this.params.applicationDeadline.toISOString()}" ending=""></date-time></dd>
			<dt>シンプル会場VCIアップロード</dt>
			<dd><date-time datetime="${this.params.simpleVCIUploadDeadline.toISOString()}" ending=""></date-time></dd>
			<dt>テーマ会場設営</dt>
			<dd><date-time datetime="${this.params.themePreparePeriod.start.toISOString()}"></date-time>
				〜 <date-time datetime="${this.params.themePreparePeriod.end.toISOString()}" ending=""></date-time></dd>
		`}</dl>
		<small>※各日23:59までが有効</small>
	</section>

	<section id="accepted-count">
		<h3>募集数</h3>
		<section>
			<h4>VCI</h4>
			<dl>
				<dt>シンプル会場</dt><dd>先着${this.params.maxSimpleCount}名</dd>
				<dt>テーマ会場</dt><dd>各テーマ先着${this.params.maxThemeCountPerVenue}名</dd>
			</dl>
		</section>
		<section>
			<h4>広告</h4>
			<dl>
				<dt>広告設置</dt><dd>先着${this.params.maxPosterCount}名</dd>
			</dl>
		</section>
	</section>

	<section class="image-list-pairs">
		<h3>連続出展特典</h3>
		<p>連続でご出展いただいた方には以下の特典を付与いたします！</p>
		<img src="../images/badges.png" alt="" />
		<ul>
			<li>カタログで上部に表示、バッジが付きます。</li>
			<li>なるべく入口近くに展示、キャプションボードの色が変わります。</li>
			<li>連続出展回数が2回で「銀」、5回で「金」になります。</li>
			<li>「金」獲得後は、4回出展する度に「金」バッジが増えていきます。</li>
			<li>金バッジになると、運営情報が分かる専用Discordにご招待にします。</li>
			<li>出展が途絶えた場合は連続回数も1からになりますのでご了承ください。</li>
		</ul>
	</section>
</section>

<section id="rules">
	<h2>出展ルール</h2>
	<section class="image-list-pairs">
		<h3>各会場共通</h3>
		<ul class="wide">
			<li>出展申し込み時に、VCIの投稿・設営に使用するTHE SEED ONLINE IDをご提出いただきます。</li>
		</ul>
		<img src="../images/rules-vci-theseedonline-id.png" alt="" class="wide" />
		<img src="../images/rules-vci-theseedonline.png" alt="" />
		<ul>
			<li>VCI形式で「THE SEED ONLINE」にアイテムとしてアップロードしてください。</li>
			<li>出展者情報は別途キャプションにアイコン・名前を掲載します。
				「connpass」のアカウント情報を掲載しますので、出展時にプロフィールが正しく設定されているかご確認ください。</li>
		</ul>
		<img src="../images/rules-component.png" alt="" />
		<ul>
			<li>スクリプト、オーディオ、アニメーション、エフェクトは使用可能です。ただし、<ul>
				<li>他の展示物の迷惑にならない程度に調節する</li>
				<li>動作時の描画範囲を含めて、規定サイズをオーバーしない</li>
			</ul>ことが条件となります。</li>
		</ul>
	</section>

	<section>
		<h3>シンプル会場</h3>
		<ul>
			<li>出展申し込み時に投稿した商品の共有URLの形式で提出していただきます。</li>
			<li>アイテムを0VCCの商品として公開し、提出からマーケット終了まで公開状態を保ってください。</li>
			<li>位置調整するため、VCIを掴んで移動できるようにColliderを設定してください。</li>
			<li>VCIのサイズに応じて、サイズを調整したテーブルに配置します。</li>
		</ul>
	</section>

	<section>
		<h3>テーマ会場</h3>
		<ul>
			<li>ルームそれぞれのルームマネージャーが管理し、自由な出展設営を行うことができます。</li>
			<li>ルームリンクは設営に使用するアカウントで公開しているルームに限り、3つまで展示可能です。</li>
			<li><a rel="external" target="_blank" href="https://discord.gg/xUXadMJG7z">出展者Discord</a>
				を通じてルームマネージャーや他出展者との連絡を行います。</li>
		</ul>
	</section>

	<h3 class="hidden">共通項目についてのルール</h3>
	<table class="table">
		<thead>
			<tr>
				<th></th>
				<th>シンプル会場</th>
				<th>テーマ会場</th>
				<th>(備考)</th>
			</tr>
		</thead>
		<tbody>
			<tr class="size">
				<th>上限サイズ</th>
				<td>
					<figure>
						<figcaption>Itemサイズ</figcaption>
						<img src="../images/rules-vci-size.png" alt="幅1m×奥行1m×高さ2m" />
					</figure>
				</td>
				<td colspan="2">
					<div class="theme">
						<figure class="small">
							<figcaption>Sサイズ</figcaption>
							<img src="../images/rules-booth-size-small.png" alt="幅4m×奥行4m×高さ5m" />
						</figure>
						<figure class="medium">
							<figcaption>Mサイズ</figcaption>
							<img src="../images/rules-booth-size-medium.png" alt="幅8m×奥行4m×高さ5m" />
						</figure>
						<figure class="large">
							<figcaption>Lサイズ</figcaption>
							<img src="../images/rules-booth-size-large.png" alt="幅10m×奥行10m×高さ10m" />
						</figure>
					</div>
				</td>
			</tr>
			<tr class="genre">
				<th>ジャンル</th>
				<td class="simple"><ol>
					<li>ノージャンル</li>
				</ol></td>
				<td class="theme"><ol>
					<li>${this.params.theme1}</li>
					<li>${this.params.theme2}</li>
				</ol></td>
				<td></td>
			</tr>
			<tr>
				<th>価格設定</th>
				<td>無料のみ</td>
				<td>制限なし</td>
				<td></td>
			</tr>
			<tr>
				<th>公開設定</th>
				<td>公開</td>
				<td>制限なし</td>
				<td></td>
			</tr>
			<tr>
				<th>展示可能数</th>
				<td>1点</td>
				<td>${this.eventId === '6' ? 6 : 10}点 (ブースを含む)</td>
				<td>両会場の展示物重複可</td>
			</tr>
			<tr>
				<th>上限データサイズ</th>
				<td>10MB</td>
				<td>${this.eventId === '6' ? '10MB/1点' : '100MB (合計)'}</td>
				<td>「THE SEED ONLINE」上のデータサイズを参照</td>
			</tr>
		</tbody>
	</table>

	<p class="application"><a rel="external" target="_blank" href="${this.params.applicationURL}">出展申し込み</a></p>
</section>

<section id="rules-poster">
	<h2>広告について</h2>
	<p>キャスマーケットでは広告を募集します。</p>
	<p>個人・法人のいずれでも購入できます。</p>
	<p>Twitterアカウント
		<a rel="external" target="_blank" href="https://twitter.com/i/user/1277870007758684161">@virtualcast_fes</a>
		 へのダイレクトメッセージ (DM) よりご応募ください。</p>
	<p>広告画像は、カタログ公開時にWebサイトでご紹介し、期間中は会場に設置されます。</p>
	<section>
		<h3>広告ルール</h3>
		<section class="image-list-pairs">
			<h4 class="hidden">共通ルール</h4>
			<img src="../images/rules-poster-image.png" alt="" />
			<ul>
				<li>会場の入り口に設置します。</li>
				<li>広告主情報は別途キャプションを用意しませんので、すべてポスターに書き込んでください。</li>
			</ul>
		</section>
		<section class="image-list-pairs">
			<h4>1スペース (タテ長)</h4>
			<img src="../images/rules-poster-1.png" alt="" />
			<ul>
				<li>${this.params.oneSpacePosterPlace}</li>
				<li>縦2.0m×横1.4mの壁面に配置します。</li>
				<li>アスペクト比は 1 : √2 (ポスターサイズ) か 9 : 16 です。</li>
			</ul>
		</section>
		<section class="image-list-pairs">
			<h4>2スペース (ヨコ長)</h4>
			<img src="../images/rules-poster-2.png" alt="" />
			<ul>
				<li>${this.params.twoSpacesPosterPlace}</li>
				<li>縦2.0m×横2.8mの壁面に配置します。</li>
				<li>アスペクト比は √2 : 1 (ポスターサイズ) か 16 : 9 です。</li>
			</ul>
		</section>
	</section>
</section>

<section id="guidelines">
	<h2>ガイドライン</h2>
	<p>
		キャスマーケットの詳細な取り決めをまとめたガイドラインです！
		イベント全体を通してこちらのガイドラインに従って運営させていただきます。
	</p>
	<a rel="external" target="_blank"
		href="https://docs.google.com/document/d/1ElzkiWSNSAyBQL1g8I8jsnwqYy7uhBuUM7tREudrQT4/view">キャスマーケット ガイドライン</a>
</section>

<section id="logo">
	<h2>ポスター・ロゴ配布</h2>
	<p>本イベントの宣伝・制作物への利用に限りご自由にお使いいただけます。</p>
	<ul class="posters">
		${this.posterPaths.map(path => html`<li><a target="_blank" href="${path}"><img src="${path}" /></a></li>`)}
	</ul>
	<ul class="logos">${[
		`images/casmarket-${this.eventId}-logo-black.png`,
		`images/casmarket-${this.eventId}-logo-white.png`,
		`images/casmarket-${this.eventId}-logo-black-narrow.png`,
		`images/casmarket-${this.eventId}-logo-white-narrow.png`,
	].map(path => html`<li><a target="_blank" href="${path}"><img src="${path}" /></a></li>`)}</ul>

</section>
</main>

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
</footer>
		`;
	}
});
