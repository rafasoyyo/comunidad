/* eslint-disable no-restricted-globals */
const workercode = () => {
	console.log('LOADED it up');
	self.onmessage = function (e) {
		// self.importScripts("./testModule"); // eslint-disable-line no-restricted-globals
		// eslint-disable-line no-restricted-globals
		console.log('Message received from main script');
		setTimeout(() => {
			var workerResult = 'Received from main: ' + e.data;
			console.log('Posting message back to main script');
			// self.postMessage(api.message()); // eslint-disable-line no-restricted-globals
			self.postMessage(workerResult); // eslint-disable-line no-restricted-globals
		}, 1000);
	};
};
export default workercode;
