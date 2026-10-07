// Вписывает список имён из NAMES прямо в разметку блока «Все имена»,
// чтобы поисковики видели имена и значения без выполнения скрипта.
// Запускать после любого изменения NAMES:  node tools/bake-names.cjs
const fs=require('fs'),path=require('path');
const file=path.join(__dirname,'..','index.html');
let html=fs.readFileSync(file,'utf8');

const m=html.match(/^var NAMES=(\[.*\]);?\s*$/m);
if(!m)throw new Error('NAMES не найден');
const names=JSON.parse(m[1]);

const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const row=r=>'<button><em'+(r[4]?' class="root"':'')+'>'+esc(r[0])+'</em>'+(r[5]?'<i>'+esc(r[5])+'</i>':'')+'</button>';
const by=g=>names.filter(r=>r[3]===g).sort((a,b)=>a[0].localeCompare(b[0],'ru')).map(row).join('');

const re=/<div class="index" id="index">.*?<\/div>/s;
if(!re.test(html))throw new Error('блок #index не найден');
html=html.replace(re,()=>'<div class="index" id="index">'+by('m')+by('f')+'</div>');
fs.writeFileSync(file,html);
console.log('вписано имён: '+names.length);
