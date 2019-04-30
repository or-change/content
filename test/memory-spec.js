const assert = require('assert');
const createMemory = require('../interface/memory');

describe('interface > memory', function () {
	const storage = {};
	const memory = createMemory(storage);

	describe('#content', function () {
		let id;
		
		describe('#read()', function () {
			it('return undefined when whithout argument', function () {
				assert.equal(undefined, memory.content.read());
			});
		
			it('return undefined when read a not existed object', function () {
				assert.equal(undefined, memory.content.read('test'));
			});
		
			it('return an existed object', function () {
				const id = memory.content.identify();
				memory.content.write(id);

				assert.equal(storage[id], memory.content.read(id));
			});
		});

		describe('#write()', function () {

			it('call function when whithout argument', function () {
				assert.deepEqual({
					lang: undefined, commits: []
				}, memory.content.write());
			});
		
			it('call function with not existed id and without lang', function () {
				const id = memory.content.identify();
				memory.content.write(id);

				assert.deepEqual(storage[id], {
					lang: undefined, commits: []
				});
			});

			it('call function with not existed id and lang', function () {
				id = memory.content.identify();
				memory.content.write(id, 'test');

				assert.deepEqual(storage[id], {
					lang: 'test', commits: []
				});
			});
		
			it('call function with an existed id', function () {
				memory.content.write(id, 'change');

				assert.deepEqual(storage[id], {
					lang: 'change', commits: []
				});
			});
		});
		
		describe('#destroy()', function () {
			it('call whithout argument', function () {
				memory.content.destroy();
			});
		
			it('delete an existed object', function () {
				memory.content.destroy(id);

				assert.deepEqual(storage[id], undefined);
			});
		});

		describe('#i18n', function () {
			const id = memory.content.identify();
			memory.content.write(id, 'change');

			describe('#langs()', function () {
				it('call whithout argument', function () {
					assert.throws(() => {
						memory.content.i18n.langs();
					}, new TypeError('Cannot read property \'commits\' of undefined'));

				});
			
				it('return []', function () {
					assert.deepEqual(memory.content.i18n.langs(id), []);
				});

				it('return array with lang', function () {
					memory.content.i18n.commit.write(id, 'zh', {});
					memory.content.i18n.commit.write(id, 'en', {});
					memory.content.i18n.commit.write(id, 'zh', {});

					assert.deepEqual(memory.content.i18n.langs(id), ['zh', 'en']);
				});
			});

			describe('#commit', function () {
				const id = memory.content.identify();
				memory.content.write(id, 'zh');

				memory.content.i18n.commit.write(id, 'zh', {});
				memory.content.i18n.commit.write(id, 'en', {});
				memory.content.i18n.commit.write(id, 'zh', {});

				describe('#query()', function () {
					it('call whithout argument', function () {
						assert.throws(() => {
							memory.content.i18n.commit.query();
						}, new TypeError('Cannot read property \'commits\' of undefined'));
					});
				
					it('get an existed object commits without lang', function () {
						const commits = memory.content.i18n.commit.query(id);

						assert.equal(commits.length, 3);
					});

					it('get an existed object commits with lang', function () {
						const commits = memory.content.i18n.commit.query(id, 'zh');

						assert.equal(commits.length, 2);
					});
				});
				
				describe('#read()', function () {
					const id = memory.content.identify();

					memory.content.write(id, 'zh');

					memory.content.i18n.commit.write(id, 'zh', {});
					memory.content.i18n.commit.write(id, 'en', {});
					memory.content.i18n.commit.write(id, 'zh', {});

					it('call whithout argument', function () {
						assert.throws(() => {
							memory.content.i18n.commit.read();
						}, new TypeError('Cannot read property \'commits\' of undefined'));
					});
				
					it('get an existed object commit without lang', function () {
						assert.deepEqual(memory.content.i18n.commit.read(id), undefined);
					});

					it('get an existed object commit with lang', function () {
						assert.deepEqual(memory.content.i18n.commit.read(id, 'zh'), {
							lang: 'zh', hash: undefined, author: undefined,
							title: undefined, abstract: undefined, text: undefined,
							createdAt: undefined
						});
					});
				});
				
				describe('#write()', function () {
					const id = memory.content.identify();
					memory.content.write(id, 'zh');

					it('call whithout argument', function () {
						assert.throws(() => {
							memory.content.i18n.commit.write();
						}, new TypeError('Cannot destructure property `hash` of \'undefined\' or \'null\'.'));
					});
				
					it('call with not existed id', function () {
						memory.content.i18n.commit.write('test', 'zh', {});

						assert.deepEqual(storage['test'].commits[0], {
							lang: 'zh', hash: undefined, author: undefined,
							title: undefined, abstract: undefined, text: undefined,
							createdAt: undefined
						});
					});
				
					it('call with existed id', function () {
						memory.content.i18n.commit.write(id, 'zh', {});

						assert.deepEqual(storage[id].commits[storage[id].commits.length - 1], {
							lang: 'zh', hash: undefined, author: undefined,
							title: undefined, abstract: undefined, text: undefined,
							createdAt: undefined
						});
					});

					it('return a complete commit', function () {
						const info = {
							lang: 'zh', hash: 'hash', author: 'test',
							title: 'title', abstract: 'abstract', text: 'text',
							createdAt: 'createdAt', attr1: 'test', attr2: 'test'
						};

						const commit = memory.content.i18n.commit.write(id, 'zh', info);

						assert.deepEqual(commit, {
							lang: 'zh', hash: 'hash', author: 'test',
							title: 'title', abstract: 'abstract', text: 'text',
							createdAt: 'createdAt'
						});
					});
				});
			});
			
		});
	});
});