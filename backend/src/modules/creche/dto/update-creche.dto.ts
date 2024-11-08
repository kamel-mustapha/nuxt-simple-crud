import { PartialType } from '@nestjs/mapped-types';
import { CreateCrecheDto } from './create-creche.dto';

export class UpdateCrecheDto extends PartialType(CreateCrecheDto) {}
