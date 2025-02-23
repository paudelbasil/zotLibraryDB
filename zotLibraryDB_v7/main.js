ZotLibUpdater = {
	id: null,
	version: null,
	rootURI: null,
	initialized: false,
    addedElementIDs: [],
	DB: null,
    notifierID: null,
    updateWebAppDB: null,
    TargetPath: null,
    
    // Callback implementing the notify() method to pass to the Notifier
	notifierCallback: {
		notify: function(event, type, ids, extraData) {
			if (event == 'add') {
				ZotLibUpdater.updateWebAppDB();
			}else if (event == 'modify'){
				ZotLibUpdater.updateWebAppDB();
			}						
		}
	},
        
    log(msg) {
		Zotero.log("ZotLibUpdater: " + msg);        
	},
    
	initialize() {
				
		// Register the callback in Zotero as an item observer
		this.notifierID = Zotero.Notifier.registerObserver(this.notifierCallback, ['item']);
		this.addToAllWindows();
        this.log('ZotLibUpdater initialized.');
		
	},    
    
    createPrefsItem(window){
        let doc = window.document;
        
        // Use Fluent for localization
		window.MozXULElement.insertFTLIfNeeded("zotlibupdater.ftl");
		        
        // Add menu option
		let menuitem = doc.createXULElement('menuitem');
		menuitem.id = 'databasepath';
		menuitem.setAttribute('type', 'checkbox');
		menuitem.setAttribute('data-l10n-id', 'target-data-path');
		// MozMenuItem#checked is available in Zotero 7
		menuitem.addEventListener('command', () => {
			ZotLibUpdater.setTargetPath(null);
		});
		doc.getElementById('menu_viewPopup').appendChild(menuitem);
		this.storeAddedElement(menuitem);
    },
    
	init({ id, version, rootURI }) {
		if (this.initialized) return;
		this.id = id;
		this.version = version;
		this.rootURI = rootURI;
		this.initialized = true;
        this.initialize();
        this.log('ZotLibUpdater init.');        
	},
    
    addToAllWindows() {
		var windows = Zotero.getMainWindows();
		for (let win of windows) {
			if (!win.ZoteroPane) continue;
			this.createPrefsItem(win);
		}
	},
    
    storeAddedElement(elem) {
		if (!elem.id) {
			throw new Error("Element must have an id");
		}
		this.addedElementIDs.push(elem.id);
	},
	
	removeFromWindow(window) {
		var doc = window.document;
		// Remove all elements added to DOM
		for (let id of this.addedElementIDs) {
			doc.getElementById(id)?.remove();
		}		
	},
	
	removeFromAllWindows() {
		var windows = Zotero.getMainWindows();
		for (let win of windows) {
			if (!win.ZoteroPane) continue;
			this.removeFromWindow(win);
		}
	},
    
    
    onclose() {
        Zotero.Notifier.unregisterObserver(this.notifierID);
        removeFromAllWindows();
        this.log('ZotLibUpdater closing.');
    },
    
    setTargetPath(tgt){        
        this.TargetPath = tgt;
    },
	
	updateWebAppDB() {
        
        var ZoteroPane = Zotero.getActiveZoteroPane();
		var collection = ZoteroPane.getSelectedCollection();
		var items = collection.getChildItems();
		var results = [];
		var colKey = collection.key;
		var colFullName = collection.name;
		
		var outputPath = "".concat('D:\\inetpub\\wwwroot\\library\\resource\\', 'ZoteroAppDB_' + colFullName + '.dat');
        
        if (this.TargetPath != null){
            outputPath = this.TargetPath;
        }
		
		for (let i = 0; i < items.length; i++) {
			var item = items[i];
			var attachment;
            try{
			// Proceed if an item is selected and it isn't a note
			if (item && !item.isNote()) {
				if (item.isAttachment()) {
					// find out about attachment
				}
				if (item.isRegularItem()) {
					// We could grab attachments:
					let attachmentIDs = item.getAttachments();
					attachment = Zotero.Items.get(attachmentIDs[0]);
                    
                    // Check if attachment is NULL
                    if (attachment == null){
                        this.log('Null attachment', item);                        
                    }
					let attPath = attachment.getFilePath();
					
					var myTag = "bjpServerTag";

					var ids = item.getTags();
					ids.forEach(function (element, index) {
					  if(element['tag'].substring(0,3) === myTag.substring(0,3)){
						item.removeTag(element['tag']);   
					  }
					});
				
					item.addTag('bjpServerTag: '+ attPath.toString());
					//item.setField('libraryCatalog',attPath.toString());
				}
			}
            }catch(err) {
                Zotero.logError('ZotLibrary Error:', err.message);
            }
		}

		var txtToAppend = JSON.stringify(items, null, 5);
		// var txtEncoded = new TextEncoder().encode(txtToAppend);
        Zotero.File.putContentsAsync(outputPath, txtToAppend);
        this.log('Successfully updated ZotLibrary at ' + outputPath);
	},
    
    async main() {        
        this.log('ZotLibUpdater started.');    
    },
    
};
