const _ = require("lodash");
const fs = require("fs");
const archiver = require("archiver");
const glob = require("glob");
const path = require("path");
const exec = require("child_process").execSync;

try {
  exec("npm run prettier && git add *.js && git commit -m 'tayo!'", {
    encoding: "utf8"
  });
} catch (err) {
  console.warn("could not commit because", err, "continuing anyway");
}
const buildDir =
  process.env.BUILD_DIR || process.env.npm_package_config_buildDir || ".builds";
const sha1 = exec("git rev-parse HEAD", { encoding: "utf8" }).trim();
const date = new Date().toISOString().replace(/:/g, "-");
const dest = path.join(
  __dirname,
  buildDir,
  `submission-sources-${date}-${sha1}.zip`
);

try {
  fs.mkdirSync(path.dirname(dest));
} catch (err) {
  if (err.code !== "EEXIST") throw err;
}

const files = glob.sync("!(node_modules)", {});
const archive = archiver("zip");
_.each(files, file => archive.file(file, { name: path.basename(file) }));
archive.finalize().pipe(fs.createWriteStream(dest));

console.log(`wrote ${files.length} files to ${dest}`);
