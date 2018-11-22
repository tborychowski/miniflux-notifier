const {init, setCount, notify, error} = require('./src/tray-app');
const miniflux = require('./src/miniflux');
const settings = require('./src/settings');



function refresh () {
	miniflux.check().then(updateCounter).catch(error);
}


function updateCounter (res) {
	setCount(res.count);
	notify(res.entries);
	const freq = (parseFloat(settings.get().freq) || 5) * 60000;  // 60000 = 1 min
	setTimeout(refresh, freq);
}

init(refresh);
