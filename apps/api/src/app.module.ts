import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { LearningPathModule } from './learning-path/learning-path.module';
import { ModulesModule } from './modules/modules.module';
import { ChatModule } from './chat/chat.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3001),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRY: Joi.string().default('7d'),
      }),
    }),
    HealthModule,
    AuthModule,
    UsersModule,
    OnboardingModule,
    LearningPathModule,
    ModulesModule,
    ChatModule,
    AdminModule,
  ],
})
export class AppModule {}
