import { IsNotEmpty } from 'class-validator';

export class CreateCrecheDto {
  id: number;

  @IsNotEmpty()
  name: string;

  userId: number;
}
