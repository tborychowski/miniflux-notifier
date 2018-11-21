const {init, setCount, notify, error} = require('./src/tray-app');
const settings = require('./src/settings');



function refresh () {
	updateCounter();
}


function updateCounter (emails) {
	const count = (emails || []).length;
	// const news = emails.filter(msg => msg.new);

	setCount(count);
	// notify(news);

	// const freq = (parseFloat(settings.get().freq) || 5) * 60000;  // 60000 = 1 min
	// setTimeout(refresh, freq);
}

init(refresh);
