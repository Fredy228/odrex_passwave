import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as process from 'process';
import * as cookieParser from 'cookie-parser';

import { MainModule } from './main.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule, {
    logger: ['error', 'warn', 'log'],
    cors: {
      origin: [process.env.REACT_URL],
      credentials: true,
    },
  });

  app.use(cookieParser());
  app.setGlobalPrefix('/api');
  app.useStaticAssets(join(process.cwd(), 'public'), {
    prefix: '/api/public',
  });
  // app.useStaticAssets(join(process.cwd(), 'static'), {
  //   prefix: '/api/static',
  // });
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Galaxion PassWave')
    .setDescription('Galaxion PassWave API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const PORT = process.env.PORT_SERVER || 3000;

  await app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}
bootstrap();
