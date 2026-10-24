/* dsh-long-input — vendored marked v12.0.2 (MIT) + Client module. */
(function () {
  var module = { exports: {} };
  var exports = module.exports;
/**
 * marked v12.0.2 - a markdown parser
 * Copyright (c) 2011-2024, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).marked={})}(this,(function(e){"use strict";function t(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}function n(t){e.defaults=t}e.defaults={async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null};const s=/[&<>"']/,r=new RegExp(s.source,"g"),i=/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,l=new RegExp(i.source,"g"),o={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},a=e=>o[e];function c(e,t){if(t){if(s.test(e))return e.replace(r,a)}else if(i.test(e))return e.replace(l,a);return e}const h=/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;function p(e){return e.replace(h,((e,t)=>"colon"===(t=t.toLowerCase())?":":"#"===t.charAt(0)?"x"===t.charAt(1)?String.fromCharCode(parseInt(t.substring(2),16)):String.fromCharCode(+t.substring(1)):""))}const u=/(^|[^\[])\^/g;function k(e,t){let n="string"==typeof e?e:e.source;t=t||"";const s={replace:(e,t)=>{let r="string"==typeof t?t:t.source;return r=r.replace(u,"$1"),n=n.replace(e,r),s},getRegex:()=>new RegExp(n,t)};return s}function g(e){try{e=encodeURI(e).replace(/%25/g,"%")}catch(e){return null}return e}const f={exec:()=>null};function d(e,t){const n=e.replace(/\|/g,((e,t,n)=>{let s=!1,r=t;for(;--r>=0&&"\\"===n[r];)s=!s;return s?"|":" |"})).split(/ \|/);let s=0;if(n[0].trim()||n.shift(),n.length>0&&!n[n.length-1].trim()&&n.pop(),t)if(n.length>t)n.splice(t);else for(;n.length<t;)n.push("");for(;s<n.length;s++)n[s]=n[s].trim().replace(/\\\|/g,"|");return n}function x(e,t,n){const s=e.length;if(0===s)return"";let r=0;for(;r<s;){const i=e.charAt(s-r-1);if(i!==t||n){if(i===t||!n)break;r++}else r++}return e.slice(0,s-r)}function b(e,t,n,s){const r=t.href,i=t.title?c(t.title):null,l=e[1].replace(/\\([\[\]])/g,"$1");if("!"!==e[0].charAt(0)){s.state.inLink=!0;const e={type:"link",raw:n,href:r,title:i,text:l,tokens:s.inlineTokens(l)};return s.state.inLink=!1,e}return{type:"image",raw:n,href:r,title:i,text:c(l)}}class w{options;rules;lexer;constructor(t){this.options=t||e.defaults}space(e){const t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){const t=this.rules.block.code.exec(e);if(t){const e=t[0].replace(/^ {1,4}/gm,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?e:x(e,"\n")}}}fences(e){const t=this.rules.block.fences.exec(e);if(t){const e=t[0],n=function(e,t){const n=e.match(/^(\s+)(?:```)/);if(null===n)return t;const s=n[1];return t.split("\n").map((e=>{const t=e.match(/^\s+/);if(null===t)return e;const[n]=t;return n.length>=s.length?e.slice(s.length):e})).join("\n")}(e,t[3]||"");return{type:"code",raw:e,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:n}}}heading(e){const t=this.rules.block.heading.exec(e);if(t){let e=t[2].trim();if(/#$/.test(e)){const t=x(e,"#");this.options.pedantic?e=t.trim():t&&!/ $/.test(t)||(e=t.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:e,tokens:this.lexer.inline(e)}}}hr(e){const t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:t[0]}}blockquote(e){const t=this.rules.block.blockquote.exec(e);if(t){let e=t[0].replace(/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,"\n    $1");e=x(e.replace(/^ *>[ \t]?/gm,""),"\n");const n=this.lexer.state.top;this.lexer.state.top=!0;const s=this.lexer.blockTokens(e);return this.lexer.state.top=n,{type:"blockquote",raw:t[0],tokens:s,text:e}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim();const s=n.length>1,r={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");const i=new RegExp(`^( {0,3}${n})((?:[\t ][^\\n]*)?(?:\\n|$))`);let l="",o="",a=!1;for(;e;){let n=!1;if(!(t=i.exec(e)))break;if(this.rules.block.hr.test(e))break;l=t[0],e=e.substring(l.length);let s=t[2].split("\n",1)[0].replace(/^\t+/,(e=>" ".repeat(3*e.length))),c=e.split("\n",1)[0],h=0;this.options.pedantic?(h=2,o=s.trimStart()):(h=t[2].search(/[^ ]/),h=h>4?1:h,o=s.slice(h),h+=t[1].length);let p=!1;if(!s&&/^ *$/.test(c)&&(l+=c+"\n",e=e.substring(c.length+1),n=!0),!n){const t=new RegExp(`^ {0,${Math.min(3,h-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ \t][^\\n]*)?(?:\\n|$))`),n=new RegExp(`^ {0,${Math.min(3,h-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),r=new RegExp(`^ {0,${Math.min(3,h-1)}}(?:\`\`\`|~~~)`),i=new RegExp(`^ {0,${Math.min(3,h-1)}}#`);for(;e;){const a=e.split("\n",1)[0];if(c=a,this.options.pedantic&&(c=c.replace(/^ {1,4}(?=( {4})*[^ ])/g,"  ")),r.test(c))break;if(i.test(c))break;if(t.test(c))break;if(n.test(e))break;if(c.search(/[^ ]/)>=h||!c.trim())o+="\n"+c.slice(h);else{if(p)break;if(s.search(/[^ ]/)>=4)break;if(r.test(s))break;if(i.test(s))break;if(n.test(s))break;o+="\n"+c}p||c.trim()||(p=!0),l+=a+"\n",e=e.substring(a.length+1),s=c.slice(h)}}r.loose||(a?r.loose=!0:/\n *\n *$/.test(l)&&(a=!0));let u,k=null;this.options.gfm&&(k=/^\[[ xX]\] /.exec(o),k&&(u="[ ] "!==k[0],o=o.replace(/^\[[ xX]\] +/,""))),r.items.push({type:"list_item",raw:l,task:!!k,checked:u,loose:!1,text:o,tokens:[]}),r.raw+=l}r.items[r.items.length-1].raw=l.trimEnd(),r.items[r.items.length-1].text=o.trimEnd(),r.raw=r.raw.trimEnd();for(let e=0;e<r.items.length;e++)if(this.lexer.state.top=!1,r.items[e].tokens=this.lexer.blockTokens(r.items[e].text,[]),!r.loose){const t=r.items[e].tokens.filter((e=>"space"===e.type)),n=t.length>0&&t.some((e=>/\n.*\n/.test(e.raw)));r.loose=n}if(r.loose)for(let e=0;e<r.items.length;e++)r.items[e].loose=!0;return r}}html(e){const t=this.rules.block.html.exec(e);if(t){return{type:"html",block:!0,raw:t[0],pre:"pre"===t[1]||"script"===t[1]||"style"===t[1],text:t[0]}}}def(e){const t=this.rules.block.def.exec(e);if(t){const e=t[1].toLowerCase().replace(/\s+/g," "),n=t[2]?t[2].replace(/^<(.*)>$/,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",s=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:e,raw:t[0],href:n,title:s}}}table(e){const t=this.rules.block.table.exec(e);if(!t)return;if(!/[:|]/.test(t[2]))return;const n=d(t[1]),s=t[2].replace(/^\||\| *$/g,"").split("|"),r=t[3]&&t[3].trim()?t[3].replace(/\n[ \t]*$/,"").split("\n"):[],i={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===s.length){for(const e of s)/^ *-+: *$/.test(e)?i.align.push("right"):/^ *:-+: *$/.test(e)?i.align.push("center"):/^ *:-+ *$/.test(e)?i.align.push("left"):i.align.push(null);for(const e of n)i.header.push({text:e,tokens:this.lexer.inline(e)});for(const e of r)i.rows.push(d(e,i.header.length).map((e=>({text:e,tokens:this.lexer.inline(e)}))));return i}}lheading(e){const t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:"="===t[2].charAt(0)?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){const t=this.rules.block.paragraph.exec(e);if(t){const e="\n"===t[1].charAt(t[1].length-1)?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:e,tokens:this.lexer.inline(e)}}}text(e){const t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){const t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:c(t[1])}}tag(e){const t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&/^<a /i.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&/^<\/a>/i.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&/^<(pre|code|kbd|script)(\s|>)/i.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&/^<\/(pre|code|kbd|script)(\s|>)/i.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){const t=this.rules.inline.link.exec(e);if(t){const e=t[2].trim();if(!this.options.pedantic&&/^</.test(e)){if(!/>$/.test(e))return;const t=x(e.slice(0,-1),"\\");if((e.length-t.length)%2==0)return}else{const e=function(e,t){if(-1===e.indexOf(t[1]))return-1;let n=0;for(let s=0;s<e.length;s++)if("\\"===e[s])s++;else if(e[s]===t[0])n++;else if(e[s]===t[1]&&(n--,n<0))return s;return-1}(t[2],"()");if(e>-1){const n=(0===t[0].indexOf("!")?5:4)+t[1].length+e;t[2]=t[2].substring(0,e),t[0]=t[0].substring(0,n).trim(),t[3]=""}}let n=t[2],s="";if(this.options.pedantic){const e=/^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(n);e&&(n=e[1],s=e[3])}else s=t[3]?t[3].slice(1,-1):"";return n=n.trim(),/^</.test(n)&&(n=this.options.pedantic&&!/>$/.test(e)?n.slice(1):n.slice(1,-1)),b(t,{href:n?n.replace(this.rules.inline.anyPunctuation,"$1"):n,title:s?s.replace(this.rules.inline.anyPunctuation,"$1"):s},t[0],this.lexer)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){const e=t[(n[2]||n[1]).replace(/\s+/g," ").toLowerCase()];if(!e){const e=n[0].charAt(0);return{type:"text",raw:e,text:e}}return b(n,e,n[0],this.lexer)}}emStrong(e,t,n=""){let s=this.rules.inline.emStrongLDelim.exec(e);if(!s)return;if(s[3]&&n.match(/[\p{L}\p{N}]/u))return;if(!(s[1]||s[2]||"")||!n||this.rules.inline.punctuation.exec(n)){const n=[...s[0]].length-1;let r,i,l=n,o=0;const a="*"===s[0][0]?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(a.lastIndex=0,t=t.slice(-1*e.length+n);null!=(s=a.exec(t));){if(r=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!r)continue;if(i=[...r].length,s[3]||s[4]){l+=i;continue}if((s[5]||s[6])&&n%3&&!((n+i)%3)){o+=i;continue}if(l-=i,l>0)continue;i=Math.min(i,i+l+o);const t=[...s[0]][0].length,a=e.slice(0,n+s.index+t+i);if(Math.min(n,i)%2){const e=a.slice(1,-1);return{type:"em",raw:a,text:e,tokens:this.lexer.inlineTokens(e)}}const c=a.slice(2,-2);return{type:"strong",raw:a,text:c,tokens:this.lexer.inlineTokens(c)}}}}codespan(e){const t=this.rules.inline.code.exec(e);if(t){let e=t[2].replace(/\n/g," ");const n=/[^ ]/.test(e),s=/^ /.test(e)&&/ $/.test(e);return n&&s&&(e=e.substring(1,e.length-1)),e=c(e,!0),{type:"codespan",raw:t[0],text:e}}}br(e){const t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e){const t=this.rules.inline.del.exec(e);if(t)return{type:"del",raw:t[0],text:t[2],tokens:this.lexer.inlineTokens(t[2])}}autolink(e){const t=this.rules.inline.autolink.exec(e);if(t){let e,n;return"@"===t[2]?(e=c(t[1]),n="mailto:"+e):(e=c(t[1]),n=e),{type:"link",raw:t[0],text:e,href:n,tokens:[{type:"text",raw:e,text:e}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let e,n;if("@"===t[2])e=c(t[0]),n="mailto:"+e;else{let s;do{s=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??""}while(s!==t[0]);e=c(t[0]),n="www."===t[1]?"http://"+t[0]:t[0]}return{type:"link",raw:t[0],text:e,href:n,tokens:[{type:"text",raw:e,text:e}]}}}inlineText(e){const t=this.rules.inline.text.exec(e);if(t){let e;return e=this.lexer.state.inRawBlock?t[0]:c(t[0]),{type:"text",raw:t[0],text:e}}}}const m=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,y=/(?:[*+-]|\d{1,9}[.)])/,$=k(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g,y).replace(/blockCode/g,/ {4}/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).getRegex(),z=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,T=/(?!\s*\])(?:\\.|[^\[\]\\])+/,R=k(/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/).replace("label",T).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),_=k(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,y).getRegex(),A="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",S=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,I=k("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))","i").replace("comment",S).replace("tag",A).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),E=k(z).replace("hr",m).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",A).getRegex(),q={blockquote:k(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",E).getRegex(),code:/^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,def:R,fences:/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,heading:/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,hr:m,html:I,lheading:$,list:_,newline:/^(?: *(?:\n|$))+/,paragraph:E,table:f,text:/^[^\n]+/},Z=k("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",m).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code"," {4}[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",A).getRegex(),L={...q,table:Z,paragraph:k(z).replace("hr",m).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Z).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",A).getRegex()},P={...q,html:k("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment",S).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:f,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:k(z).replace("hr",m).replace("heading"," *#{1,6} *[^\n]").replace("lheading",$).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Q=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,v=/^( {2,}|\\)\n(?!\s*$)/,B="\\p{P}\\p{S}",C=k(/^((?![*_])[\spunctuation])/,"u").replace(/punctuation/g,B).getRegex(),M=k(/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/,"u").replace(/punct/g,B).getRegex(),O=k("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])","gu").replace(/punct/g,B).getRegex(),D=k("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])","gu").replace(/punct/g,B).getRegex(),j=k(/\\([punct])/,"gu").replace(/punct/g,B).getRegex(),H=k(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),U=k(S).replace("(?:--\x3e|$)","--\x3e").getRegex(),X=k("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",U).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),F=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,N=k(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label",F).replace("href",/<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),G=k(/^!?\[(label)\]\[(ref)\]/).replace("label",F).replace("ref",T).getRegex(),J=k(/^!?\[(ref)\](?:\[\])?/).replace("ref",T).getRegex(),K={_backpedal:f,anyPunctuation:j,autolink:H,blockSkip:/\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g,br:v,code:/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,del:f,emStrongLDelim:M,emStrongRDelimAst:O,emStrongRDelimUnd:D,escape:Q,link:N,nolink:J,punctuation:C,reflink:G,reflinkSearch:k("reflink|nolink(?!\\()","g").replace("reflink",G).replace("nolink",J).getRegex(),tag:X,text:/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,url:f},V={...K,link:k(/^!?\[(label)\]\((.*?)\)/).replace("label",F).getRegex(),reflink:k(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",F).getRegex()},W={...K,escape:k(Q).replace("])","~|])").getRegex(),url:k(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},Y={...W,br:k(v).replace("{2,}","*").getRegex(),text:k(W.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},ee={normal:q,gfm:L,pedantic:P},te={normal:K,gfm:W,breaks:Y,pedantic:V};class ne{tokens;options;state;tokenizer;inlineQueue;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||e.defaults,this.options.tokenizer=this.options.tokenizer||new w,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const n={block:ee.normal,inline:te.normal};this.options.pedantic?(n.block=ee.pedantic,n.inline=te.pedantic):this.options.gfm&&(n.block=ee.gfm,this.options.breaks?n.inline=te.breaks:n.inline=te.gfm),this.tokenizer.rules=n}static get rules(){return{block:ee,inline:te}}static lex(e,t){return new ne(t).lex(e)}static lexInline(e,t){return new ne(t).inlineTokens(e)}lex(e){e=e.replace(/\r\n|\r/g,"\n"),this.blockTokens(e,this.tokens);for(let e=0;e<this.inlineQueue.length;e++){const t=this.inlineQueue[e];this.inlineTokens(t.src,t.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[]){let n,s,r,i;for(e=this.options.pedantic?e.replace(/\t/g,"    ").replace(/^ +$/gm,""):e.replace(/^( *)(\t+)/gm,((e,t,n)=>t+"    ".repeat(n.length)));e;)if(!(this.options.extensions&&this.options.extensions.block&&this.options.extensions.block.some((s=>!!(n=s.call({lexer:this},e,t))&&(e=e.substring(n.raw.length),t.push(n),!0)))))if(n=this.tokenizer.space(e))e=e.substring(n.raw.length),1===n.raw.length&&t.length>0?t[t.length-1].raw+="\n":t.push(n);else if(n=this.tokenizer.code(e))e=e.substring(n.raw.length),s=t[t.length-1],!s||"paragraph"!==s.type&&"text"!==s.type?t.push(n):(s.raw+="\n"+n.raw,s.text+="\n"+n.text,this.inlineQueue[this.inlineQueue.length-1].src=s.text);else if(n=this.tokenizer.fences(e))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.heading(e))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.hr(e))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.blockquote(e))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.list(e))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.html(e))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.def(e))e=e.substring(n.raw.length),s=t[t.length-1],!s||"paragraph"!==s.type&&"text"!==s.type?this.tokens.links[n.tag]||(this.tokens.links[n.tag]={href:n.href,title:n.title}):(s.raw+="\n"+n.raw,s.text+="\n"+n.raw,this.inlineQueue[this.inlineQueue.length-1].src=s.text);else if(n=this.tokenizer.table(e))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.lheading(e))e=e.substring(n.raw.length),t.push(n);else{if(r=e,this.options.extensions&&this.options.extensions.startBlock){let t=1/0;const n=e.slice(1);let s;this.options.extensions.startBlock.forEach((e=>{s=e.call({lexer:this},n),"number"==typeof s&&s>=0&&(t=Math.min(t,s))})),t<1/0&&t>=0&&(r=e.substring(0,t+1))}if(this.state.top&&(n=this.tokenizer.paragraph(r)))s=t[t.length-1],i&&"paragraph"===s.type?(s.raw+="\n"+n.raw,s.text+="\n"+n.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=s.text):t.push(n),i=r.length!==e.length,e=e.substring(n.raw.length);else if(n=this.tokenizer.text(e))e=e.substring(n.raw.length),s=t[t.length-1],s&&"text"===s.type?(s.raw+="\n"+n.raw,s.text+="\n"+n.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=s.text):t.push(n);else if(e){const t="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(t);break}throw new Error(t)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){let n,s,r,i,l,o,a=e;if(this.tokens.links){const e=Object.keys(this.tokens.links);if(e.length>0)for(;null!=(i=this.tokenizer.rules.inline.reflinkSearch.exec(a));)e.includes(i[0].slice(i[0].lastIndexOf("[")+1,-1))&&(a=a.slice(0,i.index)+"["+"a".repeat(i[0].length-2)+"]"+a.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;null!=(i=this.tokenizer.rules.inline.blockSkip.exec(a));)a=a.slice(0,i.index)+"["+"a".repeat(i[0].length-2)+"]"+a.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);for(;null!=(i=this.tokenizer.rules.inline.anyPunctuation.exec(a));)a=a.slice(0,i.index)+"++"+a.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);for(;e;)if(l||(o=""),l=!1,!(this.options.extensions&&this.options.extensions.inline&&this.options.extensions.inline.some((s=>!!(n=s.call({lexer:this},e,t))&&(e=e.substring(n.raw.length),t.push(n),!0)))))if(n=this.tokenizer.escape(e))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.tag(e))e=e.substring(n.raw.length),s=t[t.length-1],s&&"text"===n.type&&"text"===s.type?(s.raw+=n.raw,s.text+=n.text):t.push(n);else if(n=this.tokenizer.link(e))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.reflink(e,this.tokens.links))e=e.substring(n.raw.length),s=t[t.length-1],s&&"text"===n.type&&"text"===s.type?(s.raw+=n.raw,s.text+=n.text):t.push(n);else if(n=this.tokenizer.emStrong(e,a,o))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.codespan(e))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.br(e))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.del(e))e=e.substring(n.raw.length),t.push(n);else if(n=this.tokenizer.autolink(e))e=e.substring(n.raw.length),t.push(n);else if(this.state.inLink||!(n=this.tokenizer.url(e))){if(r=e,this.options.extensions&&this.options.extensions.startInline){let t=1/0;const n=e.slice(1);let s;this.options.extensions.startInline.forEach((e=>{s=e.call({lexer:this},n),"number"==typeof s&&s>=0&&(t=Math.min(t,s))})),t<1/0&&t>=0&&(r=e.substring(0,t+1))}if(n=this.tokenizer.inlineText(r))e=e.substring(n.raw.length),"_"!==n.raw.slice(-1)&&(o=n.raw.slice(-1)),l=!0,s=t[t.length-1],s&&"text"===s.type?(s.raw+=n.raw,s.text+=n.text):t.push(n);else if(e){const t="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(t);break}throw new Error(t)}}else e=e.substring(n.raw.length),t.push(n);return t}}class se{options;constructor(t){this.options=t||e.defaults}code(e,t,n){const s=(t||"").match(/^\S*/)?.[0];return e=e.replace(/\n$/,"")+"\n",s?'<pre><code class="language-'+c(s)+'">'+(n?e:c(e,!0))+"</code></pre>\n":"<pre><code>"+(n?e:c(e,!0))+"</code></pre>\n"}blockquote(e){return`<blockquote>\n${e}</blockquote>\n`}html(e,t){return e}heading(e,t,n){return`<h${t}>${e}</h${t}>\n`}hr(){return"<hr>\n"}list(e,t,n){const s=t?"ol":"ul";return"<"+s+(t&&1!==n?' start="'+n+'"':"")+">\n"+e+"</"+s+">\n"}listitem(e,t,n){return`<li>${e}</li>\n`}checkbox(e){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph(e){return`<p>${e}</p>\n`}table(e,t){return t&&(t=`<tbody>${t}</tbody>`),"<table>\n<thead>\n"+e+"</thead>\n"+t+"</table>\n"}tablerow(e){return`<tr>\n${e}</tr>\n`}tablecell(e,t){const n=t.header?"th":"td";return(t.align?`<${n} align="${t.align}">`:`<${n}>`)+e+`</${n}>\n`}strong(e){return`<strong>${e}</strong>`}em(e){return`<em>${e}</em>`}codespan(e){return`<code>${e}</code>`}br(){return"<br>"}del(e){return`<del>${e}</del>`}link(e,t,n){const s=g(e);if(null===s)return n;let r='<a href="'+(e=s)+'"';return t&&(r+=' title="'+t+'"'),r+=">"+n+"</a>",r}image(e,t,n){const s=g(e);if(null===s)return n;let r=`<img src="${e=s}" alt="${n}"`;return t&&(r+=` title="${t}"`),r+=">",r}text(e){return e}}class re{strong(e){return e}em(e){return e}codespan(e){return e}del(e){return e}html(e){return e}text(e){return e}link(e,t,n){return""+n}image(e,t,n){return""+n}br(){return""}}class ie{options;renderer;textRenderer;constructor(t){this.options=t||e.defaults,this.options.renderer=this.options.renderer||new se,this.renderer=this.options.renderer,this.renderer.options=this.options,this.textRenderer=new re}static parse(e,t){return new ie(t).parse(e)}static parseInline(e,t){return new ie(t).parseInline(e)}parse(e,t=!0){let n="";for(let s=0;s<e.length;s++){const r=e[s];if(this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[r.type]){const e=r,t=this.options.extensions.renderers[e.type].call({parser:this},e);if(!1!==t||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(e.type)){n+=t||"";continue}}switch(r.type){case"space":continue;case"hr":n+=this.renderer.hr();continue;case"heading":{const e=r;n+=this.renderer.heading(this.parseInline(e.tokens),e.depth,p(this.parseInline(e.tokens,this.textRenderer)));continue}case"code":{const e=r;n+=this.renderer.code(e.text,e.lang,!!e.escaped);continue}case"table":{const e=r;let t="",s="";for(let t=0;t<e.header.length;t++)s+=this.renderer.tablecell(this.parseInline(e.header[t].tokens),{header:!0,align:e.align[t]});t+=this.renderer.tablerow(s);let i="";for(let t=0;t<e.rows.length;t++){const n=e.rows[t];s="";for(let t=0;t<n.length;t++)s+=this.renderer.tablecell(this.parseInline(n[t].tokens),{header:!1,align:e.align[t]});i+=this.renderer.tablerow(s)}n+=this.renderer.table(t,i);continue}case"blockquote":{const e=r,t=this.parse(e.tokens);n+=this.renderer.blockquote(t);continue}case"list":{const e=r,t=e.ordered,s=e.start,i=e.loose;let l="";for(let t=0;t<e.items.length;t++){const n=e.items[t],s=n.checked,r=n.task;let o="";if(n.task){const e=this.renderer.checkbox(!!s);i?n.tokens.length>0&&"paragraph"===n.tokens[0].type?(n.tokens[0].text=e+" "+n.tokens[0].text,n.tokens[0].tokens&&n.tokens[0].tokens.length>0&&"text"===n.tokens[0].tokens[0].type&&(n.tokens[0].tokens[0].text=e+" "+n.tokens[0].tokens[0].text)):n.tokens.unshift({type:"text",text:e+" "}):o+=e+" "}o+=this.parse(n.tokens,i),l+=this.renderer.listitem(o,r,!!s)}n+=this.renderer.list(l,t,s);continue}case"html":{const e=r;n+=this.renderer.html(e.text,e.block);continue}case"paragraph":{const e=r;n+=this.renderer.paragraph(this.parseInline(e.tokens));continue}case"text":{let i=r,l=i.tokens?this.parseInline(i.tokens):i.text;for(;s+1<e.length&&"text"===e[s+1].type;)i=e[++s],l+="\n"+(i.tokens?this.parseInline(i.tokens):i.text);n+=t?this.renderer.paragraph(l):l;continue}default:{const e='Token with "'+r.type+'" type was not found.';if(this.options.silent)return console.error(e),"";throw new Error(e)}}}return n}parseInline(e,t){t=t||this.renderer;let n="";for(let s=0;s<e.length;s++){const r=e[s];if(this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[r.type]){const e=this.options.extensions.renderers[r.type].call({parser:this},r);if(!1!==e||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(r.type)){n+=e||"";continue}}switch(r.type){case"escape":{const e=r;n+=t.text(e.text);break}case"html":{const e=r;n+=t.html(e.text);break}case"link":{const e=r;n+=t.link(e.href,e.title,this.parseInline(e.tokens,t));break}case"image":{const e=r;n+=t.image(e.href,e.title,e.text);break}case"strong":{const e=r;n+=t.strong(this.parseInline(e.tokens,t));break}case"em":{const e=r;n+=t.em(this.parseInline(e.tokens,t));break}case"codespan":{const e=r;n+=t.codespan(e.text);break}case"br":n+=t.br();break;case"del":{const e=r;n+=t.del(this.parseInline(e.tokens,t));break}case"text":{const e=r;n+=t.text(e.text);break}default:{const e='Token with "'+r.type+'" type was not found.';if(this.options.silent)return console.error(e),"";throw new Error(e)}}}return n}}class le{options;constructor(t){this.options=t||e.defaults}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}}class oe{defaults={async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null};options=this.setOptions;parse=this.#e(ne.lex,ie.parse);parseInline=this.#e(ne.lexInline,ie.parseInline);Parser=ie;Renderer=se;TextRenderer=re;Lexer=ne;Tokenizer=w;Hooks=le;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(const s of e)switch(n=n.concat(t.call(this,s)),s.type){case"table":{const e=s;for(const s of e.header)n=n.concat(this.walkTokens(s.tokens,t));for(const s of e.rows)for(const e of s)n=n.concat(this.walkTokens(e.tokens,t));break}case"list":{const e=s;n=n.concat(this.walkTokens(e.items,t));break}default:{const e=s;this.defaults.extensions?.childTokens?.[e.type]?this.defaults.extensions.childTokens[e.type].forEach((s=>{const r=e[s].flat(1/0);n=n.concat(this.walkTokens(r,t))})):e.tokens&&(n=n.concat(this.walkTokens(e.tokens,t)))}}return n}use(...e){const t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach((e=>{const n={...e};if(n.async=this.defaults.async||n.async||!1,e.extensions&&(e.extensions.forEach((e=>{if(!e.name)throw new Error("extension name required");if("renderer"in e){const n=t.renderers[e.name];t.renderers[e.name]=n?function(...t){let s=e.renderer.apply(this,t);return!1===s&&(s=n.apply(this,t)),s}:e.renderer}if("tokenizer"in e){if(!e.level||"block"!==e.level&&"inline"!==e.level)throw new Error("extension level must be 'block' or 'inline'");const n=t[e.level];n?n.unshift(e.tokenizer):t[e.level]=[e.tokenizer],e.start&&("block"===e.level?t.startBlock?t.startBlock.push(e.start):t.startBlock=[e.start]:"inline"===e.level&&(t.startInline?t.startInline.push(e.start):t.startInline=[e.start]))}"childTokens"in e&&e.childTokens&&(t.childTokens[e.name]=e.childTokens)})),n.extensions=t),e.renderer){const t=this.defaults.renderer||new se(this.defaults);for(const n in e.renderer){if(!(n in t))throw new Error(`renderer '${n}' does not exist`);if("options"===n)continue;const s=n,r=e.renderer[s],i=t[s];t[s]=(...e)=>{let n=r.apply(t,e);return!1===n&&(n=i.apply(t,e)),n||""}}n.renderer=t}if(e.tokenizer){const t=this.defaults.tokenizer||new w(this.defaults);for(const n in e.tokenizer){if(!(n in t))throw new Error(`tokenizer '${n}' does not exist`);if(["options","rules","lexer"].includes(n))continue;const s=n,r=e.tokenizer[s],i=t[s];t[s]=(...e)=>{let n=r.apply(t,e);return!1===n&&(n=i.apply(t,e)),n}}n.tokenizer=t}if(e.hooks){const t=this.defaults.hooks||new le;for(const n in e.hooks){if(!(n in t))throw new Error(`hook '${n}' does not exist`);if("options"===n)continue;const s=n,r=e.hooks[s],i=t[s];le.passThroughHooks.has(n)?t[s]=e=>{if(this.defaults.async)return Promise.resolve(r.call(t,e)).then((e=>i.call(t,e)));const n=r.call(t,e);return i.call(t,n)}:t[s]=(...e)=>{let n=r.apply(t,e);return!1===n&&(n=i.apply(t,e)),n}}n.hooks=t}if(e.walkTokens){const t=this.defaults.walkTokens,s=e.walkTokens;n.walkTokens=function(e){let n=[];return n.push(s.call(this,e)),t&&(n=n.concat(t.call(this,e))),n}}this.defaults={...this.defaults,...n}})),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return ne.lex(e,t??this.defaults)}parser(e,t){return ie.parse(e,t??this.defaults)}#e(e,t){return(n,s)=>{const r={...s},i={...this.defaults,...r};!0===this.defaults.async&&!1===r.async&&(i.silent||console.warn("marked(): The async option was set to true by an extension. The async: false option sent to parse will be ignored."),i.async=!0);const l=this.#t(!!i.silent,!!i.async);if(null==n)return l(new Error("marked(): input parameter is undefined or null"));if("string"!=typeof n)return l(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(n)+", string expected"));if(i.hooks&&(i.hooks.options=i),i.async)return Promise.resolve(i.hooks?i.hooks.preprocess(n):n).then((t=>e(t,i))).then((e=>i.hooks?i.hooks.processAllTokens(e):e)).then((e=>i.walkTokens?Promise.all(this.walkTokens(e,i.walkTokens)).then((()=>e)):e)).then((e=>t(e,i))).then((e=>i.hooks?i.hooks.postprocess(e):e)).catch(l);try{i.hooks&&(n=i.hooks.preprocess(n));let s=e(n,i);i.hooks&&(s=i.hooks.processAllTokens(s)),i.walkTokens&&this.walkTokens(s,i.walkTokens);let r=t(s,i);return i.hooks&&(r=i.hooks.postprocess(r)),r}catch(e){return l(e)}}}#t(e,t){return n=>{if(n.message+="\nPlease report this to https://github.com/markedjs/marked.",e){const e="<p>An error occurred:</p><pre>"+c(n.message+"",!0)+"</pre>";return t?Promise.resolve(e):e}if(t)return Promise.reject(n);throw n}}}const ae=new oe;function ce(e,t){return ae.parse(e,t)}ce.options=ce.setOptions=function(e){return ae.setOptions(e),ce.defaults=ae.defaults,n(ce.defaults),ce},ce.getDefaults=t,ce.defaults=e.defaults,ce.use=function(...e){return ae.use(...e),ce.defaults=ae.defaults,n(ce.defaults),ce},ce.walkTokens=function(e,t){return ae.walkTokens(e,t)},ce.parseInline=ae.parseInline,ce.Parser=ie,ce.parser=ie.parse,ce.Renderer=se,ce.TextRenderer=re,ce.Lexer=ne,ce.lexer=ne.lex,ce.Tokenizer=w,ce.Hooks=le,ce.parse=ce;const he=ce.options,pe=ce.setOptions,ue=ce.use,ke=ce.walkTokens,ge=ce.parseInline,fe=ce,de=ie.parse,xe=ne.lex;e.Hooks=le,e.Lexer=ne,e.Marked=oe,e.Parser=ie,e.Renderer=se,e.TextRenderer=re,e.Tokenizer=w,e.getDefaults=t,e.lexer=xe,e.marked=ce,e.options=he,e.parse=fe,e.parseInline=ge,e.parser=de,e.setOptions=pe,e.use=ue,e.walkTokens=ke}));
  window.__DSH_LONG_INPUT_MARKED__ = module.exports;
})();
/* global __DSH_LONG_INPUT_MARKED__ */
/**
 * dsh-long-input — the Client half.
 *
 * The trigger button and the dialog live in two different slots:
 *   - conversation.input.left: the compact button in the composer tool row;
 *   - shell.overlay: the frame-wide dialog layer.
 * A tiny external store joins them. The dialog is intentionally independent of
 * the composer: it starts empty, and only "Insert" writes the Markdown source
 * back, replacing the whole draft through inputActions.setDraft().
 */
