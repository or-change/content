const Content = require('./content');

module.exports = class Base {
	constructor(interface, options = {}) {
		const {
			defaultLang = 'en'
		} = options;

		this.defaultLang = defaultLang;
		this.interface = interface;
	}

	async get(id) {
		const content = await this.interface.content.read(id);

		if (!content) {
			return null;
		}

		return new Content(id, content.lang);
	}

	async create(lang = this.defaultLang) {
		const id = await this.interface.content.identify();

		return new Content(id, lang, this);
	}

	remove(id) {
		this.interface.content.destroy(id);
	}
}