import path from 'path';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import process from 'process';

const __dirname = path.resolve();

let folder = process.argv[2];
let basefile = path.join(__dirname, '..', 'pictures', folder);

// 없는 폴더를 입력하였거나 잘못된 폴더를 입력하였다면 적절한 메시지를 보내준다.
if (!folder || !fs.existsSync(basefile)) {
  console.error('please enter folder name in pictures');
}

const makeDir = (folder) => {
  let folderDir = path.join(basefile, folder);
  // 이미 존재했을 때를 먼저 처리해준다.
  !fs.existsSync(folderDir) && fsPromises.mkdir(folderDir).catch(console.error);
};

const moveFile = (dir, file) => {
  console.info(`move ${file} to ${dir}`);
  let oldpath = path.join(basefile, file);
  let newpath = path.join(basefile, dir, file);
  fsPromises.rename(oldpath, newpath).catch(console.error);
};

fsPromises
  .readdir(basefile)
  .then((file) => {
    makeDir('videos');
    makeDir('captured');
    makeDir('duplicated');
    return file;
  })
  .then((file) => {
    file.forEach((v) => {
      if (path.extname(v) === '.mp4' || path.extname(v) === '.mov') {
        moveFile('videos', v);
      } else if (path.extname(v) === '.png' || path.extname(v) === '.aae') {
        moveFile('captured', v);
      } else if (
        !v.includes(`IMG_E`) &&
        v.includes(`IMG_`) &&
        file.includes(`IMG_E${v.slice(4)}`)
      ) {
        moveFile('duplicated', v);
      }
    });
  })
  .catch(console.error);
