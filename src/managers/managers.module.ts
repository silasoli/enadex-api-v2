import { Global, Module } from '@nestjs/common';
import { ManagersService } from './services/managers.service';
import { ManagersController } from './controllers/managers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Manager, ManagerSchema } from './schemas/manager.entity';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Manager.name, schema: ManagerSchema }]),
  ],
  controllers: [ManagersController],
  providers: [ManagersService],
  exports: [ManagersService],
})
export class ManagersModule {}
