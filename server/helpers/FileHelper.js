import fs from 'fs'
import path from 'path'
// import glob from 'glob'
// import dir from 'node-dir'

class FileHelper {

    static basePath = fs.realpathSync('.') + '/uploads';

    static walkSync(dir) {
        let fileList = []; fs.readdirSync(dir).forEach(file => {
            fileList = fs.statSync(path.join(dir, file)).isDirectory() ?
                FileHelper.walkSync(path.join(dir, file), fileList) :
                fileList.concat(path.basename(file));

        });
        return fileList;
    }

  /*  static getAllFiles(){
        return new Promise((resolve, reject) => {
            glob(`${FileHelper.basePath}`, {}, function (err, files) {
                if(err) reject();
                resolve(files)
            })
        })
    }

    static getSubDirs(directory) {
        return new Promise((resolve, reject) => {
            dir.paths(directory, (err, paths) => {
                if (err) reject(err);
                resolve(paths.dirs)
            });
        })
    }

    static saveFile(data){
        return new Promise((resolve, reject) => {
            let filename = data.name;
            let bitmap = Buffer.from(data.file, 'base64');
            if(FileHelper.createPathIfNotExists(FileHelper.basePath)){
                FileHelper
                    .getAllFiles()
                    .then((files) => FileHelper.getPathToSave(files))
                    .catch((e) => reject())
            }
            let path = `${basePath}${filename}`;
            fs.writeFile(path, bitmap, (err) => {
                if (err) {
                    callback(500);
                }
                callback(Messages.ok);
            });
        })
    }

    static getPathToSave(files){
        return new Promise((resolve, reject) => {
            let expectDirs = Math.ceil((files + 1) / 36);
            if(expectDirs === 1){
                resolve(FileHelper.basePath);
            } else if(expectDirs > 1 && expectDirs <= 36){
                let newPath = `${FileHelper.basePath}/${expectDirs}`;
                if(FileHelper.createPathIfNotExists(newPath)){
                    resolve(newPath);
                }
            } else {
                let expectSubDir = Math.ceil(expectDirs /36);
                FileHelper.basePath
            }
        })
    }

    static createPathIfNotExists(path){
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, 0o766, (err) => {
                if(err) return false;
            });
        }
        return true;
    }

    static diretoryTreeToObj(dir, ) {
        return new Promise((resolve, reject) => {
            var results = [];
            fs.readdir(dir, function(err, list) {
                if (err)
                   reject(err)

                var pending = list.length;

                if (!pending)
                    resolve({name: path.basename(dir), type: 'folder', children: results});

                list.forEach(function(file) {
                    file = path.resolve(dir, file);
                    fs.stat(file, function(err, stat) {
                        if (stat && stat.isDirectory()) {
                            diretoryTreeToObj(file, function(err, res) {
                                results.push({
                                    name: path.basename(file),
                                    type: 'folder',
                                    children: res
                                });
                                if (!--pending)
                                    done(null, results);
                            });
                        }
                        else {
                            results.push({
                                type: 'file',
                                name: path.basename(file)
                            });
                            if (!--pending)
                                done(null, results);
                        }
                    });
                });
            });
        })

};
*/
}


export default FileHelper