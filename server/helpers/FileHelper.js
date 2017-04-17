import fs from 'fs'
import path from 'path'

const maxFiles = 36;
const subFolder = 'more';

let mainDir;
let dirInfo;

class FileHelper {

    // Sync to hold requests while main directory is not created
    static checkMainDir(dirSuffix) {
        mainDir = 'files_' + dirSuffix;
        if (!fs.existsSync(mainDir)) {
            fs.mkdirSync(mainDir);
            dirInfo = {
                allFiles: [],
                dirLen: 0,
                dirPath: mainDir,
                filesDict: {}
            }
        } else {
            dirInfo = FileHelper.walkFolders(mainDir);
            FileHelper.checkToCreateSubFolder();
        }
        return dirInfo;
    }

    static walkFolders(dirPath, allFiles, filesDict) {
        const files = fs.readdirSync(dirPath);
        let res = {
            allFiles: allFiles || [],
            dirLen: files.length,
            filesDict: filesDict || {},
            dirPath
        };

        files.forEach((file) => {
            const filePath = path.join(dirPath, file);
            if (fs.statSync(filePath).isDirectory()) {
                res = FileHelper.walkFolders(filePath, res.allFiles, res.filesDict);
            }
            else {
                res.allFiles.push(file);
                res.filesDict[file] = filePath;
            }
        });
        return res;
    }

    static checkToCreateSubFolder() {
        if (dirInfo.dirLen + 1 >= maxFiles) {
            const newFolder = path.join(dirInfo.dirPath, subFolder);
            fs.mkdirSync(newFolder);
            dirInfo.dirPath = newFolder;
            dirInfo.dirLen = 0;
        }
    }

    static deleteFile(filename) {
        return new Promise((resolve, reject) => {
            fs.unlink(dirInfo.filesDict[filename], (err, res) => {
                if (err) reject(err);
                else {
                    delete dirInfo.filesDict[filename];
                    resolve(res);
                }
            });
        });
    }


// Get UTF8 file and already convert it into BASE64
    static readFile(filename) {
        return new Promise((resolve, reject) => {
            fs.readFile(dirInfo.filesDict[filename], (err, res) => {
                if (err) reject(err);
                else resolve(FileHelper.convertBinaryToBase64(res));
            });
        });
    }


    static writeFile(filename, base64file) {
        return new Promise((resolve, reject) => {
            const file = FileHelper.convertBase64ToBinary(base64file);
            const fullPath = path.join(dirInfo.dirPath, filename);
            fs.writeFile(fullPath, file, (err, res) => {
                if (err) reject(err);
                else resolve(res);
                dirInfo.dirLen++;
                dirInfo.filesDict[filename] = fullPath;
                FileHelper.checkToCreateSubFolder();
            });
        });
    }


    static convertBase64ToBinary(base64) {
        return Buffer.from(base64, 'base64');
    }

    static convertBinaryToBase64(binary) {
        return new Buffer(binary).toString('base64');
    }

}

export default FileHelper
