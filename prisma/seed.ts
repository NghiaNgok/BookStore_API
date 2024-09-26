import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const hashPassword = async (password: string) => {
  const saltOrRounds = 10;
  return await bcrypt.hash(password, saltOrRounds);
};

async function main() {
  const hashPass = await hashPassword("meow123");
  const admin = await prisma.admin.create({
    data: {
      email: 'admin1@gmail.com',
      fullName: 'admin',
      address: '123 Main Street',
      username: 'admin1',
      password: hashPass,
      avatar:
        'https://res.cloudinary.com/dyo7rdbmx/image/upload/v1718015950/death_cat_ne4pjy.jpg',
      isActive: true,
      phoneNumber: '0773114946',
      refreshToken: null,
    },
  });

  const about = await prisma.about.create({
    data: {
      id: process.env.ABOUT_US_ID,
      content: `<p><span style="font-size: 18pt;"><strong>Welcome to Bookworm</strong></span></p>
<p><span style="font-size: 14pt;">"Bookworm is an independent New York bookstore and language school with&nbsp;locations in Manhattan and Brooklyn. We specialize in travel books and language&nbsp;classes."</span></p>
<p><span style="font-size: 18pt;"><strong>Our Story</strong></span></p>
<p><span style="font-size: 14pt;">The name Bookworm was taken from the </span><span style="font-size: 14pt;">original name for New York International Airport, </span><span style="font-size: 14pt;">which was renamed JFK in December 1963.</span></p>
<p><span style="font-size: 14pt;">Our Manhattan store has just moved to the </span><span style="font-size: 14pt;">West Village. Our new location is 170 7th </span><span style="font-size: 14pt;">Avenue South, at the corner of Perry Street. </span><span style="font-size: 14pt;">From March 2008 through May 2016, the store </span><span style="font-size: 14pt;">was located in the Flatiron District.</span></p>
<p><span style="font-size: 18pt;"><strong>Our Vision</strong></span></p>
<p><span style="font-size: 14pt;">One of the last travel bookstores in the country, </span><span style="font-size: 14pt;">our Manhattan store carries a range of </span><span style="font-size: 14pt;">guidebooks (all 10% off) to suit the needs and </span><span style="font-size: 14pt;">tastes of every traveler and budget.</span></p>
<p><span style="font-size: 14pt;">We believe that a novel or travelogue can be </span><span style="font-size: 14pt;">just as valuable a key to a place as any </span><span style="font-size: 14pt;">guidebook, and our well-read, well-traveled staff </span><span style="font-size: 14pt;">is happy to make reading recommendations for </span><span style="font-size: 14pt;">any traveler, book lover, or gift giver.</span></p>`,
    },
  });

  console.log({ admin, about });
  console.log('=============init database success============')
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
