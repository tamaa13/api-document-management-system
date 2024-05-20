import { z, ZodType } from "zod";
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class DocumentValidation implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const oneMb = 10000;
        if (!Array.isArray(value.file) || value.file.length !== 1) {
            throw new BadRequestException('Exactly one file must be uploaded');
        }
        if (value.file[0].size > oneMb) {
            throw new BadRequestException('File size should be less than 1KB');
        }
        return value;
    }

    static readonly uploadDocument: ZodType = z.object({
        title: z.string().min(1).max(10),
        file: z.array(z.instanceof(Buffer)).length(1)
    })
}
