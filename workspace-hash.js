const { hashElement } = require("folder-hash");
var crypto = require("crypto");
const fs = require("fs");
const b64 = require("base-64");


/**
 * @typedef {Object} hashOptions JSON object with additional options
 * @property {Array} excludeFolders an array of folders that should be excluded from the hashing
 * @property {Array} excludeFiles an array of files that should be excluded from the hashing
 * @property {String} outputFile output file that gets overridden with the hashes, leave null or undefined to disable (note: this file will automatically be excluded from the hashing)
 */

/**
 * Hashes your entire workspace (excluding some files and folders)
 * @param {String} [algorithm="sha1"] the algorithm of the hash (can be "md5", "sha1" or "sha256", defaults to "sha1")
 * @param {String} [digest="hex"] the digest type you want (can be "hex", "base64" or "latin1", defaults to "hex")
 * @param {hashOptions} options JSON object with additional options
 * @returns {Promise<String>} on resolve: string containing the digested hash, on reject: string containing error message
 */
module.exports = (algorithm, digest, options) => {
    var algorithmAllowed = ["md5", "sha1", "sha256"];
    var digestAllowed = ["hex", "base64", "latin1"];
    return new Promise((resolve, reject) => {
        if(!algorithmAllowed.join(",").includes(algorithm) && algorithm != null) reject(`Algorithm is wrong! You entered: "${algorithm}" - Allowed values: "${algorithmAllowed.join(", ")}"`);
        if(!digestAllowed.join(",").includes(digest) && digest != null) reject(`Digest is wrong! You entered: "${digest}" - Allowed values: "${digestAllowed.join(", ")}"`);
        if(digest == null) digest = "hex";
        if(algorithm == null) algorithm = "sha1";

        var opts = {
            folders: {exclude: [".*", "node_modules", "test_coverage"]},
            files: {include: ["*.js", "*.json"], exclude: ["*.ini", ".*", "settings.*", "*.cfg", "*.conf", "*.txt", "*.log", ".gitignore", "*.md"]}
        }

        if(options.outputFile != null) opts.files.exclude.push(options.outputFile);

        if(options.excludeFiles != null && typeof options.excludeFiles == "object") {
            options.excludeFiles.forEach(v => {
                opts.files.exclude.push(v);
            });
        }

        if(options.excludeFolders != null && typeof options.excludeFolders == "object") {
            options.excludeFolders.forEach(v => {
                opts.folders.exclude.push(v);
            });
        }

        hashElement(".", opts).then(hash => {
            var shasum = crypto.createHash(algorithm);
            var encHash = shasum.update(hash.toString());
            encHash = shasum.digest(digest);

            var fileChecksum;
            if(digest == "base64") fileChecksum = `${algorithm};\nbase64: ${encHash}\nBASE64: ${encHash.toUpperCase()}`;
            else if(digest == "latin1") fileChecksum = `${algorithm};\nlatin1: ${encHash}\nLATIN1: ${encHash.toUpperCase()}\nbase64: ${b64.encode(encHash)}`;
            else fileChecksum = `${algorithm};\nhex: ${encHash}\nHEX: ${encHash.toUpperCase()}\nbase64: ${b64.encode(encHash)}`;

            if(options.outputFile != null) fs.writeFileSync(options.outputFile, fileChecksum);
            resolve(encHash);
        }).catch(err => {
            reject(err);
        });
    });
}