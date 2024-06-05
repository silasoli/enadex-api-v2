import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ManagersService } from '../../managers/services/managers.service';
import { StudentsService } from '../../students/services/students.service';
import { faker } from '@faker-js/faker';
import { ManagersRoleEnum } from '../../managers/schemas/manager.entity';
import { UnityEnum } from '../../students/schemas/student.entity';
import { UserLoginDto } from '../dto/user-login.dto';
import * as bcrypt from 'bcrypt';

const managerId = faker.database.mongodbObjectId();
const managerEmail = faker.internet.email();
const managerName = faker.person.fullName();
const managerRole = ManagersRoleEnum.TEACHERS;
const managerPassword = faker.internet.password();

const studentId = faker.database.mongodbObjectId();
const studentEmail = faker.internet.email();
const studentName = faker.person.fullName();
const studentRegistration = faker.internet.ip();
const studentUnity = UnityEnum.FEIRA_DE_SANTANA;
const studentSemester = '1';
const studentPassword = faker.internet.password();

const courseId = faker.database.mongodbObjectId();
const courseName = faker.company.catchPhrase();
const courseCreatedDate = faker.date.anytime();

const mockCourse = {
  _id: courseId,
  name: courseName,
  createdAt: courseCreatedDate,
};

const mockManager = {
  _id: managerId,
  name: managerName,
  email: managerEmail,
  courses_id: [mockCourse],
  password: managerPassword,
  role: managerRole,
};

const mockStudent = {
  _id: studentId,
  name: studentName,
  email: studentEmail,
  registration: studentRegistration,
  password: studentPassword,
  semester: studentSemester,
  course_id: mockCourse,
  unity: studentUnity,
};

const jwtServiceMock = {
  sign: jest.fn().mockReturnValue('jwt_token'),
};

const managersServiceMock = {
  findByEmail: jest.fn().mockImplementation((email) => {
    if (email === managerEmail) return mockManager;
    return null;
  }),
};

const studentsServiceMock = {
  findByEmail: jest.fn().mockImplementation((email) => {
    if (email === studentEmail) return mockStudent;
    return null;
  }),
};

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let managersService: ManagersService;
  let studentsService: StudentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: ManagersService,
          useValue: managersServiceMock,
        },
        {
          provide: StudentsService,
          useValue: studentsServiceMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    managersService = module.get<ManagersService>(ManagersService);
    studentsService = module.get<StudentsService>(StudentsService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(managersService).toBeDefined();
    expect(studentsService).toBeDefined();
  });

  describe('authenticateUser', () => {
    it('should authenticate a student user', async () => {
      const mockLoginDto: UserLoginDto = {
        email: studentEmail,
        password: studentPassword,
      };

      jest.spyOn(bcrypt, 'compare').mockReturnValue(true);

      const authenticatedUser =
        await authService.authenticateUser(mockLoginDto);

      expect(authenticatedUser).toBeDefined();
      expect(authenticatedUser.access_token).toBe('jwt_token');
      expect(authenticatedUser.email).toBe(studentEmail);
    });

    it('should authenticate a manager user', async () => {
      const mockLoginDto: UserLoginDto = {
        email: managerEmail,
        password: managerPassword,
      };

      jest.spyOn(bcrypt, 'compare').mockReturnValue(true);

      const authenticatedUser =
        await authService.authenticateUser(mockLoginDto);

      expect(authenticatedUser).toBeDefined();
      expect(authenticatedUser.access_token).toBe('jwt_token');
      expect(authenticatedUser.email).toBe(managerEmail);
    });

    it('should return AUTH_ERRORS.INVALID_CREDENTIALS', async () => {
      const mockLoginDto: UserLoginDto = {
        email: faker.internet.email(),
        password: managerPassword,
      };

      jest.spyOn(bcrypt, 'compare').mockReturnValue(true);

      await expect(authService.authenticateUser(mockLoginDto)).rejects.toThrow(
        'Dados invalidos.',
      );
    });

    it('should return AUTH_ERRORS.INVALID_CREDENTIALS', async () => {
      const mockLoginDto: UserLoginDto = {
        email: studentEmail,
        password: '595e867fe9af41af7f111234',
      };

      jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(false);

      await expect(authService.authenticateUser(mockLoginDto)).rejects.toThrow(
        'Dados invalidos.',
      );
    });
  });
});
