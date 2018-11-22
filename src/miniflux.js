const btoa = require('btoa');
const fetch = require('node-fetch');
const settings = require('./settings');


function check () {
	const {url, username, password} = settings.get();
	const auth = btoa(`${username || ''}:${password || ''}`);
	const headers = { Authorization: 'Basic ' + auth };
	return fetch(url + '/v1/entries?status=unread&direction=desc', { method: 'GET', headers })
		.then(res => {
			if (res.status !== 200) return Promise.resolve({});
			return res.json();
		})
		.then(res => {
			if (!res || !res.total) return { count: 0, entries: [] };
			return { count: res.total, entries: res.entries };
		})
		.catch(e => console.error(e));
}


module.exports = {
	check,
};
