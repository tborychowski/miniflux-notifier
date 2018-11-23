const btoa = require('btoa');
const nodeFetch = require('node-fetch');
const settings = require('./settings');


function fetch (path) {
	const {url, username, password} = settings.get();
	const auth = btoa(`${username || ''}:${password || ''}`);
	const headers = { Authorization: 'Basic ' + auth };
	return nodeFetch(`${url}/v1${path}`, { method: 'GET', headers })
		.then(res => {
			if (res.status !== 200) return Promise.resolve({});
			return res.json();
		})
		.catch(e => console.error(e));
}

function check () {
	return fetch('/entries?status=unread&direction=desc')
		.then(res => {
			if (!res || !res.total) return { count: 0, entries: [] };
			return { count: res.total, entries: res.entries };
		});
}


function getIcon (feedId) {
	return fetch(`/feeds/${feedId}/icon`).then(res => `data:${res.data.replace('x-icon', 'png')}`);
}


module.exports = {
	check,
	getIcon,
};
