import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateAuthorDto {
    @ApiProperty()
    @IsString({message: "name must be string"})
    @IsNotEmpty({message: "name must not be empty"})
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    createdAt: Date;
  
    @ApiProperty()
    @IsNotEmpty()
    updatedAt: Date;
}
