import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql', // Tipo de base de datos (puede ser mysql, postgres, sqlite, etc.)
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 3307,
    username: process.env.DATABASE_USERNAME || '',
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME, // Nombre de la base de datos
    autoLoadEntities: true, // Cargar entidades automáticamente desde el directorio de entidades
    synchronize: true, // Sincronizar automáticamente el esquema de la base de datos con las entidades (SOLO PARA DESARROLLO)
  }),],
  controllers: [],
  providers: [],
})
export class AppModule {}
