const {init, setCount, notify, error} = require('./src/tray-app');
const miniflux = require('./src/miniflux');
const settings = require('./src/settings');

let newsCount = 0;

function refresh () {
	miniflux.check().then(updateCounter).catch(error);
}


function updateCounter (res) {
	setCount(res.count);
	if (res.count > newsCount) notify(res.entries);
	newsCount = res.count;
	const freq = (parseFloat(settings.get().freq) || 5) * 60000;  // 60000 = 1 min
	setTimeout(refresh, freq);
}

init(refresh);
