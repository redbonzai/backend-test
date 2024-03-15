// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { Response } from 'express';
// import { UserDocument } from '@app/common';
// import { JwtModule, JwtService } from '@nestjs/jwt';
// import { ConfigModule, ConfigService } from '@nestjs/config';
//
// describe('AuthController', () => {
//   let authController: AuthController;
//   let authService: AuthService;
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   let jwtService: JwtService;
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   let configService: ConfigService;
//
//   const mockUser: UserDocument = {
//     _id: '123',
//     email: 'test@example.com',
//     password: 'password', // In real-world scenarios, you won't send the password like this
//     roles: ['admin'],
//   };
//
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [JwtModule, ConfigModule],
//       controllers: [AuthController],
//       providers: [
//         {
//           provide: AuthService,
//           useValue: {
//             login: jest.fn().mockImplementation(() => 'test-token'), // Mock implementation
//           },
//         },
//         JwtService,
//         ConfigService,
//       ],
//     }).compile();
//
//     authController = module.get<AuthController>(AuthController);
//     authService = module.get<AuthService>(AuthService);
//     jwtService = module.get<JwtService>(JwtService);
//     configService = module.get<ConfigService>(ConfigService);
//   });
//
//   describe('login', () => {
//     it('should call AuthService.login and return a token', async () => {
//       const mockResponse = {
//         cookie: jest.fn(),
//         send: jest.fn(),
//       } as unknown as Response;
//
//       const result = await authController.login(mockUser, mockResponse);
//
//       expect(authService.login).toHaveBeenCalledWith(mockUser, mockResponse);
//       expect(mockResponse.cookie).toHaveBeenCalledWith(
//         'Authentication',
//         'test-token',
//         expect.any(Object),
//       );
//       expect(result).toEqual('test-token');
//     });
//   });
//
//   describe('authenticate', () => {
//     it('should return the user from the payload', async () => {
//       const payload = {
//         user: {
//           /* ... user details ... */
//         },
//       };
//
//       const result = await authController.authenticate(payload);
//
//       expect(result).toEqual(payload.user);
//     });
//   });
// });
