import { Module } from '@nestjs/common';
import { ManagersService } from './services/managers.service';
import { ManagersController } from './controllers/managers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Manager, ManagerSchema } from './schemas/manager.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Manager.name, schema: ManagerSchema }]),
  ],
  controllers: [ManagersController],
  providers: [ManagersService],
})
export class ManagersModule {}
