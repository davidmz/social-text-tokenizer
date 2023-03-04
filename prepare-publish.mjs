import { copyFileSync, readFileSync, writeFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', { encoding: 'utf8' }));

delete pkg.devDependencies;
delete pkg.scripts;
delete pkg.publishConfig;

writeFileSync('./build/package.json', JSON.stringify(pkg, null, 2));
copyFileSync('./LICENSE.txt', './build/LICENSE.txt');
writeFileSync('./build/README.md', `See [package home](${pkg.homepage}) for actual README`);
