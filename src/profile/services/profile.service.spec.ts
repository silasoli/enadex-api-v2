import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { ProfileStrategyImpl } from '../strategies/profile-strategy-impl';
import { faker } from '@faker-js/faker';
import { ManagersRoleEnum } from '../../managers/schemas/manager.entity';
import { UnityEnum } from '../../students/schemas/student.entity';

const managerId = faker.database.mongodbObjectId();
const managerEmail = faker.internet.email();
const managerName = faker.person.fullName();
const managerRole = ManagersRoleEnum.TEACHERS;

const studentId = faker.database.mongodbObjectId();
const studentEmail = faker.internet.email();
const studentName = faker.person.fullName();
const studentRegistration = faker.internet.ip();
const studentUnity = UnityEnum.FEIRA_DE_SANTANA;
const studentSemester = '1';

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
  role: managerRole,
};

const mockStudent = {
  _id: studentId,
  name: studentName,
  email: studentEmail,
  registration: studentRegistration,
  semester: studentSemester,
  course_id: mockCourse,
  unity: studentUnity,
};

const mockUpdateProfile = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  semester: '2',
  course_id: mockCourse._id,
  unity: UnityEnum.ITABUNA,
};

const profileStrategyMock = {
  findOneProfile: jest.fn().mockImplementation((query) => {
    if (query === managerId) return mockManager;
    else if (query === studentId) return mockStudent;
    return undefined;
  }),
  updateOneProfile: jest.fn().mockImplementation((query, update) => {
    if (query === managerId) {
      return Object.assign(mockManager, update);
    } else if (query === studentId) {
      return Object.assign(mockStudent, update);
    }
    return undefined;
  }),
  disableOneProfile: jest.fn().mockImplementation((query) => {
    if (query === studentId) {
      return { ...mockStudent, active: false };
    } else if (query === managerId) {
      return { ...mockManager, active: false };
    }
    return undefined;
  }),
};

describe('ProfileService', () => {
  let service: ProfileService;
  let profileStrategy: ProfileStrategyImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: ProfileStrategyImpl,
          useValue: profileStrategyMock,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    profileStrategy = module.get<ProfileStrategyImpl>(ProfileStrategyImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(profileStrategy).toBeDefined();
  });

  describe('findOneProfile', () => {
    it('should return a student profile', async () => {
      const studentProfile = await service.findOneProfile(studentId);

      expect(studentProfile).toEqual(mockStudent);
      expect(profileStrategy.findOneProfile).toHaveBeenCalled();
    });

    it('should return a manager profile', async () => {
      const managerProfile = await service.findOneProfile(managerId);

      expect(managerProfile).toEqual(mockManager);
      expect(profileStrategy.findOneProfile).toHaveBeenCalled();
    });
  });

  describe('updateOneProfile', () => {
    it('should update a student profile', async () => {
      const updatedStudentProfile = await service.updateOneProfile(
        studentId,
        mockUpdateProfile,
      );

      expect(profileStrategy.updateOneProfile).toHaveBeenCalled();
      expect(updatedStudentProfile).toBeDefined();
      expect(updatedStudentProfile.name).toEqual(mockUpdateProfile.name);
    });

    it('should update a manager profile', async () => {
      const updatedManagerProfile = await service.updateOneProfile(
        managerId,
        mockUpdateProfile,
      );

      expect(profileStrategy.updateOneProfile).toHaveBeenCalled();
      expect(updatedManagerProfile).toBeDefined();
      expect(updatedManagerProfile.name).toEqual(mockUpdateProfile.name);
    });
  });

  describe('disableOneProfile', () => {
    it('should disable a student profile', async () => {
      const disabledStudentProfile = await service.disableOneProfile(studentId);

      expect(profileStrategy.disableOneProfile).toHaveBeenCalled();
      expect(disabledStudentProfile).toBeDefined();
    });

    it('should disable a manager profile', async () => {
      const disabledManagerProfile = await service.disableOneProfile(managerId);

      expect(profileStrategy.disableOneProfile).toHaveBeenCalled();
      expect(disabledManagerProfile).toBeDefined();
    });
  });
});