window.__ModuleLoader__.load({
  id: '@local/dsh-long-input',
  factory(require) {
    'use strict';

    const React = require('react');
    const h = React.createElement;
    const marked = window.__DSH_LONG_INPUT_MARKED__;

    const NS = 'dsh-long-input';
    const SPLIT_KEY = 'dsh-long-input:split';
    const CLOSE_CHOICE_KEY = 'dsh-long-input:closeChoice';
    const SPLIT_MIN = 20;
    const SPLIT_MAX = 80;
    const SPLIT_DEFAULT = 50;
    /** Keep the token-count implementation in-tree, but hide it for now. */
    const SHOW_TOKEN_COUNT = false;

    const DICT_EN = {
      button: 'Long Input',
      openHint: 'Open the long content editor',
      title: 'Long Input',
      subtitle: 'Markdown editor',
      close: 'Close',
      editorLabel: 'Markdown source',
      placeholder: 'Write your Markdown here…',
      previewEmpty: 'Rendered Markdown appears here as you type.',
      cancel: 'Cancel',
      confirm: 'Insert',
      hint: 'Enter for newline · Ctrl+Enter to insert · Esc to close',
      resize: 'Drag to resize the editor and preview',
      writeFailed: 'Could not write to the composer. The dialog stays open.',
      closeTitle: 'Close window',
      closeMessage: 'Write the current content back to the composer?',
      discardAndClose: 'Discard and close',
      saveAndClose: 'Save and close',
      rememberChoice: 'Remember my choice',
      settingsTitle: 'When closing',
      settingsDesc: 'Choose the default close behavior. With neither selected, every close shows the confirmation dialog. Changes apply immediately.',
      settingsDiscard: 'Discard and close',
      settingsDiscardHint: 'Close without changing the composer draft.',
      settingsSave: 'Save and close',
      settingsSaveHint: 'Replace the composer draft with the editor content.',
      settingsNoneHint: 'No default selected: each close asks first.',
      settingsCurrentDiscard: 'Current: close without writing back.',
      settingsCurrentSave: 'Current: write back on close.',
      settingsReset: 'Restore defaults',
      settingsResetDone: 'Defaults restored.',
      preservedHint: 'Command / references kept outside the editor',
      tokenCountPrefix: '~',
      tokenCountSuffix: ' tokens',
      tokenCountTitle: 'Estimated at 4 characters per token; CJK may be undercounted.',
    };

    const DICT_ZH = {
      button: '长内容输入',
      openHint: '打开长内容编辑器',
      title: '长内容输入',
      subtitle: 'Markdown 编辑',
      close: '关闭',
      editorLabel: 'Markdown 原文',
      placeholder: '在这里用 Markdown 编写长内容…',
      previewEmpty: '右侧会实时显示 Markdown 渲染结果。',
      cancel: '取消',
      confirm: '确定',
      hint: 'Enter 换行 · Ctrl+Enter 确定写回 · Esc 关闭',
      resize: '拖动调整编辑区与预览区宽度',
      writeFailed: '写回输入框失败，弹窗保持打开。',
      closeTitle: '关闭窗口',
      closeMessage: '要把当前内容写回输入框吗？',
      discardAndClose: '退出窗口不写回',
      saveAndClose: '退出并写回',
      rememberChoice: '记住我的选择',
      settingsTitle: '关闭窗口时',
      settingsDesc: '选择关闭弹窗时的默认行为。都不选时，每次关闭都会显示确认框。修改即时生效。',
      settingsDiscard: '退出窗口不写回',
      settingsDiscardHint: '直接关闭，不修改输入框内容。',
      settingsSave: '退出并写回',
      settingsSaveHint: '用编辑区内容覆盖写回输入框。',
      settingsNoneHint: '当前未选择默认行为：每次关闭都会弹出确认框。',
      settingsCurrentDiscard: '当前：关闭时不写回。',
      settingsCurrentSave: '当前：关闭时写回。',
      settingsReset: '恢复默认设置',
      settingsResetDone: '已恢复默认设置。',
      preservedHint: '指令 / 引用已保留在编辑区外',
      tokenCountPrefix: '约 ',
      tokenCountSuffix: ' 个 token',
      tokenCountTitle: '按每 4 个字符约 1 token 估算；中文可能偏低。',
    };

    const CSS = `
.dli-trigger {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  padding: 0 6px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease;
}
.dli-trigger:hover {
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
}
.dli-trigger:focus-visible,
.dli-button:focus-visible,
.dli-close:focus-visible,
.dli-divider:focus-visible,
.dli-settings-reset:focus-visible,
.dli-setting-option:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 2px;
}
.dli-trigger svg {
  flex: none;
  display: block;
}

.dli-scrim {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.42);
  pointer-events: auto;
}
.dli-dialog {
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(1120px, calc(100vw - 48px));
  height: min(760px, calc(100vh - 48px));
  min-height: 280px;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 12px;
  background: var(--dsw-alias-bg-overlay);
  color: var(--dsw-alias-label-primary);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.34);
}
.dli-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex: none;
  padding: 11px 16px;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-1);
}
.dli-head-text {
  display: flex;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
}
.dli-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  white-space: nowrap;
}
.dli-subtitle {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  white-space: nowrap;
}
.dli-preserved-note {
  padding: 1px 6px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 999px;
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  line-height: 1.5;
  white-space: nowrap;
}
.dli-close {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
}
.dli-close:hover {
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
}

.dli-body {
  display: flex;
  flex: 1;
  min-height: 0;
}
.dli-editor-pane {
  display: flex;
  flex: none;
  width: 50%;
  min-width: 0;
  background: var(--dsw-alias-bg-base);
}
.dli-textarea {
  display: block;
  width: 100%;
  height: 100%;
  min-width: 0;
  margin: 0;
  padding: 16px 18px;
  border: 0;
  outline: 0;
  resize: none;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  caret-color: var(--dsw-alias-brand-primary);
  font-family: var(--dsw-font-family);
  font-size: var(--dsh-content-font-size, 14px);
  line-height: calc(24px + var(--dsh-content-font-delta, 0px));
  tab-size: 2;
}
.dli-textarea::placeholder {
  color: var(--dsw-alias-label-secondary);
  opacity: 0.8;
}
.dli-divider {
  position: relative;
  flex: none;
  width: 11px;
  border: 0;
  padding: 0;
  background: var(--dsw-alias-bg-layer-1);
  cursor: col-resize;
  touch-action: none;
  user-select: none;
}
.dli-divider::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 5px;
  width: 1px;
  background: var(--dsw-alias-border-l1);
}
.dli-divider:hover::before,
.dli-divider:focus-visible::before {
  background: var(--dsw-alias-brand-primary);
}
.dli-preview-pane {
  flex: 1;
  min-width: 0;
  overflow: auto;
  padding: 16px 20px 22px;
  border-left: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-base);
}
.dli-empty {
  color: var(--dsw-alias-label-secondary);
  font-family: var(--dsw-font-family);
  font-size: var(--dsh-content-font-size, 14px);
  line-height: calc(24px + var(--dsh-content-font-delta, 0px));
}
.dli-md {
  color: var(--dsw-alias-label-primary);
  font-family: var(--dsw-font-family);
  font-size: var(--dsh-content-font-size, 14px);
  line-height: calc(24px + var(--dsh-content-font-delta, 0px));
  overflow-wrap: anywhere;
}
.dli-md > :first-child {
  margin-top: 0;
}
.dli-md > :last-child {
  margin-bottom: 0;
}
.dli-md h1,
.dli-md h2,
.dli-md h3,
.dli-md h4,
.dli-md h5,
.dli-md h6 {
  margin: 1.25em 0 0.55em;
  font-weight: 600;
  line-height: 1.35;
}
.dli-md h1 {
  padding-bottom: 0.28em;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  font-size: 1.7em;
}
.dli-md h2 {
  padding-bottom: 0.24em;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  font-size: 1.4em;
}
.dli-md h3 { font-size: 1.18em; }
.dli-md p,
.dli-md ul,
.dli-md ol,
.dli-md blockquote,
.dli-md pre,
.dli-md table {
  margin: 0 0 0.9em;
}
.dli-md ul,
.dli-md ol {
  padding-left: 1.55em;
}
.dli-md li + li {
  margin-top: 0.22em;
}
.dli-md a {
  color: var(--dsw-alias-brand-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.dli-md blockquote {
  padding: 0.1em 0 0.1em 1em;
  border-left: 3px solid var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-secondary);
}
.dli-md code {
  padding: 0.12em 0.36em;
  border-radius: 4px;
  background: var(--dsw-alias-bg-layer-2);
  font: 0.9em/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
}
.dli-md pre {
  overflow: auto;
  padding: 12px 14px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 7px;
  background: var(--dsw-alias-bg-layer-1);
}
.dli-md pre code {
  padding: 0;
  background: transparent;
  font-size: 0.88em;
}
.dli-md hr {
  margin: 1.3em 0;
  border: 0;
  border-top: 1px solid var(--dsw-alias-border-l1);
}
.dli-md table {
  width: max-content;
  max-width: 100%;
  border-collapse: collapse;
  font-size: 0.94em;
}
.dli-md th,
.dli-md td {
  padding: 5px 10px;
  border: 1px solid var(--dsw-alias-border-l1);
  text-align: left;
  vertical-align: top;
}
.dli-md th {
  background: var(--dsw-alias-bg-layer-1);
  font-weight: 600;
}
.dli-md img {
  max-width: 100%;
  height: auto;
}
.dli-md input[type="checkbox"] {
  margin: 0 0.35em 0 0;
  vertical-align: middle;
}

.dli-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex: none;
  padding: 10px 16px;
  border-top: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-1);
}
.dli-hint {
  min-width: 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 1.5;
}
.dli-hint.is-error {
  color: var(--dsw-alias-state-error-primary);
}
.dli-foot-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: none;
  min-width: 0;
}
.dli-token-count {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 1.5;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  user-select: none;
}
.dli-actions {
  display: flex;
  flex: none;
  gap: 8px;
}
.dli-button {
  height: 32px;
  padding: 0 16px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 7px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
  line-height: 1;
  cursor: pointer;
}
.dli-button:hover {
  border-color: var(--dsw-alias-border-l2);
}
.dli-button.is-primary {
  border-color: var(--dsw-alias-brand-primary);
  background: var(--dsw-alias-brand-primary);
  color: #ffffff;
}
.dli-button.is-primary:hover {
  opacity: 0.9;
}

.dli-confirm-overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.42);
}
.dli-confirm-card {
  width: min(460px, 100%);
  padding: 18px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 10px;
  background: var(--dsw-alias-bg-overlay);
  color: var(--dsw-alias-label-primary);
  box-shadow: 0 16px 44px rgba(0, 0, 0, 0.3);
}
.dli-confirm-title {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
}
.dli-confirm-text {
  margin: 0 0 16px;
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 1.6;
}
.dli-confirm-actions {
  display: flex;
  gap: 10px;
}
.dli-confirm-actions .dli-button {
  flex: 1 1 0;
  min-width: 0;
  height: 36px;
  padding: 0 12px;
  white-space: normal;
}
.dli-confirm-remember {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 1.5;
  cursor: pointer;
  user-select: none;
}
.dli-confirm-remember input {
  flex: none;
  width: 14px;
  height: 14px;
  margin: 0;
  accent-color: var(--dsw-alias-brand-primary);
}

.dli-settings {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 10px;
  background: var(--dsw-alias-bg-layer-1);
}
.dli-settings-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.dli-settings-heading {
  min-width: 0;
}
.dli-settings-title {
  margin: 0 0 4px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
}
.dli-settings-desc {
  margin: 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 1.6;
}
.dli-settings-reset {
  flex: none;
  height: 28px;
  padding: 0 10px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
}
.dli-settings-reset:hover {
  border-color: var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
}
.dli-settings-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.dli-setting-option {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  min-width: 0;
  padding: 11px 12px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease;
}
.dli-setting-option:hover {
  border-color: var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-2);
}
.dli-setting-option.is-selected {
  border-color: var(--dsw-alias-brand-primary);
  background: var(--dsw-alias-bg-layer-2);
}
.dli-setting-check {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-top: 1px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 5px;
  background: transparent;
  color: #ffffff;
}
.dli-setting-option.is-selected .dli-setting-check {
  border-color: var(--dsw-alias-brand-primary);
  background: var(--dsw-alias-brand-primary);
}
.dli-setting-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.dli-setting-label {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.45;
}
.dli-setting-hint {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 1.5;
}
.dli-settings-current,
.dli-settings-notice {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
}
.dli-settings-current {
  color: var(--dsw-alias-label-secondary);
}
.dli-settings-notice {
  color: var(--dsw-alias-state-success-primary);
}

@media (max-width: 720px) {
  .dli-scrim {
    padding: 8px;
  }
  .dli-dialog {
    width: calc(100vw - 16px);
    height: calc(100vh - 16px);
    border-radius: 9px;
  }
  .dli-subtitle,
  .dli-preserved-note,
  .dli-hint {
    display: none;
  }
  .dli-foot {
    justify-content: flex-end;
  }
  .dli-settings-head {
    flex-direction: column;
    gap: 10px;
  }
  .dli-settings-options {
    grid-template-columns: 1fr;
  }
  .dli-settings-reset {
    align-self: flex-start;
  }
}
`;

    function clampSplit(value) {
      if (!Number.isFinite(value)) return SPLIT_DEFAULT;
      return Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, Math.round(value * 10) / 10));
    }

    function estimateDraftTokens(text) {
      if (typeof text !== 'string' || text.length === 0) return 0;
      return Math.ceil(text.length / 4);
    }

    function readSplit() {
      try {
        const raw = window.localStorage.getItem(SPLIT_KEY);
        if (raw === null) return SPLIT_DEFAULT;
        const parsed = Number.parseFloat(raw);
        return clampSplit(parsed);
      } catch (error) {
        return SPLIT_DEFAULT;
      }
    }

    function saveSplit(value) {
      try {
        window.localStorage.setItem(SPLIT_KEY, String(clampSplit(value)));
      } catch (error) {
        /* Storage may be unavailable; the dialog still works for this open. */
      }
    }

    const closeChoiceListeners = new Set();

    function readCloseChoice() {
      try {
        const raw = window.localStorage.getItem(CLOSE_CHOICE_KEY);
        return raw === 'discard' || raw === 'writeback' ? raw : null;
      } catch (error) {
        return null;
      }
    }

    function notifyCloseChoice() {
      for (const listener of closeChoiceListeners) listener();
    }

    function subscribeCloseChoice(listener) {
      closeChoiceListeners.add(listener);
      return () => closeChoiceListeners.delete(listener);
    }

    function setCloseChoice(choice) {
      const normalized = choice === 'discard' || choice === 'writeback' ? choice : null;
      try {
        if (normalized === null) window.localStorage.removeItem(CLOSE_CHOICE_KEY);
        else window.localStorage.setItem(CLOSE_CHOICE_KEY, normalized);
      } catch (error) {
        /* Storage may be unavailable; the choice still applies to this open. */
      }
      notifyCloseChoice();
      return normalized;
    }

    function saveCloseChoice(choice) {
      return setCloseChoice(choice);
    }

    function useCloseChoice() {
      return React.useSyncExternalStore(subscribeCloseChoice, readCloseChoice, readCloseChoice);
    }

    function copyStructuredReference(occurrence) {
      if (
        !occurrence
        || typeof occurrence.clipboardText !== 'string'
        || occurrence.clipboardText.length === 0
      ) {
        return null;
      }
      return {
        source: occurrence.source,
        ref: occurrence.ref,
        label: occurrence.label,
        clipboardText: occurrence.clipboardText,
        ...occurrence.appearance === undefined ? {} : { appearance: occurrence.appearance },
        ...occurrence.invalid === undefined ? {} : { invalid: occurrence.invalid },
      };
    }

    function stripStructuredDraft(draft, commandToken, occurrences) {
      const ranges = [];
      if (commandToken && draft.startsWith(commandToken)) {
        ranges.push([0, commandToken.length]);
      }
      for (const occurrence of occurrences) {
        if (
          Number.isInteger(occurrence.offset)
          && Number.isInteger(occurrence.length)
          && occurrence.offset >= 0
          && occurrence.length > 0
        ) {
          ranges.push([occurrence.offset, occurrence.offset + occurrence.length]);
        }
      }
      ranges.sort((left, right) => left[0] - right[0]);
      const merged = [];
      for (const range of ranges) {
        const previous = merged[merged.length - 1];
        if (previous && range[0] <= previous[1]) {
          previous[1] = Math.max(previous[1], range[1]);
        } else {
          merged.push([range[0], range[1]]);
        }
      }

      let plain = '';
      let cursor = 0;
      for (const [start, end] of merged) {
        plain += draft.slice(cursor, start);
        cursor = end;
      }
      plain += draft.slice(cursor);
      return plain.replace(/^\s+/, '');
    }

    function buildStructuredDraft(text, structured) {
      if (
        !structured
        || (
          !structured.commandToken
          && (!Array.isArray(structured.references) || structured.references.length === 0)
        )
      ) {
        return text;
      }

      let fullText = '';
      const references = [];
      if (structured.commandToken) fullText += `${structured.commandToken} `;
      for (const reference of structured.references) {
        const offset = fullText.length;
        fullText += reference.clipboardText;
        references.push({
          ...reference,
          offset,
          length: reference.clipboardText.length,
        });
        fullText += ' ';
      }
      fullText += text;

      return {
        text: fullText,
        references,
        ...structured.commandToken === undefined || structured.commandToken === null
          ? {}
          : { command: { token: structured.commandToken } },
      };
    }

    /* ---------------- shared open state ---------------- */

    const dialogState = {
      open: false,
      inputActions: null,
      sessionId: null,
      initialText: '',
      structured: null,
      opener: null,
    };
    let revision = 0;
    const listeners = new Set();

    function subscribeDialog(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }

    function dialogRevision() {
      return revision;
    }

    function publishDialog() {
      revision += 1;
      for (const listener of listeners) listener();
    }

    function resetDialogState() {
      dialogState.open = false;
      dialogState.inputActions = null;
      dialogState.sessionId = null;
      dialogState.initialText = '';
      dialogState.structured = null;
      dialogState.opener = null;
    }

    function openDialog(inputActions, sessionId, inputState) {
      if (dialogState.open) return;
      const draft = typeof inputState?.draft === 'string' ? inputState.draft : '';
      const occurrences = Array.isArray(inputState?.occurrences) ? inputState.occurrences : [];
      const claimedToken = typeof inputState?.claim?.token === 'string'
        ? inputState.claim.token
        : null;
      const commandToken = claimedToken !== null && draft.startsWith(claimedToken)
        ? claimedToken
        : null;
      const references = occurrences
        .map(copyStructuredReference)
        .filter((reference) => reference !== null);

      dialogState.open = true;
      dialogState.inputActions = inputActions;
      dialogState.sessionId = sessionId;
      dialogState.initialText = stripStructuredDraft(draft, commandToken, occurrences);
      dialogState.structured = commandToken === null && references.length === 0
        ? null
        : { commandToken, references };
      dialogState.opener = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
      publishDialog();
    }

    function closeDialog() {
      if (!dialogState.open) return;
      const opener = dialogState.opener;
      resetDialogState();
      publishDialog();
      if (opener && typeof opener.focus === 'function' && opener.isConnected) {
        window.requestAnimationFrame(() => {
          if (opener.isConnected) opener.focus();
        });
      }
    }

    function useDialogRevision() {
      return React.useSyncExternalStore(subscribeDialog, dialogRevision, dialogRevision);
    }

    /* ---------------- small icons ---------------- */

    function TriggerIcon() {
      return h('svg', {
        width: 14,
        height: 14,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
      },
      h('path', { d: 'M9 4H4v5' }),
      h('path', { d: 'M15 4h5v5' }),
      h('path', { d: 'M9 20H4v-5' }),
      h('path', { d: 'M15 20h5v-5' }),
      h('path', { d: 'M8 9h8M8 12.5h8M8 16h5' }));
    }

    function CloseIcon() {
      return h('svg', {
        width: 16,
        height: 16,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        'aria-hidden': 'true',
      },
      h('path', { d: 'M6 6l12 12M18 6L6 18' }));
    }

    function CheckIcon() {
      return h('svg', {
        width: 12,
        height: 12,
        viewBox: '0 0 16 16',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2.2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
      },
      h('path', { d: 'M3 8.5l3.2 3.2L13 4.8' }));
    }

    function CloseBehaviorSettings({ t }) {
      const choice = useCloseChoice();
      const [notice, setNotice] = React.useState('');

      function choose(next) {
        setCloseChoice(readCloseChoice() === next ? null : next);
        setNotice('');
      }

      function resetDefaults() {
        setCloseChoice(null);
        saveSplit(SPLIT_DEFAULT);
        setNotice(t('settingsResetDone'));
      }

      const current = choice === 'discard'
        ? t('settingsCurrentDiscard')
        : choice === 'writeback'
          ? t('settingsCurrentSave')
          : t('settingsNoneHint');

      return h('section', {
        className: 'dli-settings',
        'aria-label': t('settingsTitle'),
      },
      h('div', { className: 'dli-settings-head' },
        h('div', { className: 'dli-settings-heading' },
          h('h3', { className: 'dli-settings-title' }, t('settingsTitle')),
          h('p', { className: 'dli-settings-desc' }, t('settingsDesc'))),
        h('button', {
          type: 'button',
          className: 'dli-settings-reset',
          onClick: resetDefaults,
        }, t('settingsReset'))),
      h('div', { className: 'dli-settings-options' },
        h('button', {
          type: 'button',
          role: 'checkbox',
          'aria-checked': choice === 'discard',
          className: choice === 'discard'
            ? 'dli-setting-option is-selected'
            : 'dli-setting-option',
          onClick: () => choose('discard'),
        },
        h('span', {
          className: 'dli-setting-check',
          'aria-hidden': 'true',
        }, choice === 'discard' ? h(CheckIcon) : null),
        h('span', { className: 'dli-setting-copy' },
          h('span', { className: 'dli-setting-label' }, t('settingsDiscard')),
          h('span', { className: 'dli-setting-hint' }, t('settingsDiscardHint')))),
        h('button', {
          type: 'button',
          role: 'checkbox',
          'aria-checked': choice === 'writeback',
          className: choice === 'writeback'
            ? 'dli-setting-option is-selected'
            : 'dli-setting-option',
          onClick: () => choose('writeback'),
        },
        h('span', {
          className: 'dli-setting-check',
          'aria-hidden': 'true',
        }, choice === 'writeback' ? h(CheckIcon) : null),
        h('span', { className: 'dli-setting-copy' },
          h('span', { className: 'dli-setting-label' }, t('settingsSave')),
          h('span', { className: 'dli-setting-hint' }, t('settingsSaveHint'))))),
      h('p', {
        className: 'dli-settings-current',
        role: 'status',
      }, current),
      notice
        ? h('p', {
          className: 'dli-settings-notice',
          role: 'status',
        }, notice)
        : null);
    }

    /* ---------------- components ---------------- */

    function Dialog({ t }) {
      const [text, setText] = React.useState(() => dialogState.initialText || '');
      const [split, setSplit] = React.useState(readSplit);
      const [error, setError] = React.useState('');
      const [closePromptOpen, setClosePromptOpen] = React.useState(false);
      const [rememberChoice, setRememberChoice] = React.useState(false);
      const dialogRef = React.useRef(null);
      const bodyRef = React.useRef(null);
      const textareaRef = React.useRef(null);
      const stopDragRef = React.useRef(null);
      const closePromptRef = React.useRef(null);
      const closePrimaryRef = React.useRef(null);
      const closePromptOpenRef = React.useRef(false);
      const commitRef = React.useRef(null);
      const requestCloseRef = React.useRef(null);
      closePromptOpenRef.current = closePromptOpen;

      const deferredText = typeof React.useDeferredValue === 'function'
        ? React.useDeferredValue(text)
        : text;

      const html = React.useMemo(() => {
        if (!deferredText.trim()) return '';
        if (!marked || typeof marked.parse !== 'function') return '';
        try {
          return marked.parse(deferredText, { gfm: true, breaks: true });
        } catch (parseError) {
          return '';
        }
      }, [deferredText]);

      const tokenCount = SHOW_TOKEN_COUNT ? estimateDraftTokens(text) : 0;
      const tokenText = SHOW_TOKEN_COUNT
        ? `${tokenCount === 0 ? '' : t('tokenCountPrefix')}${tokenCount.toLocaleString()}${t('tokenCountSuffix')}`
        : '';

      React.useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
          textarea.focus();
          try {
            const end = textarea.value.length;
            textarea.setSelectionRange(end, end);
          } catch (selectionError) {
            /* Selection may be unavailable in an unusual host; focus still works. */
          }
        }
        return () => {
          if (stopDragRef.current) {
            stopDragRef.current();
            stopDragRef.current = null;
          }
        };
      }, []);

      function writeBackToComposer() {
        const inputActions = dialogState.inputActions;
        if (!inputActions || typeof inputActions.setDraft !== 'function') {
          setError(t('writeFailed'));
          return false;
        }
        try {
          inputActions.setDraft(buildStructuredDraft(text, dialogState.structured));
          return true;
        } catch (writeError) {
          setError(t('writeFailed'));
          return false;
        }
      }

      function commit() {
        if (writeBackToComposer()) closeDialog();
      }
      commitRef.current = commit;

      function cancelClosePrompt() {
        setClosePromptOpen(false);
        window.requestAnimationFrame(() => textareaRef.current?.focus());
      }

      function requestClose() {
        const remembered = readCloseChoice();
        if (remembered === 'discard') {
          closeDialog();
          return;
        }
        if (remembered === 'writeback') {
          commit();
          return;
        }
        setRememberChoice(false);
        setClosePromptOpen(true);
      }
      requestCloseRef.current = requestClose;

      function resolveCloseChoice(choice) {
        if (choice === 'writeback') {
          if (!writeBackToComposer()) {
            setClosePromptOpen(false);
            window.requestAnimationFrame(() => textareaRef.current?.focus());
            return;
          }
          if (rememberChoice) saveCloseChoice('writeback');
          closeDialog();
          return;
        }
        if (rememberChoice) saveCloseChoice('discard');
        closeDialog();
      }

      React.useEffect(() => {
        if (closePromptOpen) {
          const primary = closePrimaryRef.current;
          if (primary) primary.focus();
        }
      }, [closePromptOpen]);

      React.useEffect(() => {
        function onGlobalKeyDown(event) {
          if (event.isComposing) return;

          if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            if (closePromptOpenRef.current) cancelClosePrompt();
            else if (requestCloseRef.current) requestCloseRef.current();
            return;
          }

          if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
            if (closePromptOpenRef.current) return;
            event.preventDefault();
            event.stopPropagation();
            if (commitRef.current) commitRef.current();
            return;
          }

          if (event.key !== 'Tab') return;
          const root = closePromptOpenRef.current ? closePromptRef.current : dialogRef.current;
          if (!root) return;
          const focusable = Array.from(root.querySelectorAll(
            'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
          )).filter((element) => element.getClientRects().length > 0);
          if (focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (!root.contains(document.activeElement)) {
            event.preventDefault();
            first.focus();
            return;
          }
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }

        window.addEventListener('keydown', onGlobalKeyDown, true);
        return () => window.removeEventListener('keydown', onGlobalKeyDown, true);
      }, []);

      function updateSplitFromPointer(clientX, bodyRect) {
        if (!bodyRect || bodyRect.width <= 0) return split;
        const next = clampSplit(((clientX - bodyRect.left) / bodyRect.width) * 100);
        setSplit(next);
        return next;
      }

      function startDrag(event) {
        if (event.button !== 0) return;
        event.preventDefault();
        const divider = event.currentTarget;
        const body = bodyRef.current;
        if (!body) return;
        const bodyRect = body.getBoundingClientRect();
        let latest = split;

        let onMove = null;
        let onUp = null;
        const stop = () => {
          if (onMove) divider.removeEventListener('pointermove', onMove);
          if (onUp) {
            divider.removeEventListener('pointerup', onUp);
            divider.removeEventListener('pointercancel', onUp);
          }
          try {
            if (divider.hasPointerCapture && divider.hasPointerCapture(event.pointerId)) {
              divider.releasePointerCapture(event.pointerId);
            }
          } catch (releaseError) {
            /* The pointer may already be gone; nothing else to release. */
          }
          stopDragRef.current = null;
        };
        onMove = (moveEvent) => {
          latest = updateSplitFromPointer(moveEvent.clientX, bodyRect);
        };
        onUp = () => {
          saveSplit(latest);
          stop();
        };

        stopDragRef.current = stop;
        if (divider.setPointerCapture) divider.setPointerCapture(event.pointerId);
        divider.addEventListener('pointermove', onMove);
        divider.addEventListener('pointerup', onUp);
        divider.addEventListener('pointercancel', onUp);
      }

      function onDividerKeyDown(event) {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        const next = clampSplit(split + (event.key === 'ArrowLeft' ? -2 : 2));
        setSplit(next);
        saveSplit(next);
      }

      return h('div', {
        className: 'dli-scrim',
        onMouseDown: (event) => {
          if (event.target === event.currentTarget) event.preventDefault();
        },
      },
        h('div', {
          ref: dialogRef,
          className: 'dli-dialog',
          role: 'dialog',
          'aria-modal': 'true',
          'aria-labelledby': 'dsh-long-input-title',
        },
        h('div', { className: 'dli-head' },
          h('div', { className: 'dli-head-text' },
            h('h2', {
              id: 'dsh-long-input-title',
              className: 'dli-title',
            }, t('title')),
            h('span', { className: 'dli-subtitle' }, t('subtitle')),
            dialogState.structured
              ? h('span', { className: 'dli-preserved-note' }, t('preservedHint'))
              : null),
          h('button', {
            type: 'button',
            className: 'dli-close',
            'aria-label': t('close'),
            title: t('close'),
            onClick: requestClose,
          }, h(CloseIcon))),
        h('div', { className: 'dli-body', ref: bodyRef },
          h('div', {
            className: 'dli-editor-pane',
            style: { width: `${split}%` },
          },
          h('textarea', {
            ref: textareaRef,
            className: 'dli-textarea',
            'aria-label': t('editorLabel'),
            placeholder: t('placeholder'),
            spellCheck: false,
            value: text,
            onChange: (event) => {
              setText(event.target.value);
              if (error) setError('');
            },
          })),
          h('div', {
            className: 'dli-divider',
            role: 'separator',
            tabIndex: 0,
            'aria-label': t('resize'),
            'aria-orientation': 'vertical',
            'aria-valuemin': SPLIT_MIN,
            'aria-valuemax': SPLIT_MAX,
            'aria-valuenow': Math.round(split),
            onPointerDown: startDrag,
            onKeyDown: onDividerKeyDown,
          }),
          h('div', { className: 'dli-preview-pane' },
            html
              ? h('div', {
                className: 'dli-md',
                dangerouslySetInnerHTML: { __html: html },
              })
              : h('div', { className: 'dli-empty' }, t('previewEmpty')))),
        h('div', { className: 'dli-foot' },
          h('span', {
            className: error ? 'dli-hint is-error' : 'dli-hint',
            role: error ? 'alert' : undefined,
          }, error || t('hint')),
          h('div', { className: 'dli-foot-right' },
            SHOW_TOKEN_COUNT
              ? h('span', {
                className: 'dli-token-count',
                title: t('tokenCountTitle'),
              }, tokenText)
              : null,
            h('div', { className: 'dli-actions' },
              h('button', {
                type: 'button',
                className: 'dli-button',
                onClick: requestClose,
              }, t('cancel')),
              h('button', {
                type: 'button',
                className: 'dli-button is-primary',
                onClick: commit,
              }, t('confirm'))))),
        closePromptOpen
          ? h('div', { className: 'dli-confirm-overlay' },
            h('div', {
              ref: closePromptRef,
              className: 'dli-confirm-card',
              role: 'alertdialog',
              'aria-modal': 'true',
              'aria-labelledby': 'dsh-long-input-close-title',
              'aria-describedby': 'dsh-long-input-close-message',
            },
            h('h3', {
              id: 'dsh-long-input-close-title',
              className: 'dli-confirm-title',
            }, t('closeTitle')),
            h('p', {
              id: 'dsh-long-input-close-message',
              className: 'dli-confirm-text',
            }, t('closeMessage')),
            h('div', { className: 'dli-confirm-actions' },
              h('button', {
                type: 'button',
                className: 'dli-button',
                onClick: () => resolveCloseChoice('discard'),
              }, t('discardAndClose')),
              h('button', {
                ref: closePrimaryRef,
                type: 'button',
                className: 'dli-button is-primary',
                onClick: () => resolveCloseChoice('writeback'),
              }, t('saveAndClose'))),
            h('label', { className: 'dli-confirm-remember' },
              h('input', {
                type: 'checkbox',
                checked: rememberChoice,
                onChange: (event) => setRememberChoice(event.target.checked),
              }),
              h('span', null, t('rememberChoice')))))
          : null));
    }

    function DialogHost({ t }) {
      useDialogRevision();
      if (!dialogState.open) return null;
      return h(Dialog, { t });
    }

    function TriggerButton({ inputActions, sessionId, inputState, t }) {
      if (!inputActions || typeof inputActions.setDraft !== 'function') return null;
      return h('button', {
        type: 'button',
        className: 'dli-trigger',
        title: t('openHint'),
        'aria-label': t('openHint'),
        'aria-haspopup': 'dialog',
        onClick: () => openDialog(inputActions, sessionId, inputState),
      }, h(TriggerIcon), h('span', null, t('button')));
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        resetDialogState();

        ctx.effect(() => {
          const style = document.createElement('style');
          style.dataset.dshLongInput = 'styles';
          style.textContent = CSS;
          document.head.appendChild(style);
          return () => style.remove();
        });
        ctx.effect(() => ctx.locale.register(NS, 'en', DICT_EN));
        ctx.effect(() => ctx.locale.register(NS, 'zh', DICT_ZH));
        ctx.effect(() => {
          const onStorage = (event) => {
            if (event.key === CLOSE_CHOICE_KEY || event.key === null) {
              notifyCloseChoice();
            }
          };
          window.addEventListener('storage', onStorage);
          return () => window.removeEventListener('storage', onStorage);
        });

        const locale = ctx.locale;

        function useT() {
          React.useSyncExternalStore(
            (listener) => locale.subscribe(listener),
            () => locale.getSnapshot(),
            () => locale.getSnapshot(),
          );
          return locale.bind(NS);
        }

        function TriggerEntry(props) {
          const t = useT();
          const inputState = props.useInput((state) => state);
          React.useEffect(() => {
            if (dialogState.open && dialogState.sessionId !== props.sessionId) {
              closeDialog();
            }
            return () => {
              if (dialogState.open) closeDialog();
            };
          }, [props.sessionId]);
          return h(TriggerButton, {
            inputActions: props.inputActions,
            sessionId: props.sessionId,
            inputState,
            t,
          });
        }

        function OverlayEntry() {
          return h(DialogHost, { t: useT() });
        }

        function ConfigEntry(props) {
          const t = useT();
          if (props.view === 'summary') return null;
          return h(CloseBehaviorSettings, { t });
        }

        ctx.slots.inject('conversation.input.left', () => ctx.slots.register({
          name: 'conversation.input.left',
          id: 'long-input',
          order: 0,
        }, TriggerEntry));

        ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay',
          id: 'long-input-dialog',
          order: 900,
        }, OverlayEntry));

        ctx.slots.inject('plugins.bundle.config', () => ctx.slots.register({
          name: 'plugins.bundle.config',
          key: '@local/dsh-long-input',
        }, ConfigEntry));
      },
    };
  },
});
