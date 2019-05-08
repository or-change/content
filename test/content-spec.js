const assert = require('assert');

const Base = require('../src/base');
const Content = require('../src/content');
const createMemory = require('../interface/memory');

describe('Content', function () {
	beforeEach(function () {
		const base = new Base(createMemory());
		const content = new Content(1, base, 'zh');

		this.currentTest.content = content;
	});

	describe('#Contructor()', function () {
		it('create a content with no attribute', function () {
			assert.deepEqual(new Content(), {
				id: undefined, base: undefined, lang: undefined
			});
		});

		it('create a content with no lang', function () {
			const base = new Base(createMemory());

			const content = new Content(1, base);

			assert.deepEqual(content, {
				id: 1, base, lang: undefined
			});
		});

		it('create a content with can not validate lang', function () {
			assert.throws(() => {
				new Content(1, new Base(createMemory()), 'test');
			}, new Error('The lang can not be validated.'));
		});

		it('create a content with id, base and lang', function () {
			const base = new Base(createMemory());
			const content = new Content(1, base, 'en');

			assert.deepEqual(content, {
				id: 1, base, lang: 'en'
			});
		});
	});
	
	describe('#write()', function () {
		it('throw an Error when write with no argument', async function () {
			try {
				await this.test.content.write();
			} catch (e) {
				assert.equal(e.message, 'Cannot destructure property `title` of \'undefined\' or \'null\'.');
			}
		});

		it('throw an Error when write without text', async function () {
			try {
				await this.test.content.write({});
			} catch (e) {
				assert.equal(e.message, 'The text MUST be a string.');
			}
		});

		it('throw an Error when write with a can not validate lang', async function () {
			try {
				await this.test.content.write({
					text: 'test',
					lang: 'test'
				});
			} catch (e) {
				assert.equal(e.message, 'The lang can not be validated.');
			}
		});

		it('return result with author is null when write with an object with title, text and abstract', async function () {
			const {hash, lang, title, abstract, text, author} = await this.test.content.write({
				title: 'title', abstract: 'abstract', text: 'text'
			});

			assert.deepEqual({
				hash, lang, title, abstract, text, author
			}, {
				hash: '0fa4d93d0eadae34dd571a3be21b637243455a0ad5d1a53d5049d14d78457c51',
				lang: this.test.content.lang, title: 'title',
				abstract: 'abstract', text: 'text', author: null
			});
		});

		it('return result when write with an object with title, abstract, text, lang and author', async function () {
			const {hash, lang, title, abstract, text, author} = await this.test.content.write({
				title: 'title', abstract: 'abstract', text: 'text', lang: 'en', author:'222'
			});

			assert.deepEqual({hash, lang, title, abstract, text, author}, {
				hash: '0fa4d93d0eadae34dd571a3be21b637243455a0ad5d1a53d5049d14d78457c51',
				lang: 'en', title: 'title',
				abstract: 'abstract', text: 'text', author: '222'
			});
		});
	});

	describe('#read()', function () {
		it('return null ', async function () {
			try {
				await this.test.content.read();
			} catch (e) {
				assert.equal(e.message, 'Cannot read property \'commits\' of undefined');
			}
		});

		it('return the lang of result equal with this.base.lang ', async function () {
			await this.test.content.write({
				title: 'title', abstract: 'abstract', text: 'text', lang: 'en', author:'11111'
			});

			const {hash, lang, title, abstract, text, author} = await this.test.content.read();

			assert.deepEqual({
				hash: '0fa4d93d0eadae34dd571a3be21b637243455a0ad5d1a53d5049d14d78457c51',
				lang: 'en', title: 'title',
				abstract: 'abstract', text: 'text', author: '11111'
			}, {hash, lang, title, abstract, text, author});
		});

		it('return the lang of result equal with this.lang ', async function () {
			await this.test.content.write({
				title: 'title', abstract: 'abstract', text: 'text', lang: 'zh', author:'11111'
			});

			const {hash, lang, title, abstract, text, author} = await this.test.content.read();

			assert.deepEqual({
				hash: '0fa4d93d0eadae34dd571a3be21b637243455a0ad5d1a53d5049d14d78457c51',
				lang: 'zh', title: 'title',
				abstract: 'abstract', text: 'text', author: '11111'
			}, {hash, lang, title, abstract, text, author});
		});

		it('return the lang of result equal with lang ', async function () {
			await this.test.content.write({
				title: 'title', abstract: 'abstract', text: 'text', lang: 'ja', author:'11111'
			});

			const {hash, lang, title, abstract, text, author} = await this.test.content.read('ja');

			assert.deepEqual({
				hash: '0fa4d93d0eadae34dd571a3be21b637243455a0ad5d1a53d5049d14d78457c51',
				lang: 'ja', title: 'title',
				abstract: 'abstract', text: 'text', author: '11111'
			}, {hash, lang, title, abstract, text, author});
		});
	});

	describe('#langs()', function () {
		it('throw an Error', async function () {
			this.test.content.base.interface.content.i18n.langs = function () {
				return 1;
			};

			try {
				await this.test.content.langs();	
			} catch (e) {
				assert.equal(e.message, 'The langs of interface MUST return an array.');
			}
		});

		it('read langs of undefined', async function () {
			try {
				await this.test.content.langs();
			} catch (e) {
				assert.equal(e.message, 'Cannot read property \'commits\' of undefined');
			}
		});

		it('return array with items', async function () {
			await this.test.content.write({
				title: 'title', abstract: 'abstract', text: 'text', lang: 'ja', author:'11111'
			});
			const result = await this.test.content.langs();

			assert.equal(result.length, 1);
		});
	});

	describe('#commits()', function () {
		it('throw an Error', async function () {
			this.test.content.base.interface.content.i18n.commit.query = function () {
				return 1;
			};

			try {
				await this.test.content.commits();		
			} catch (e) {
				assert.equal(e.message, 'The interface query of commit MUST return an array.');
			}
		});

		it('read commits of undefined', async function () {
			try {
				await this.test.content.commits();
			} catch (e) {
				assert.equal(e.message, 'Cannot read property \'commits\' of undefined');
			}
		});

		it('return array with items', async function () {
			await this.test.content.write({
				title: 'title', abstract: 'abstract', text: 'text', lang: 'ja', author:'11111'
			});

			const result = await this.test.content.commits('ja');

			assert.equal(result.length, 1);
		});

		it('return []', async function () {
			await this.test.content.write({
				title: 'title', abstract: 'abstract', text: 'text', lang: 'ja', author:'11111'
			});

			const result = await this.test.content.commits('zh');

			assert.equal(result.length, 0);
		});
	});
});