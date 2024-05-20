import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { DocumentModule } from './document/document.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SharingModule } from './sharing/sharing.module';

@Module({
  imports: [CommonModule, UserModule, DocumentModule, CloudinaryModule, SharingModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
