import { IsNotEmpty } from 'class-validator';

export class CreateKidDto {
  id: number;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  crecheId?: number;

  userId: number;
}
