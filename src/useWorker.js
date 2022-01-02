import * as React from 'react';

const importWorker = (workercode) => {
	let code = workercode.toString();
	code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

	const blob = new Blob([code], { type: 'application/javascript' });
	const worker_script = URL.createObjectURL(blob);

	return worker_script;
};

// import importWorker from './importWorker';
const useWorker = (code) => {
	const [worker, setWorker] = React.useState(null);
	React.useEffect(() => {
		// const worker = new Worker(worker_script);
		const worker = new Worker(importWorker(code));
		// console.log("Using worker",worker)

		setWorker(worker);
		// worker.addEventListener('message', onMessage);
		return () => {
			// worker.removeEventListener('error', onMessage);
			worker.terminate();
		};
	}, []);
	return worker;
};

export default useWorker;
