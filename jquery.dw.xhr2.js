/*
 * Author: dwoutsourcing (dwoutsourcing@gmail.com)
 * License: MIT
 */
(function($, undefined) {
	var FileUploader = function() {
		if(!FileUploader.Caniuse())
			throw new Error('This browser cannot manage POST File uploads');
		
		this._initializeXHR();
	};
	
	FileUploader.prototype._initializeXHR = function() {
		this.xhr = new XMLHttpRequest;
		var $this = $(this);
		var xhr = this.xhr;
		
		xhr.addEventListener('readystatechange', function(event) {
			$this.trigger('readystatechange', [event, xhr.readyState]);
		});
		xhr.upload.addEventListener('progress', function(event) {
			var perc;
			
			if(event.lengthComputable) {
				perc = event.loaded / event.total;
				$this.trigger('progress', [event, perc, event.loaded, event.total]);
			}
		});
		xhr.upload.addEventListener('abort', function(event) {
			$this.trigger('abort', [event]);
		});
		xhr.upload.addEventListener('error', function(event) {
			$this.trigger('error', [event]);
		});
		xhr.upload.addEventListener('load', function(event) {
			$this.trigger('load', [event]);
		});
		xhr.upload.addEventListener('loadend', function(event) {
			$this.trigger('loadend', [event]);
		});
		xhr.upload.addEventListener('loadstart', function(event) {
			$this.trigger('loadstart', [event]);
		});
		xhr.upload.addEventListener('timeout', function(event) {
			$this.trigger('timeout', [event]);
		});
	};
	
	FileUploader.prototype._initializeFile = function(file) {
		if(this.file) {
			try {
				this.xhr.abort();
			} catch(e) {};
		}
		
		this.file = file;
	};
	
	FileUploader.prototype.abort = function() {
		this.xhr.abort();
	};
	
	FileUploader.prototype.upload = function(url, file, postdata, responseType, fileVarName) {
		this.url = url;
		this._initializeFile(file);
		this.postdata = postdata;
		
		this.xhr.open('POST', url, true);
		
		if(responseType)
			this.xhr.responseType = responseType;
		
		this.xhr.send(FileUploader.FormData(file, postdata, fileVarName));
	};
	
	FileUploader.FormData = function(file, postdata, fileVarName) {
		var field;
		var formdata = new FormData;
		
		formdata.append(fileVarName || 'userfile', file);
			
		if(postdata)
			for(field in postdata)
				formdata.append(field, postdata[field]);
			
		return formdata;
	};
	
	FileUploader.Caniuse = function() {
		return ('FormData' in window && 'XMLHttpRequest' in window);
	};
	
	var DataLoader = function() {
		if(!DataLoader.Caniuse())
			throw new Error('This browser cannot manage POST File downloads');
		
		this._initializeLoader();
	};
	DataLoader.prototype.loadData = function(url, postdata, responseType, method) {
		method = method || 'GET';
		
		this.xhr.open(method, url, true);
		
		if(responseType)
			this.xhr.responseType = responseType;
		
		this.xhr.send(DataLoader.FormData(postdata));
	};
	
	DataLoader.prototype._initializeLoader = function() {
		var xhr = this.xhr = new XMLHttpRequest;
		var $this = $(this);
		
		xhr.addEventListener('readystatechange', function(event) {
			$this.trigger('readystatechange', [event, xhr.readyState]);
		});
		xhr.addEventListener('progress', function(event) {
			var perc;
			
			if(event.lengthComputable) {
				perc = event.loaded / event.total;
				$this.trigger('progress', [event, perc, event.loaded, event.total]);
			}
		});
		xhr.addEventListener('abort', function(event) {
			$this.trigger('abort', [event]);
		});
		xhr.addEventListener('error', function(event) {
			$this.trigger('error', [event]);
		});
		xhr.addEventListener('load', function(event) {
			$this.trigger('load', [event, xhr.response]);
		});
		xhr.addEventListener('loadend', function(event) {
			$this.trigger('loadend', [event, xhr.response]);
		});
		xhr.addEventListener('loadstart', function(event) {
			$this.trigger('loadstart', [event]);
		});
		xhr.addEventListener('timeout', function(event) {
			$this.trigger('timeout', [event]);
		});
	}
	
	DataLoader.FormData = function(postdata) {
		var field;
		var formdata = new FormData;
		
		if(postdata)
			for(field in postdata)
				formdata.append(field, postdata[field]);
			
		return formdata;
	};
	
	DataLoader.Caniuse = function() {
		return ('Blob' in window);
	};
	
	function createFileUploader() {
		var uploader = new FileUploader;
		var $uploader = $(uploader);
		
		$uploader.upload = function(url, file, postdata, responseType) {
			uploader.upload(url, file, postdata, responseType);
			return $uploader;
		};
		$uploader.abort = function() {
			uploader.abort();
			return $uploader;
		};
		$uploader.xhr = function() {
			return uploader.xhr;
		};
		
		return $uploader;
	}
	
	function createDataLoader() {
		var loader = new DataLoader;
		var $loader = $(loader);
		
		$loader.loadData = function(url, postdata, responseType, method) {
			loader.loadData(url, postdata, responseType, method);
			return $loader;
		};
		$loader.abort = function() {
			loader.abort();
			return $loader;
		};
		$loader.xhr = function() {
			return loader.xhr;
		};
		
		return $loader;
	}
	
	$.extend({
		fileUploader: function() {
			return createFileUploader();
		},
		canUploadFiles: function() {
			return FileUploader.Caniuse();
		},
		
		dataLoader: function() {
			return createDataLoader();
		},
		canLoadData: function() {
			return DataLoader.Caniuse();
		}
	});
}( jQuery ));