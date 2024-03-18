import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export class SwaggerConfigurator {
  static configure(
    app: INestApplication,
    options: {
      title: string;
      description: string;
      version: string;
    },
  ) {
    const config = new DocumentBuilder()
      .setTitle(options.title)
      .setDescription(options.description)
      .setVersion(options.version)
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
}
