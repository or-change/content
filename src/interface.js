module.exports = class Interface {
	constructor({content, i18n, commit}) {
		this.base = {};

		if (!content) {
			throw new Error('The attribute content is required.');
		}

		if (typeof content.identify !== 'function' ||
		typeof content.read !== 'function' || typeof content.destroy !== 'function' ||
		typeof content.write !== 'function') {
			throw new Error('Attribute content must have identify, read and destroy function');
		}

		if (!i18n) {
			throw new Error('The attribute i18n is required.');
		}

		if (typeof i18n.langs !== 'function') {
			throw new Error('Attribute i18n must have langs function');
		}

		if (!commit) {
			throw new Error('The attribute commit is required.');
		}

		if (typeof commit.query !== 'function' ||
		typeof commit.read !== 'function' || typeof commit.write !== 'function') {
			throw new Error('Attribute commit must have query, read and write');
		}

		this.content = {
			identify: content.identify,
			read: content.read,
			destroy: content.destroy,
			write: content.write,
			i18n: {
				langs: i18n.langs,
				commit: {
					query: commit.query,
					read: commit.read,
					write: commit.write
				}
			}
		};
	}
};