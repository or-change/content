const ISO6391 = require('iso-639-1');

const Content = require('./content');
const Interface = require('./interface');

module.exports = class Base {
	constructor(interfaceInstance, options = {}) {
		if (!(interfaceInstance instanceof Interface)) {
			throw new Error('The first argument must be an instance of Interface.');
		}

		if (typeof options !== 'object') {
			throw new Error('The second argument must be an object.');
		}

		const {
			defaultLang = 'en'
		} = options;

		if (!ISO6391.validate(defaultLang)) {
			throw new Error('The lang can not be validated.');
		}

		this.defaultLang = defaultLang;
		this.interface = interfaceInstance;
	}

	async get(id) {
		const content = await this.interface.content.read(id);

		if (!content) {
			return null;
		}

		return new Content(id, this, content.lang);
	}

	async create(lang = this.defaultLang) {
		const id = await this.interface.content.identify();

		return new Content(id, this, lang);
	}

	async remove(id) {
		await this.interface.content.destroy(id);
	}
};