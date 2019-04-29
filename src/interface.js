class Interface {
	constructor() {
		this.base = {};

		this.content = {
			identify: null,
			read: null,
			destroy: null,
			i18n: {
				langs: null,
				commit: {
					query: null,
					read: null,
					write: null
				}
			}
		};
	}
}