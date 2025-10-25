import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiResponseInterceptor } from './utils/interceptor/api.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // set validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // set swagger
  const config = new DocumentBuilder()
    .setTitle('Chat API')
    .setDescription('API documentation for the chat platform')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // set interceptor
  app.useGlobalInterceptors(new ApiResponseInterceptor());
  
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });
}
bootstrap();
