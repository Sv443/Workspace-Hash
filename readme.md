# Workspace-Hash v0.1.0
## Generate a checksum of your entire workspace quickly and asynchronously


<br><br><br><br><br><br><br><br>
## Minimal Example:
```js
require("workspace-hash")().then(r => {
    // success, r contains the hash
}).catch(err => {
    // error, err contains the message
});
```
In that (^) example all the settings will default to the following:
```
algorithm: sha1
digest: hex
output file: no
excluded files: "*.ini", ".*", "settings.*", "*.cfg", "*.conf", "*.txt", "*.log", ".gitignore", "*.md"
excluded folders: ".*", "node_modules", "test_coverage"
```

<br><br><br><br><br><br><br><br>
## Complete Example:
```js
const workspaceHash = require("workspace-hash");

workspaceHash("md5", "base64", { // algorithm and digest
    outputFile: ".hash", // an output file
    excludeFiles: ["package.json", "package-lock.json"], // an array of files that should be excluded from hashing
    excludeFolders: ["data/logs", "data/other"] // an array of folders that should be excluded from hashing
}).then(r => {
    console.log("\n\x1b[32m\x1b[1m" + r + "\x1b[0m\n"); // code that should be executed afterwards (r is the checksum)
}).catch(err => {
    console.log("\n\x1b[31m\x1b[1m" + err + "\x1b[0m\n"); // err is the error message in this case
});
```
In that (^) example the chosen settings will result in the following:
```
algorithm: md5
digest: base64
output file: ".hash"
excluded files: "*.ini", ".*", "settings.*", "*.cfg", "*.conf", "*.txt", "*.log", ".gitignore", "*.md", "package.json", "package-lock.json"
excluded folders: ".*", "node_modules", "test_coverage", "data/logs", "data/other"
```

<br><br><br><br><br><br><br><br>
## [Issues](https://github.com/Sv443/workspace-hash/issues)