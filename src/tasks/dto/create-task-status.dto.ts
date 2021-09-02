import { IsNotEmpty } from 'class-validator';

export class CreateTaskStatusDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
