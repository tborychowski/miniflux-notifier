const {app, shell, Menu, Tray, Notification} = require('electron');
const path = require('path');
const settings = require('./settings');


let tray, refreshCb;
const iconsPath = path.resolve(__dirname, '..', 'icons');
const ICON = {
	UNREAD: path.join(iconsPath, 'iconTemplate.png'),
	EMPTY: path.join(iconsPath, 'iconDimmedTemplate.png')
};


const inbox = () => shell.openExternal(settings.get().url);
const notify = news => news.forEach(toast);

settings.on('save', () => refreshCb());

function toast (news)  {
	const title = news.feed.title;
	const subtitle = timeAgo(new Date(news.published_at));
	const body = news.title;
	const notif = new Notification({ title, subtitle, body, silent: true });
	notif.on('click', inbox);
	notif.show();
}


function init (cb) {
	refreshCb = cb;
	app.dock.hide();
	app.on('ready', () => {
		tray = new Tray(ICON.EMPTY);
		refreshCb();
		if (settings.empty()) settings.open();
	});
}


function setMenu (count) {
	const label = count ? `${count} new feeds${count > 1 ? 's' : ''}` : 'No new feeds';
	const menu = Menu.buildFromTemplate([
		{ label, enabled: false },
		{ type: 'separator' },
		{ label: 'Refresh', click: refreshCb },
		{ label: 'Open Miniflux', click: inbox },
		{ type: 'separator' },
		{ label: 'Settings', click: settings.open },
		{ label: 'Quit', role: 'quit' }
	]);
	tray.setContextMenu(menu);
}


function setCount (count) {
	setMenu(count);
	tray.setImage(count > 0 ? ICON.UNREAD : ICON.EMPTY);
}


function error (e) {
	if (e.code === 'ECONNREFUSED') settings.open();
	else console.error(e);
}


function timeAgo (date) {
	const intervals = [
		{ label: 'year', seconds: 31536000 },
		{ label: 'month', seconds: 2592000 },
		{ label: 'day', seconds: 86400 },
		{ label: 'hour', seconds: 3600 },
		{ label: 'minute', seconds: 60 },
		{ label: 'second', seconds: 0 },
		{ label: 'just now', seconds: -1 },
	];
	const diff = Math.max(0, Date.now() - date.getTime());
	const seconds = Math.floor(diff / 1000);
	const interval = intervals.find(i => i.seconds < seconds);
	if (interval.seconds === -1) return interval.label;
	const count = Math.floor(seconds / interval.seconds) || 0;
	return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
}


module.exports = {
	init,
	setCount,
	notify,
	error
};
