import {
  ArgumentMetadata,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CustomException } from '../services/custom-exception';

type TFileImg = {
  [key: string]: Array<Express.Multer.File>;
};
@Injectable()
export class FileValidatorPipe implements PipeTransform {
  constructor(private options: { maxSize: number; nullable: boolean }) {}

  transform(files: TFileImg, { type }: ArgumentMetadata) {
    console.log(`arguments-${type}`, files);
    if (['query', 'body', 'param'].includes(type)) {
      return files;
    }

    if (!files) {
      if (this.options.nullable) {
        return files;
      } else {
        throw new CustomException(
          HttpStatus.BAD_REQUEST,
          `You have not uploaded any files`,
        );
      }
    }

    for (const key in files) {
      if (Object.prototype.hasOwnProperty.call(files, key)) {
        files[key].forEach((item: Express.Multer.File) => {
          if (item.size / (1024 * 1024) > this.options.maxSize)
            throw new CustomException(
              HttpStatus.BAD_REQUEST,
              `The file is too large. Maximum size ${this.options.maxSize} MB`,
            );
        });
      }
    }

    return files;
  }
}
