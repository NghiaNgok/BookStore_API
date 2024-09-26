import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { UpdateUserPasswordDto } from 'src/dtos/user/update-password-user.dto';
import { UpdateUserDto } from 'src/dtos/user/update-user.dto';
import { UserEntity } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { UserService } from 'src/shared/services/user/user.service';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UserEntity)
  async updateInfo(@Args() data: UpdateUserDto): Promise<UserEntity> {
    const result = this.userService.udateInfo(data, data.id);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => UserEntity)
  async getUser(@Args('id') id: string) {
    try {
      const result = await this.userService.getOneUser({ id: id });
      const response = plainToInstance(UserEntity, result);
      return response;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch user');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UserEntity)
  async updatePassword(
    @Args() data: UpdateUserPasswordDto,
  ): Promise<UserEntity> {
    const result = this.userService.updatePassword(data);
    return result;
  }
}
