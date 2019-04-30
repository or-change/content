const assert = require('assert');

const Base = require('../src/base');
const createMemory = require('../interface/memory');

describe('Base', function () {

	describe('#constructor()', function () {
		describe('throw an Error', function () {
			it('The first argument is not the instace of Interface', function () {
				assert.throws(() => {
					new Base();
				}, new Error('The first argument must be an instance of Interface.'));
			});

			it('The lang can not be validate', function () {
				assert.throws(() => {
					new Base(createMemory(), {
						defaultLang: 'test'
					});
				}, new Error('The lang can not be validated.'));
			});
		});

		it('return an instance of Base with defaultLang === "en"', function () {
			const interface = createMemory();

			const base = new Base(interface);

			assert.deepEqual(base, {
				defaultLang: 'en', interface
			});
		});

		it('return an instance of Base with defaultLang === "zh"', function () {
			const storage = {};
			const interface = createMemory(storage);

			const base = new Base(interface, {
				defaultLang: 'zh', test: true
			});

			assert.deepEqual(base, {
				defaultLang: 'zh', interface
			});
		});
	});

	describe('#create()', function () {
		const storage = {};
		const base = new Base(createMemory(storage), {
			defaultLang: 'zh', test: true
		});

		it('return a instance of Content with lang === "zh"', async function () {
			const content = await base.create();

			assert.equal(content.lang, 'zh');
		});

		it('return a instance of Content with lang === "en"', async function () {
			const content = await base.create('en');

			assert.equal(content.lang, 'en');
		});
	});

	describe('#get()', function () {
		const storage = {};
		const base = new Base(createMemory(storage), {
			defaultLang: 'zh'
		});
		
		it('return a existed instance of Content', async function () {
			const content = await base.create();
			await content.write({text: '111'});
			const contentRetrive = await base.get(1);

			assert.deepEqual(contentRetrive, content);
		});

		it('return null', async function () {
			const contentRetrive = await base.get();

			assert.deepEqual(contentRetrive, null);
		});
	});

	describe('#remove()', function () {
		const storage = {};
		const base = new Base(createMemory(storage), {
			defaultLang: 'zh', test: true
		});

		it('delete an existed content instance', async function () {
			const content = await base.create();
			await content.write({text: 'test'});
			await base.remove(1);

			assert.deepEqual(storage, {})
		});

		it('delete a not existed content instance', async function () {
			await base.remove('test');
		});
	});
});