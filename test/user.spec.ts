import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('UserController', () => {
  let app: INestApplication;
  let logger: Logger
  let testService: TestService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER)
    testService = app.get(TestService)
  });

  describe("POST /api/users/register", () => {
    beforeEach(async () => {
      await testService.deleteUser()
    })

    it("Should be rejected if request is invalid", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/users/register")
        .send({
          username: "",
          password: "",
          email: "",
        });

      logger.info(response.body)

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });


    it("Should be able to register", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/users/register")
        .send({
          username: "test",
          password: "test12345",
          email: "test@mail.com",
        });

      logger.info(response.body)

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.password).toBe('test12345');
      expect(response.body.data.email).toBe('test@mail.com');
    });
  })
});
