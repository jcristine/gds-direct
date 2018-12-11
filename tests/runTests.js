
console.log('Starting unit tests');

let tests = [
	() => 3 > 4 ? 'Your code says that 3 > 4, this is wrong' : null,
	() => 5 < 4 ? 'Five can not be less than four, silly' : null,
];

let oks = 0;
let errors = [];

for (let test of tests) {
	let error = test();
	if (error) {
		errors.push(error);
	} else {
		++oks;
	}
}

console.log('Finished with ' + oks + ' oks and ' + errors.length + ' errors');

if (errors.length > 0) {
	console.error('Unit test resulted in errors', errors);
	process.exit(1);
}