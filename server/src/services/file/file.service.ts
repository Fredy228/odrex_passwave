import { HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as process from 'process';
import { v4 as uuidv4 } from 'uuid';
import {
  ensureDir,
  pathExistsSync,
  removeSync,
  unlink,
  writeFile,
} from 'fs-extra';
import { FileType } from '../../types/file.type';
import { join } from 'path';
import { CustomException } from '../custom-exception';

@Injectable()
export class FileService {
  async saveSvgToFile(
    svgData: string,
    ...filePath: string[]
  ): Promise<string | null> {
    try {
      const fileName = `${uuidv4()}.svg`;
      const fullFilePath = path.join(process.cwd(), ...filePath);

      await ensureDir(fullFilePath);
      await writeFile(`${fullFilePath}/${fileName}`, svgData);

      return path.join('api', ...filePath, fileName);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async saveFile(
    file: Express.Multer.File,
    ...filePath: string[]
  ): Promise<FileType | null> {
    try {
      file.originalname = Buffer.from(file.originalname, 'latin1').toString(
        'utf8',
      );
      const fileName = file.originalname;
      const fileKey = uuidv4();
      const splitFileName = fileName.split('.');
      splitFileName.pop();
      const fileUniqueName = `${splitFileName.join('.')}-${fileKey}${path.extname(file.originalname)}`;
      const fullFilePath = path.join(process.cwd(), ...filePath);

      await ensureDir(fullFilePath);
      await writeFile(path.join(fullFilePath, fileUniqueName), file.buffer);

      return {
        file_name: fileName,
        file_path: path.join('api', ...filePath, fileUniqueName),
        file_key: fileKey,
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async saveFileMany(
    files: Array<Express.Multer.File>,
    ...filePath: string[]
  ): Promise<Array<FileType | null>> {
    return Promise.all(files.map((item) => this.saveFile(item, ...filePath)));
  }

  async deleteFiles(filePaths: string[]): Promise<void> {
    try {
      filePaths.forEach((filePath: string) => {
        const fullPath = join(process.cwd(), filePath.replace('api/', ''));

        const isExistFile = pathExistsSync(fullPath);
        if (isExistFile) {
          unlink(fullPath);
        }
      });
    } catch (err) {
      console.error(err);
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        'Error when deleting a file',
      );
    }
  }

  async deleteFolders(folderPaths: string[]): Promise<void> {
    try {
      await Promise.all(
        folderPaths.map((folderPath: string) =>
          removeSync(join(process.cwd(), folderPath)),
        ),
      );
    } catch (e) {
      console.error(e);
      // throw new CustomException(
      //   HttpStatus.BAD_REQUEST,
      //   'Error when deleting files',
      // );
    }
  }
}
