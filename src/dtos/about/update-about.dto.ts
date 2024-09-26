import { IsNotEmpty } from 'class-validator';

export class UpdateAboutDto {
  @IsNotEmpty({ message: 'content must not be empty' })
  content: string;
}
