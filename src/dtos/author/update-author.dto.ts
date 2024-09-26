import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAuthorDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    updatedAt: Date;
}
