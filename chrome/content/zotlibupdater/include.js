// Only create main object once
if (!Zotero.ZotLibUpdater) {
	let loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
					.getService(Components.interfaces.mozIJSSubScriptLoader);
	loader.loadSubScript("chrome://zotlibupdater/content/main.js");
}
