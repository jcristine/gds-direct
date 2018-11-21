
let sayHi = (requestData) => new Promise((resolve, reject) => {
    resolve({
        message: 'Hi, nice to meet you. I am the gds-direct-nodejs app. You can inject me on a page in your project to give user access to a GDS (Apollo, Sabre, Galileo or Amadeus).',
		echoedRequest: requestData,
    });
});

exports.processRequest = (requestData) => new Promise((resolve, reject) => {
    let func = requestData.func;
    if (func === 'sayHi') {
        sayHi(requestData).then(resolve).catch(reject);
    } else {
        reject('Unknown func - ' + func);
    }
});
