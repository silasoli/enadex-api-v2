import { StudentsRegisterService } from './students-register.service';
import { StudentsService } from './students.service';
import { Student, StudentDocument, UnityEnum } from '../schemas/student.entity';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { STUDENTS_ERRORS } from '../constants/students-errors';
import { CreateStudentDto } from '../dto/create-student.dto';
import * as bcrypt from 'bcrypt';

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

const mockStudent = {
  _id: studentId,
  name: studentName,
  email: studentEmail,
  registration: studentRegistration,
  semester: studentSemester,
  unity: studentUnity,
};

const studentModelMock: Partial<Model<StudentDocument>> = {
  find: jest.fn().mockImplementation((query) => {
    if (query && query.approved === false)
      return {
        populate: jest
          .fn()
          .mockResolvedValue([{ ...mockStudent, course_id: mockCourse }]),
      };

    return Promise.resolve([]);
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

const studentsServiceMock = {
  validatingManagersEmail: jest.fn().mockImplementation((email) => {
    if (email === studentEmail) return null;
    else throw STUDENTS_ERRORS.DUPLICATE_EMAIL;
  }),
  findStudentByID: jest.fn().mockImplementation((id) => {
    if (id === studentId) return mockStudent;
    else throw STUDENTS_ERRORS.NOT_FOUND;
  }),
  transformBody: jest.fn().mockImplementation(async (dto: CreateStudentDto) => {
    if (dto.password) dto.password = await bcrypt.hash(dto.password, 12);
  }),
};

describe('StudentsRegisterService', () => {
  let studentsRegisterService: StudentsRegisterService;
  let studentsService: StudentsService;
  let studentModel: Model<StudentDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsRegisterService,
        {
          provide: getModelToken(Student.name),
          useValue: studentModelMock,
        },
        {
          provide: StudentsService,
          useValue: studentsServiceMock,
        },
      ],
    }).compile();

    studentsRegisterService = module.get<StudentsRegisterService>(
      StudentsRegisterService,
    );
    studentModel = module.get<Model<StudentDocument>>(
      getModelToken(Student.name),
    );
    studentsService = module.get<StudentsService>(StudentsService);
  });

  it('should be defined', () => {
    expect(studentsRegisterService).toBeDefined();
    expect(studentModel).toBeDefined();
    expect(studentsService).toBeDefined();
  });

  describe('createStudentRegister', () => {
    it('should create a new student register', async () => {
      const mockStudentDto: CreateStudentDto = {
        ...mockStudent,
        course_id: mockCourse._id,
        password: faker.internet.password(),
      };

      const createdStudentRegister =
        await studentsRegisterService.createStudentRegister(mockStudentDto);

      expect(studentModel.create).toHaveBeenCalledWith({
        ...mockStudentDto,
        active: false,
        approved: false,
      });
      expect(createdStudentRegister).toBeDefined();
    });

    it('should return STUDENTS_ERRORS.DUPLICATE_EMAIL', async () => {
      const mockStudentDto: CreateStudentDto = {
        ...mockStudent,
        email: faker.internet.email(),
        course_id: mockCourse._id,
        password: faker.internet.password(),
      };

      await expect(
        studentsRegisterService.createStudentRegister(mockStudentDto),
      ).rejects.toThrow('Este endereço de e-mail já está em uso.');
    });
  });

  describe('findAllStudentRegister', () => {
    it('should return all students registers with approved false', async () => {
      const allStudentsRegisters =
        await studentsRegisterService.findAllStudentRegister();

      expect(studentModel.find).toHaveBeenCalled();
      expect(studentModel.find).toHaveBeenCalledWith({ approved: false });
      // POPULATE HAS NOT BEEN TESTED THE CORRECT WAY
      // expect(studentModel.find().populate).toHaveBeenCalled();
      expect(allStudentsRegisters).toEqual([
        { ...mockStudent, course_id: mockCourse },
      ]);
    });
  });

  describe('approveRequest', () => {
    it('should aprove a student register', async () => {
      await studentsRegisterService.approveRequest(mockStudent._id);

      expect(studentsService.findStudentByID).toHaveBeenCalled();
      expect(studentModel.updateOne).toHaveBeenCalled();
    });

    it('should return STUDENTS_ERRORS.NOT_FOUND_REQUEST', async () => {
      const mockStudentApproved = {
        ...mockStudent,
        approved: true,
      };

      jest
        .spyOn(studentsService, 'findStudentByID')
        .mockResolvedValueOnce(mockStudentApproved as Student);

      await expect(
        studentsRegisterService.approveRequest(mockStudent._id),
      ).rejects.toThrow('Solicitação não encontrado.');
    });

    it('should return STUDENTS_ERRORS.NOT_FOUND', async () => {
      await expect(
        studentsRegisterService.approveRequest('595e867fe9af41af7f111234'),
      ).rejects.toThrow('Usuário não encontrado.');
    });
  });

  describe('deleteRequest', () => {
    it('should delete a student register', async () => {
      const mockStudentApproved = {
        ...mockStudent,
        approved: false,
      };

      jest
        .spyOn(studentsService, 'findStudentByID')
        .mockResolvedValueOnce(mockStudentApproved as Student);
      jest
        .spyOn(studentModel, 'deleteOne')
        .mockResolvedValue({ deletedCount: 1 } as any);

      await studentsRegisterService.deleteRequest(mockStudent._id);

      expect(studentsService.findStudentByID).toHaveBeenCalled();
      expect(studentModel.deleteOne).toHaveBeenCalled();
      expect(studentModel.deleteOne).toHaveBeenCalledWith({
        _id: mockStudent._id,
      });
    });
    it('should return STUDENTS_ERRORS.NOT_FOUND_REQUEST', async () => {
      const mockStudentApproved = {
        ...mockStudent,
        approved: true,
      };
      jest
        .spyOn(studentsService, 'findStudentByID')
        .mockResolvedValueOnce(mockStudentApproved as Student);
      await expect(
        studentsRegisterService.deleteRequest(mockStudent._id),
      ).rejects.toThrow('Solicitação não encontrado.');
    });
    it('should return STUDENTS_ERRORS.NOT_FOUND', async () => {
      await expect(
        studentsRegisterService.deleteRequest('595e867fe9af41af7f111234'),
      ).rejects.toThrow('Usuário não encontrado.');
    });
  });
});
