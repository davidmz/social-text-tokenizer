import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('package.json', { encoding: 'utf8' }));

const { subPackages } = pkg;
const pubDir = pkg.publishConfig?.directory ?? '.';
const distDir = '_dist';

delete pkg.devDependencies;
delete pkg.scripts;
delete pkg.publishConfig;
delete pkg.subPackages;

pkg.main = `./${distDir}/cjs/index.js`;
pkg.module = `./${distDir}/esm/index.js`;
pkg.types = `./index.d.ts`; // Must not exists (?)

pkg.exports = {};
addExportsEntry(pkg.exports);

for (const subPackage of subPackages) {
  addExportsEntry(pkg.exports, subPackage);
  mkdirSync(`${pubDir}/${subPackage}`);
  writeFileSync(
    `${pubDir}/${subPackage}/package.json`,
    JSON.stringify(
      {
        name: `${pkg.name}/${subPackage}`,
        types: `../${distDir}/types/${subPackage}/index.d.ts`,
        main: `../${distDir}/cjs/${subPackage}/index.js`,
        module: `../${distDir}/esm/${subPackage}/index.js`,
        sideEffects: false,
      },
      null,
      2,
    ),
  );
}

writeFileSync(`${pubDir}/package.json`, JSON.stringify(pkg, null, 2));
copyFileSync('LICENSE.txt', `${pubDir}/LICENSE.txt`);
writeFileSync(
  `${pubDir}/README.md`,
  `See [package home](${pkg.homepage}) for actual README`,
);

function addExportsEntry(exportsObj, subPackage = '') {
  if (subPackage) {
    subPackage = '/' + subPackage;
  }
  exportsObj[`.${subPackage}`] = {
    types: `./${distDir}/types${subPackage}/index.d.ts`,
    require: `./${distDir}/cjs${subPackage}/index.js`,
    import: `./${distDir}/esm${subPackage}/index.js`,
    default: `./${distDir}/esm${subPackage}/index.js`,
  };
}
