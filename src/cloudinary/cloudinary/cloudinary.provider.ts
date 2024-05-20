import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
    provide: 'CLOUDINARY',
    useFactory: (configService: ConfigService) => {
        return cloudinary.config({
            cloud_name: configService.get<string>('CN'),
            api_key: configService.get<string>('API_KEY'),
            api_secret: configService.get<string>('API_SECRET'),
        });
    },
    inject: [ConfigService], 
};
