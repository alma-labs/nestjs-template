import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AccountRegistrationDto } from '../src/auth/dto';
import { UserUpdateDto } from '../src/user/dto';
import { getFirebaseToken } from './utils/getFirebaseToken';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userToken: string;

  const [stoneId1, stoneId2] = ['14CHARACTERSTING', '14CHARACTERSTING2'];

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(1111);

    prisma = app.get<PrismaService>(PrismaService);
    await prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:1111');

    userToken = await getFirebaseToken('garr.c.lee+test@gmail.com', '123456');
    pactum.request.setDefaultHeaders({
      Authorization: `Bearer ${userToken}`,
    });
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    describe('Sign Up', () => {
      const accountDto: AccountRegistrationDto = {
        username: 'testuser',
        name: 'Test User',
      };
      it('should create a user', () => {
        return pactum.spec().post('/auth/register').withBody(accountDto).expectStatus(201);
      });
      it('should fail on repeat user', () => {
        return pactum.spec().post('/auth/register').withBody(accountDto).expectStatus(403);
      });
    });
  });

  describe('Users', () => {
    it('Update user info', () => {
      const dto: UserUpdateDto = {
        name: 'Test User',
        username: 'testuser',
      };

      return pactum.spec().put('/users/update').withBody(dto).expectStatus(200);
    });
    it('Get user private info', () => {
      return pactum.spec().get('/users/private').expectStatus(200);
    });

    it('Get user public', () => {
      return pactum.spec().get('/users/public/testuser').expectStatus(200);
    });

    it('Fail finding a user public', () => {
      return pactum.spec().get('/users/public/notauser').expectStatus(404);
    });
  });
});
