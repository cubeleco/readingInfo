//block scope for cleaning up variables
{
//provide default value if matching regular expresion fails
function numMatches(string, exp) {
	const result = string.match(exp);
	return result ? result.length : 0;
}

//get common info object for text
function commonInfo(text) {
	let common = {};
	common.chars = text.length;
	common.nonWSChars = common.chars - numMatches(text, whitespaceRex);
	common.words = numMatches(text, wordRex);
	//common.sentences = numMatches(text, sentenceRex);
	return common;
}

const wordRex = /\w+\b/g;
//check for a single period followed by whitespace, closing punctuation, or end of string
//const sentenceRex = /\S\.{1}(\s|[\'\"\)\}\]]|$)+/g;
const whitespaceRex = /\s/g;

//document height in pixels
const docHeight = document.documentElement.getBoundingClientRect().height;
//view height for counting number of scrolling pages
const viewHeight = document.documentElement.clientHeight;
const article = document.querySelector('article');

//create return object
let info = {};

//webpage info
info.webpage = commonInfo(document.body.innerText);

//current page / total number of pages
info.pages = (Math.ceil(window.scrollY / viewHeight) + 1) + '/' + Math.ceil(docHeight / viewHeight);
//percentage scrolled down the page. minus 1 screen because scrollY is top of screen
info.progress = Math.round((window.scrollY * 100) / (docHeight - viewHeight));

//article info
if(article !== null && article.innerText.length > 800) {
	info.article = commonInfo(article.innerText);
}

//get text selection if any
const selectText = window.getSelection().toString();
if(selectText !== '') {
	info.select = commonInfo(selectText);
}

//return object to popup script
info;
}
