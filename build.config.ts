import { copyFileSync, readFileSync, writeFileSync } from 'fs';
import type { PackageJson } from 'type-fest';
import { defineBuildConfig } from 'unbuild';

const paths = ['', '/filters', '/utils', '/prettifiers'];

const pkgInfo: PackageJson = JSON.parse(
  readFileSync('package.json', { encoding: 'utf8' }),
);
const outDir = (pkgInfo.publishConfig?.directory ?? './build') as string;

export default defineBuildConfig({
  declaration: true,
  outDir,
  clean: true,
  sourcemap: true,
  entries: paths.map((p) => `./src${p}/index`),
  rollup: {
    emitCJS: true,
  },
  hooks: { 'build:done': preparePackage },
});

// -------------------------

function preparePackage() {
  const fieldsToCopy = [
    'name',
    'version',
    'description',
    'homepage',
    'author',
    'license',
    'sideEffects',
    'dependencies',
  ];
  const newPkg: PackageJson = {};
  for (const f of fieldsToCopy) {
    if (f in pkgInfo) {
      newPkg[f] = pkgInfo[f];
    }
  }

  newPkg.exports = {};
  for (const p of paths) {
    addExportsEntry(newPkg.exports, p);
    if (p === '') {
      continue;
    }

    // Create per-dir package.json for IDEs
    writeFileSync(
      `${outDir}${p}/package.json`,
      JSON.stringify(
        {
          name: `${pkgInfo.name}${p}`,
          main: `./index.cjs`,
          module: `./index.mjs`,
          sideEffects: false,
        },
        null,
        2,
      ),
    );
  }

  writeFileSync(`${outDir}/package.json`, JSON.stringify(newPkg, null, 2));
  copyFileSync('LICENSE.txt', `${outDir}/LICENSE.txt`);
  writeFileSync(
    `${outDir}/README.md`,
    `See [package home](${newPkg.homepage}) for actual README`,
  );
}

function addExportsEntry(
  exportsObj: PackageJson.ExportConditions,
  subPath: string,
) {
  exportsObj[`.${subPath}`] = {
    require: `.${subPath}/index.cjs`,
    import: `.${subPath}/index.mjs`,
  };
}
