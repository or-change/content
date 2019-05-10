const {sha256} = require('./utils');
const ISO6391 = require('iso-639-1');

module.exports = class Content {
	constructor(id, base, lang) {
		this.id = id;
		this.base = base;

		if (lang && !ISO6391.validate(lang)) {
			throw new Error('The lang can not be validated.');
		}

		this.lang = lang;
	}

	async read(lang = this.lang) {
		const langs = await this.langs();
		const targetLang = langs.find(target => [lang, this.lang, this.base.defaultLang].includes(target));

		if (!targetLang) {
			return null;
		}
		
		const commit = await this.base.interface.content.i18n.commit.read(this.id, targetLang);

		if (!commit) {
			return null;
		}

		return {
			lang: targetLang,
			title: commit.title,
			abstract: commit.abstract,
			text: commit.text,
			hash: commit.hash,
			author: commit.author,
			createdAt: commit.createdAt
		};
	}

	async write({
		title = null,
		abstract = null,
		text = null,
		lang = this.lang,
		author = null
	}) {
		const createdAt = Date.now();

		if (typeof text !== 'string') {
			throw new Error('The text MUST be a string.');
		}

		if (lang && !ISO6391.validate(lang)) {
			throw new Error('The lang can not be validated.');
		}

		const hash = sha256(title + abstract + text + Date.now()); //可能不会对text进行修改

		await this.base.interface.content.write(this.id, this.lang);

		await this.base.interface.content.i18n.commit.write(this.id, lang, {
			hash,
			author,
			title, abstract, text,
			createdAt
		});

		return { hash, lang, title, abstract, text, author, createdAt };
	}

	async langs() {
		const langs = await this.base.interface.content.i18n.langs(this.id);

		if (!Array.isArray(langs)) {
			throw new Error('The langs of interface MUST return an array.');
		}
		
		return langs;
	}

	async commits(lang = this.lang) {
		const commits = await this.base.interface.content.i18n.commit.query(this.id, lang);

		if (!Array.isArray(commits)) {
			throw new Error('The interface query of commit MUST return an array.');
		}

		return commits.map(({title, hash, abstract, author, createdAt}) => {
			return {
				title, abstract, hash, author, createdAt
			};
		});
	}
};