const Interface = require('../src/interface');

module.exports = function (contentMapping = {}) {
	let i = 0;

	return new Interface({
		content: {
			identify() {
				i++;
	
				return i;
			},
			read(id) {
				return contentMapping[id];
			},
			query() {
				const result = [];

				for (let key in contentMapping) {
					contentMapping[key].id = key;

					result.push(contentMapping[key]);
				}
				
				return result;
			},
			write(id, lang) {
				return contentMapping[id] = {
					lang, commits: []
				};
			},
			destroy(id) {
				delete contentMapping[id];
			}
		},
		i18n: {
			langs(id) {
				const content = contentMapping[id];
				const langs = [];
	
				content.commits.forEach(commit => {
					if (commit.lang && langs.indexOf(commit.lang) === -1) {
						langs.push(commit.lang);
					}
				});

				return langs;
			}
		},
		commit: {
			query(id, lang) {
				const content = contentMapping[id];
	
				return content.commits.filter(commit => {
					return lang ? commit.lang === lang : true;
				});
			},
			read(id, lang) {
				const content = contentMapping[id];
	
				const commits = content.commits.filter(commit => commit.lang === lang);

				return commits[commits.length - 1];
			},
			write(id, lang, {
				hash, author,
				title, abstract, text,
				createdAt
			}) {
				const commit = {
					lang, hash, author,
					title, abstract, text,
					createdAt
				};
	
				if (contentMapping[id]) {
					contentMapping[id].commits.push(commit);
				} else {
					contentMapping[id] = {
						lang: lang,
						commits: [commit]
					};
				}
				
				return commit;
			}
		}
	});
};