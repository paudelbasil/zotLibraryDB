var ZotLibUpdater;

function log(msg) {
	Zotero.log("ZotLibUpdater: " + msg);    
}

function install() {
	log("Installed ZotLibUpdater 2.0");
}

async function startup({ id, version, resourceURI, rootURI=resourceURI.spec }) {
	log("Starting ZotLibUpdater 2.0");
	
    try{
        // Zotero.PreferencePanes.register({
            // id: 'zotlibupdater_prefs_main',
            // pluginID: 'zotlibupdater@paudels.com',
            // src: rootURI + 'prefs/preferences.xhtml',
            // scripts: [rootURI + 'prefs/preferences.js']
        // });
    }catch(err){
        log("Error loading preferences :" + err.message);
    }
	
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
