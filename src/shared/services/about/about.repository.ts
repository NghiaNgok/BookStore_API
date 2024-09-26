import { Injectable } from '@nestjs/common';
import { Prisma, About } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AboutRepository {
  constructor(private prisma: PrismaService) {}

  async findOne(id: Prisma.AboutWhereUniqueInput): Promise<About | null> {
    const result = await this.prisma.about.findUnique({ where: id });
    return result;
  }

  async update(params: {
    id: Prisma.AboutWhereUniqueInput;
    data: Prisma.AboutUpdateInput;
  }): Promise<About | null> {
    const { id, data } = params;
    return await this.prisma.about.update({ where: id, data: data });
  }
}
