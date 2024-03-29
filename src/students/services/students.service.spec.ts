import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { getModelToken } from '@nestjs/mongoose';
import { Student, StudentDocument, UnityEnum } from '../schemas/student.entity';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';
import { ManagersService } from '../../managers/services/managers.service';

const userId = faker.database.mongodbObjectId();
const studentId = faker.database.mongodbObjectId();
const studentEmail = faker.internet.email();
const studentName = faker.person.fullName();
const studentRegistration = faker.internet.ip();
const studentUnity = UnityEnum.FEIRA_DE_SANTANA;
const studentSemester = '1';

const mockStudent = {
  _id: studentId,
  name: studentName,
  email: studentEmail,
  registration: studentRegistration,
  semester: studentSemester,
  unity: studentUnity,
};

const studentModelMock: Partial<Model<StudentDocument>> = {
  findOne: jest.fn().mockImplementation((query) => {
    if (query._id === studentId) return mockStudent;
    return null;
  }),
  find: jest.fn().mockImplementation((query) => {
    return Promise.resolve([mockStudent]); // Adjust if needed
  }),
  create: jest.fn().mockImplementation((doc) => {
    return Promise.resolve(doc);
  }),
  updateOne: jest.fn().mockImplementation((query, update) => {
    if (query._id === studentId) {
      Object.assign(mockStudent, update);
      return { nModified: 1 };
    }
    return { nModified: 0 };
  }),
  deleteOne: jest.fn().mockImplementation((query) => {
    if (query._id === studentId) {
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }),
};

describe('StudentsService', () => {
  let service: StudentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: getModelToken(Student.name),
          useValue: studentModelMock,
        },
        {
          provide: ManagersService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
  });

  // it('should create a new student', async () => {
  //   const mockStudentDto = {
  //     ...mockStudent,
  //     password: faker.internet.password(),
  //   };
  
  //   const createdStudent = await service.create(mockStudentDto);
  
  //   expect(createdStudent).toHaveProperty('_id');
  //   expect(createdStudent.name).toBe(mockStudentDto.name);
  //   expect(createdStudent.email).toBe(mockStudentDto.email);
  //   expect(createdStudent.registration).toBe(mockStudentDto.registration);
  //   expect(createdStudent.semester).toBe(mockStudentDto.semester);
  //   expect(createdStudent.unity).toBe(mockStudentDto.unity);
  
  //   // Verify model.create was called with expected data
  //   expect(studentModelMock.create).toBeCalledWith(mockStudentDto);
  // });

  
  // ... Add test cases for each method, as provided earlier ...
});
