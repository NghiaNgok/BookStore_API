import { Resolver, Query } from '@nestjs/graphql';
import { AboutEntity } from 'src/entities/about.entity';
import { AboutService } from 'src/shared/services/about/about.service';

@Resolver(() => AboutEntity)
export class AboutResolver {
  constructor(private readonly aboutService: AboutService) {}

  @Query(() => AboutEntity)
  async findOneAbout() {
    const result = await this.aboutService.findOne(process.env.ABOUT_US_ID);
    return result;
  }

}
