//extension option storage
var prefs = {
	wordsPerMin: 200,
	preferArticle: true
};
//object to store page info
var info;

function saveNumber(event) {
	chrome.storage.local.set({ [event.target.id]: Number(event.target.value) });
}
function saveChecked(event) {
	chrome.storage.local.set({ [event.target.id]: event.target.checked });
}

//set time based on words per minute input field
function updateTimes(event) {
	document.getElementById('time').textContent = Math.round(info.webpage.words / event.target.value) + 'm';

	if(info.article)
		document.getElementById('articleTime').textContent = Math.round(info.article.words / event.target.value) + 'm';
}
function hideTr(ids) {
	for(let i of ids) {
		document.getElementById(i).parentElement.classList.add('hidden');
	}
}

function setInfo(obj) {
	info = obj[0];
	//show error on protected page
	if(!info) {
		document.body.textContent = 'Protected Page';
		return;
	}
	updateTimes({ target: document.getElementById('wordsPerMin') });

	document.getElementById('words').textContent = info.webpage.words.toLocaleString();
	document.getElementById('chars').textContent = info.webpage.chars.toLocaleString();
	document.getElementById('nonWSChars').textContent = info.webpage.nonWSChars.toLocaleString();
	document.getElementById('pages').textContent = Math.round(info.progress / 100 * (info.pages - 1)) + 1 + '/' + info.pages;
	document.getElementById('progress').textContent = info.progress + '%';

	if(info.article) {
		//unhide article table element
		document.getElementById('article').classList.remove('hidden');
		//on prefer article info hide fullpages table rows
		if(prefs.preferArticle)
			hideTr(['time', 'words', 'chars', 'nonWSChars']);

		document.getElementById('articleWords').textContent = info.article.words.toLocaleString();
		document.getElementById('articleChars').textContent = info.article.chars.toLocaleString();
		document.getElementById('articleNonWSChars').textContent = info.article.nonWSChars.toLocaleString();
	}
	if(info.select) {
		//unhide selection table element
		document.getElementById('selection').classList.remove('hidden');
		document.getElementById('selectWords').textContent = info.select.words.toLocaleString();
		document.getElementById('selectChars').textContent = info.select.chars.toLocaleString();
		document.getElementById('selectNonWSChars').textContent = info.select.nonWSChars.toLocaleString();
	}
}

function readPrefs(storage) {
	//reload preferences
	prefs = storage;
	document.getElementById('wordsPerMin').value = prefs.wordsPerMin;
	document.getElementById('preferArticle').checked = prefs.preferArticle;

	//start content script in active tab
	browser.tabs.executeScript({ file: "/info.js" }).then(setInfo, console.error);
}
function start() {
	chrome.storage.local.get(prefs, readPrefs);
}

document.getElementById('wordsPerMin').addEventListener('input', saveNumber);
document.getElementById('wordsPerMin').addEventListener('input', updateTimes);
document.getElementById('preferArticle').addEventListener('input', saveChecked);

document.addEventListener('DOMContentLoaded', start);
