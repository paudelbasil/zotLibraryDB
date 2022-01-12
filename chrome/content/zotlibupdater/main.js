Zotero.ZotLibUpdater = {
	DB: null,
	
	init: function () {
				
		// Register the callback in Zotero as an item observer
		var notifierID = Zotero.Notifier.registerObserver(this.notifierCallback, ['item']);
		console.log('ZotLibUpdater init.');
		// Unregister callback when the window closes (important to avoid a memory leak)
		window.addEventListener('unload', function(e) {
				Zotero.Notifier.unregisterObserver(notifierID);
		}, false);
	},
	
	updateWebAppDB: function(){
	
		var collection = ZoteroPane.getSelectedCollection();
		var items = collection.getChildItems();
		var results = [];
		var colKey = collection.key;
		var colFullName = collection.name;
		
		var outputPath =OS.Path.join('D:\\inetpub\\wwwroot\\library\\resource\\', 'ZoteroAppDB_' + colFullName + '.dat');
		
		for (let i = 0; i < items.length; i++) {
			var item = items[i];
			var attachment;

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
                        console.log('Null attachment', item);
                        
                    }
					let attPath = attachment.getFilePath();
					
					var myTag = "bjpServerTag";


					var ids = item.getTags();
					ids.forEach(function (element, index) {
					  if(element['tag'].substring(0,3) === myTag.substring(0,3)){
						console.log('found', element);
						item.removeTag(element['tag']);   
					  }
					});
				
					item.addTag('bjpServerTag: '+ attPath.toString());
					//item.setField('libraryCatalog',attPath.toString());
				}
			}
		}

		var txtToAppend='';
		var pth = outputPath ;
		if ( OS.File.exists(pth)){
			OS.File.remove(pth);
		}

		var result = OS.File.open(pth, {write: true, append: false}).then(valOpen => {
			console.log('valOpen:', valOpen);
			txtToAppend = JSON.stringify(items, null, 5);
			var txtEncoded = new TextEncoder().encode(txtToAppend);
			valOpen.write(txtEncoded).then(valWrite => {
				console.log('valWrite:', valWrite);
				valOpen.close().then(valClose => {
					console.log('valClose:', valClose);
					console.log('successfully created');
				});
			});
		});
	},

	// Callback implementing the notify() method to pass to the Notifier
	notifierCallback: {
		notify: function(event, type, ids, extraData) {
			if (event == 'add') {
				Zotero.ZotLibUpdater.updateWebAppDB();
			}else if (event == 'modify'){
				Zotero.ZotLibUpdater.updateWebAppDB();
			}						
		}
	}
};

// Initialize the utility
window.addEventListener('load', function(e) { Zotero.ZotLibUpdater.init(); }, false);
