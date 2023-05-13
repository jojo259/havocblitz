export let debugMode = false;

if (["localhost", "127.0.0.1", "192.168.56.1", "172.31.195.170"].includes(document.domain)) {
	debugMode = true;
	console.warn("in debug mode due to domain: " + document.domain);
}
