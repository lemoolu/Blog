const glob = require('glob');
const path = require('path');
const fs = require('fs');

const urlSuffix = 'https://github.com/milolu/Blog/blob/master/';

function getCreateTime(dir){
  console.log(dir);
}

function generateChapter(title) {
  return `## ${title}\n`;
}

function gengeateArticle(dir) {
  let name = path.basename(dir);
  let link = urlSuffix + encodeURI(dir);
  return `* [${name}](${link})\n`;
}

function generate(list) {
  let txt = ['# Blog\n\n'];
  list.forEach(x => {
    txt.push(generateChapter(x.title));
    x.files.forEach(art => {
      txt.push(gengeateArticle(art));
    });
    txt.push('\n');
  });

  fs.writeFile('README.md', txt.join(''), (err) => {
    if (err) throw err;
    console.log('README.md saved!');
  });
}

function main() {
  const list = glob.sync('./posts/*').map(dir => {
    const files = glob.sync(`${dir}/**/*.md`, { nodir: true, ignore: '**/readme.md' });
    return { title: path.basename(dir), files };
  });

  generate(list);
}
// console.log(glob.sync('./posts/*'));

main();
