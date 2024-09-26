import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { UserRepository } from './user.repository';
import { Prisma } from '@prisma/client';
import { UserEntity } from 'src/entities/user.entity';
import { FilterUserDto } from 'src/dtos/user/filter-user.dto';
import { contains } from 'class-validator';
import { comparePassword, hashPassword } from 'src/shared/utils/hashPassword.util';
import { UpdateUserPasswordDto } from 'src/dtos/user/update-password-user.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getOneUser(id: Prisma.UserWhereUniqueInput): Promise<UserEntity> {
    const user = await this.userRepository.findOne(id);
    return plainToInstance(UserEntity, user);
  }

  async udateInfo(data: Prisma.UserUpdateInput, id: string) {
    const result = await this.userRepository.update({
      id: { id },
      data: data,
    });
    return result;
  }

  async updatePassword(data: UpdateUserPasswordDto) {
    const currentUser = await this.userRepository.findOne({ id: data.id });
    if (!currentUser) {
      throw new BadRequestException('Cannot find user');
    }
    const checkPassword = await comparePassword(
      data.currentPassword,
      currentUser.password,
    );
    if (!checkPassword) {
      throw new BadRequestException('Wrong password');
    }
    const hashedNewPassword = await hashPassword(data.newPassword)
    const result = await this.userRepository.update({
      id: { id: data.id },
      data: {
        password: hashedNewPassword,
      },
    });
    return result;
  }

  async findAll(filter: FilterUserDto) {
    let itemPerPage: number = filter.limit ? filter.limit : 5;
    let offset: number = filter.page > 0 ? (filter.page - 1) * filter.limit : 0;
    let currentPage: number = filter.page ? filter.page : 1;

    const whereCondition = {
      AND: [],
    };

    if (filter.fullName) {
      whereCondition.AND.push({
        fullName: { contains: filter.fullName },
      });
    }

    if (filter.email) {
      whereCondition.AND.push({
        email: { contains: filter.email },
      });
    }

    if (filter.username) {
      whereCondition.AND.push({
        username: { contains: filter.username },
      });
    }

    const list = await this.userRepository.findMany({
      skip: offset,
      take: itemPerPage,
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await this.userRepository.countUser({
      where: whereCondition,
    });
    const result = plainToInstance(UserEntity, list);
    return {
      list: result,
      totalProducts: total,
      totalPages:
        total % itemPerPage !== 0
          ? Math.floor(total / itemPerPage) + 1
          : total / itemPerPage,
      currentPage: currentPage,
      limit: itemPerPage,
    };
  }

  async disable(id: string) {
    const result = await this.userRepository.update({
      id: { id },
      data: {
        isActive: false,
      },
    });
    return result;
  }

  async active(id: string) {
    const result = await this.userRepository.update({
      id: { id },
      data: {
        isActive: true,
      },
    });
    return result;
  }

  async loadForDashboard() {
    const result = await this.userRepository.countUser({
      where: { isActive: true },
    });
    return result;
  }
}
