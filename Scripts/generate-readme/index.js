const glob = require('glob');
const path = require('path');
const fs = require('fs');

const dir = [
  // 'Web' or { name: 'Web', Path: path.resolve('Web')}
  'Web',
  'Tools',
  { name: 'Node', path: 'Node' },
  { name: 'Windows', path: 'Windows' },
];

const urlSuffix = 'https://github.com/milolu/Blog/blob/master/';

function generateTitle(v) {
  return `## ${v}\n`;
}

function gengeateArt(v) {
  let name = path.basename(v);
  let link = urlSuffix + encodeURI(v);
  return `* [${name}](${link})\n`;
}

function generate(list) {
  let txt = ['# Blog\n\n'];
  list.forEach(x => {
    txt.push(generateTitle(x.title));
    x.files.forEach(art => {
      txt.push(gengeateArt(art));
    });
    txt.push('\n');
  });


  fs.writeFile('README.md', txt.join(''), (err) => {
    if (err) throw err;
    console.log('README.md saved!');
  });
}

function main() {
  let list = dir.map(x => {
    let title = x.name || x;
    let files = glob.sync(`${x.path ? x.path : x}/**/*.md`, { nodir: true, ignore: '**/readme.md' })
    return { title, files };
  });

  generate(list);
}

main();