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

function roundTime(min) {
	if(min < 1.0)
		return '<1m';

	const remainMin = Math.round(min % 60);
	const hour = Math.floor(min / 60);

	//concatenate hours and minutes string
	return (hour > 0? hour + 'h' : '') + remainMin + 'm';
}

//set time based on words per minute input field
function updateTimes(event) {
	document.getElementById('time').textContent = roundTime(info.webpage.words / event.target.value);

	if(info.article)
		document.getElementById('articleTime').textContent = roundTime(info.article.words / event.target.value);
}
function hideTr(ids) {
	for(let i of ids) {
		document.getElementById(i).parentElement.classList.add('hidden');
	}
}

function protectedTab() {
	document.body.textContent = 'Protected Page';
}

function setInfo(obj) {
	//show error on protected page
	if(!obj[0]) {
		protectedTab();
		return;
	}
	//collect info results
	info = obj[0].result;

	updateTimes({ target: document.getElementById('wordsPerMin') });

	document.getElementById('words').textContent = info.webpage.words.toLocaleString();
	document.getElementById('chars').textContent = info.webpage.chars.toLocaleString();
	document.getElementById('nonWSChars').textContent = info.webpage.nonWSChars.toLocaleString();
	document.getElementById('pages').textContent = info.pages;
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

function startInfo(tabs) {
	//start content script in active tab
	chrome.scripting.executeScript({
		files: ["info.js"],
		target: {tabId: tabs[0].id}
	}).then(setInfo, protectedTab);
}

function readPrefs(storage) {
	//reload preferences
	prefs = storage;
	document.getElementById('wordsPerMin').value = prefs.wordsPerMin;
	document.getElementById('preferArticle').checked = prefs.preferArticle;

	chrome.tabs.query({ active: true, currentWindow: true }).then(startInfo);
}
function start() {
	chrome.storage.local.get(prefs, readPrefs);
}

document.getElementById('wordsPerMin').addEventListener('input', saveNumber);
document.getElementById('wordsPerMin').addEventListener('input', updateTimes);
document.getElementById('preferArticle').addEventListener('input', saveChecked);

document.addEventListener('DOMContentLoaded', start);
