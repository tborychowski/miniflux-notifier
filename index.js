const {init, setCount, notify, error} = require('./src/tray-app');
const miniflux = require('./src/miniflux');
const settings = require('./src/settings');

let newsCount = 0;

function refresh () {
	miniflux.check().then(updateCounter).catch(error);
}


function updateCounter (res) {
	setCount(res.count);
	const news = res.count - newsCount;
	if (news > 0) notify(res.entries.slice(0, news));
	newsCount = res.count;
	const freq = (parseFloat(settings.get().freq) || 5) * 60000;  // 60000 = 1 min
	setTimeout(refresh, freq);
}

init(refresh);
