const {sha256} = require('./utils');

module.exports = class Content {
	constructor(id, lang, base) {
		this.lang = lang;
		this.base = base;
		this.id = id;

		
	}

	async read(lang = this.lang) {
		const langs = await this.langs();
		const targetLang = langs.find(target => [lang, this.lang, this.base.lang].includes(target));

		if (!targetLang) {
			return null;
		}
		
		const commit = await this.base.interface.content.i18n.commit.read(this.id, targetLang);

		return {
			lang: targetLang,
			title: commit.title,
			abstract: commit.abstract,
			text: commit.text,
			hash: commit.hash
		};
	}

	async write({
		title,
		abstract,
		text,
		lang = this.lang,
		author
	}) {
		const commit = await this.base.interface.content.i18n.commit.write(this.id, lang, {
			hash: sha256(),
			author,
			title, abstract, text,
			timestamp: new Date().getTime()
		});

		return { lang, title, abstract, text, hash: commit.hash, author };
	}

	async langs() {
		const langs = await this.base.interface.content.i18n.langs(this.id);
		
		return langs;
	}

	async commits(lang = this.lang) {
		const commits = await this.base.interface.content.i18n.commit.query(lang);

		return commits;
	}
}