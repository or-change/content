const assert = require('assert');
const Interface = require('../src/interface');

describe('Interface', function () {
	describe('#constructor()', function () {

		describe('#content', function () {
			it('throw an Error when create with no content', function () {
				assert.throws(() => {
					new Interface({});
				}, new Error('The attribute content is required.'));
			});

			it('throw an Error when create with no read', function () {
				assert.throws(() => {
					new Interface({
						content: {
							identify: function () {}
						}
					});
				}, new Error('Attribute content must have read function'));
			});
		});

		describe('#i18n', function () {
			it('throw an Error when create with no i18n', function () {
				assert.throws(() => {
					new Interface({
						content: {
							identify: function () {},
							read: function () {},
							destroy: function () {},
							write: function () {}
						}
					});
				}, new Error('The attribute i18n is required.'));
			});

			it('throw an Error when create with langs is not a function', function () {
				assert.throws(() => {
					new Interface({
						content: {
							identify: function () {},
							read: function () {},
							destroy: function () {},
							write: function () {}
						},
						i18n: {
							langs: {}
						}
					});
				}, new Error('Attribute i18n must have langs function'));
			});
		});
		
		describe('#commit', function () {
			it('throw an Error when create with no commit', function () {
				assert.throws(() => {
					new Interface({
						content: {
							identify: function () {},
							read: function () {},
							destroy: function () {},
							write: function () {}
						},
						i18n: {
							langs: function () {}
						}
					});
				}, new Error('The attribute commit is required.'));
			});
			
			it('throw an Error with create with no read', function () {
				assert.throws(() => {
					new Interface({
						content: {
							identify: function () {},
							read: function () {},
							destroy: function () {},
							write: function () {}
						},
						i18n: {
							langs: function () {}
						},
						commit: {

						}
					});
				}, new Error('Attribute commit must have query, read'));
			});
	
			it('throw an Error with create with no query', function () {
				assert.throws(() => {
					new Interface({
						content: {
							identify: function () {},
							read: function () {},
							destroy: function () {},
							write: function () {}
						},
						i18n: {
							langs: function () {}
						},
						commit: {
							read: function () {},
							write: function () {}
						}
					});
				}, new Error('Attribute commit must have query, read'));
			});
		});
	});

	it('return an instance of Interface', function () {
		const interface = {
			content: {
				identify: function () {},
				read: function () {},
				destroy: function () {},
				write: function () {}
			},
			i18n: {
				langs: function () {}
			},
			commit: {
				read: function () {},
				write: function () {},
				query: function () {}
			}
		};

		assert.deepEqual(new Interface(interface).content, {
			identify: interface.content.identify,
			read: interface.content.read,
			destroy: interface.content.destroy,
			write: interface.content.write,
			i18n: {
				langs: interface.i18n.langs,
				commit: {
					query: interface.commit.query,
					read: interface.commit.read,
					write: interface.commit.write
				}
			}
		});
	});
});