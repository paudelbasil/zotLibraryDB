var ZotLibUpdater;

function log(msg) {
	Zotero.log("ZotLibUpdater: " + msg);    
}

function install() {
	log("Installed ZotLibUpdater 2.0");
}

async function startup({ id, version, rootURI }) {
	log("Starting ZotLibUpdater 2.0");
	
	Zotero.PreferencePanes.register({
		pluginID: 'zotlibupdater@paudels.com',
		src: rootURI + 'preferences.xhtml',
		scripts: [rootURI + 'preferences.js']
	});
	
	Services.scriptloader.loadSubScript(rootURI + 'main.js');
	ZotLibUpdater.init({ id, version, rootURI });
	await ZotLibUpdater.main();
}

function onMainWindowLoad({ window }) {
	ZotLibUpdater.createPrefsItem(window);
}

function onMainWindowUnload({ window }) {
	ZotLibUpdater.removeFromWindow(window);
    ZotLibUpdater.onclose();
}

function shutdown() {
	log("Shutting down 2.0");	
    ZotLibUpdater = undefined;
}

function uninstall() {
	log("Uninstalled ZotLibUpdater 2.0");
}
