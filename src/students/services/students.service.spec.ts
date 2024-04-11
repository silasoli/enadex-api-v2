import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { getModelToken } from '@nestjs/mongoose';
import { Student, StudentDocument, UnityEnum } from '../schemas/student.entity';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';
import { ManagersService } from '../../managers/services/managers.service';
import { CreateStudentDto } from '../dto/student-register.dto';
import { Manager } from 'src/managers/schemas/manager.entity';
import { UpdateStudentDto } from '../dto/update-student.dto';

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
  findById: jest.fn().mockImplementation((_id) => {
    if (_id === studentId) return mockStudent;
    return null;
  }),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

const managersServiceMock = {
  findByEmail: jest.fn().mockImplementation((email) => {
    if (email === studentEmail) return mockStudent;
    return null;
  }),
};

describe('StudentsService', () => {
  let studentsService: StudentsService;
  let studentModel: Model<StudentDocument>;
  let manegerService: ManagersService;

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
          useValue: managersServiceMock,
        },
      ],
    }).compile();

    studentsService = module.get<StudentsService>(StudentsService);
    studentModel = module.get<Model<StudentDocument>>(
      getModelToken(Student.name),
    );
    manegerService = module.get<ManagersService>(ManagersService);
  });

  it('should be defined', () => {
    expect(studentsService).toBeDefined();
    expect(studentModel).toBeDefined();
    expect(manegerService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all students', async () => {
      const allStudents = await studentsService.findAll();

      expect(studentModel.find).toHaveBeenCalled();
      expect(allStudents).toEqual([mockStudent]);
    });

    it('should throw an exception', () => {
      jest.spyOn(studentModel, 'find').mockRejectedValueOnce(new Error());

      expect(studentsService.findAll()).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('should return a specific student', async () => {
      const foundStudent = await studentsService.findOne(mockStudent._id);

      expect(studentModel.findById).toHaveBeenCalled();
      expect(foundStudent).toEqual(mockStudent);
    });

    it('should return STUDENTS_ERRORS.NOT_FOUND', async () => {
      await expect(
        studentsService.findOne('595e867fe9af41af7f111234'),
      ).rejects.toThrow('Usuário não encontrado.');
    });
  });

  describe('findByEmail', () => {
    it('should return a specific student by email', async () => {
      jest.spyOn(studentModel, 'findOne').mockResolvedValue(mockStudent);
      const studentsByEmail = await studentsService.findByEmail(
        mockStudent.email,
        true,
      );

      expect(studentModel.findOne).toHaveBeenCalled();
      expect(studentsByEmail).toEqual(mockStudent);
    });

    it('should return a specific student by email and active true', async () => {
      jest.spyOn(studentModel, 'findOne').mockResolvedValue(mockStudent);
      const studentsByEmail = await studentsService.findByEmail(
        mockStudent.email,
        true,
      );

      expect(studentModel.findOne).toHaveBeenCalled();
      expect(studentModel.findOne).toHaveBeenCalledWith(
        { active: true, email: mockStudent.email.toLowerCase() },
        ['+password'],
      );
      expect(studentsByEmail).toEqual(mockStudent);
    });

    it('should return a specific student by email and active false', async () => {
      jest.spyOn(studentModel, 'findOne').mockResolvedValue(mockStudent);
      const studentsByEmail = await studentsService.findByEmail(
        mockStudent.email,
        false,
      );

      expect(studentModel.findOne).toHaveBeenCalled();
      expect(studentModel.findOne).toHaveBeenCalledWith(
        { email: mockStudent.email.toLowerCase() },
        ['+password'],
      );
      expect(studentsByEmail).toEqual(mockStudent);
    });

    it('should return null if student not found', async () => {
      const email = 'nonexistent@email.com';
      jest.spyOn(studentModel, 'findOne').mockResolvedValue(null);
      const studentByEmail = await studentsService.findByEmail(email, true);

      expect(studentModel.findOne).toHaveBeenCalled();
      expect(studentByEmail).toBeNull();
    });
  });

  describe('deleteById', () => {
    it('should delete a student successfully', async () => {
      const deleteStudent = await studentsService.remove(mockStudent._id);

      expect(deleteStudent).toBeUndefined();
      expect(studentModel.updateOne).toHaveBeenCalled();
      expect(studentModel.findById).toHaveBeenCalled();
    });

    it('should return STUDENTS_ERRORS.NOT_FOUND', async () => {
      await expect(
        studentsService.remove('595e867fe9af41af7f111234'),
      ).rejects.toThrow('Usuário não encontrado.');
    });

    it('should throw an exception', () => {
      jest.spyOn(studentModel, 'updateOne').mockRejectedValue(new Error());

      expect(
        studentsService.remove('595e867fe9af41af7f111234'),
      ).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a new student', async () => {
      const mockStudentDto: CreateStudentDto = {
        ...mockStudent,
        password: faker.internet.password(),
      };

      jest.spyOn(manegerService, 'findByEmail').mockResolvedValue(null);

      const createdStudent = await studentsService.create(mockStudentDto);

      expect(studentModel.create).toHaveBeenCalledWith(mockStudentDto);
      expect(createdStudent).toBeDefined();
    });

    it('should return STUDENTS_ERRORS.DUPLICATE_EMAIL', async () => {
      const mockStudentDto: CreateStudentDto = {
        ...mockStudent,
        password: faker.internet.password(),
      };

      jest
        .spyOn(manegerService, 'findByEmail')
        .mockResolvedValue(mockStudent as unknown as Manager);

      await expect(studentsService.create(mockStudentDto)).rejects.toThrow(
        'Este endereço de e-mail já está em uso.',
      );
    });
  });

  describe('update', () => {
    it('should update a student', async () => {
      const mockStudentDto: UpdateStudentDto = {
        password: faker.internet.password(),
      };

      jest.spyOn(studentModel, 'findById').mockResolvedValue(mockStudent);
      jest
        .spyOn(studentModel, 'updateOne')
        .mockResolvedValue({ nModified: 1 } as any);

      const updateStudent = await studentsService.update(
        studentId,
        mockStudentDto,
      );

      expect(studentModel.updateOne).toHaveBeenCalled();
      expect(studentModel.findById).toHaveBeenCalled();
      expect(updateStudent).toBeDefined();
    });

    it('should update a student email', async () => {
      const mockStudentDto: UpdateStudentDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      jest.spyOn(studentModel, 'findById').mockResolvedValue(mockStudent);
      jest.spyOn(manegerService, 'findByEmail').mockResolvedValue(null);

      const updateStudent = await studentsService.update(
        studentId,
        mockStudentDto,
      );

      expect(studentModel.updateOne).toHaveBeenCalled();
      expect(studentModel.findById).toHaveBeenCalled();
      expect(updateStudent).toBeDefined();
    });

    it('should return STUDENTS_ERRORS.NOT_FOUND', async () => {
      const mockStudentDto: UpdateStudentDto = {
        password: faker.internet.password(),
      };

      jest.spyOn(studentModel, 'findById').mockReturnValueOnce(null);

      await expect(
        studentsService.update('595e867fe9af41af7f111234', mockStudentDto),
      ).rejects.toThrow('Usuário não encontrado.');
    });

    it('should return STUDENTS_ERRORS.DUPLICATE_EMAIL', async () => {
      const mockStudentDto: UpdateStudentDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      jest.spyOn(studentModel, 'findById').mockResolvedValue(mockStudent);
      jest
        .spyOn(manegerService, 'findByEmail')
        .mockResolvedValue(mockStudent as unknown as Manager);

      await expect(
        studentsService.update(mockStudent._id, mockStudentDto),
      ).rejects.toThrow('Este endereço de e-mail já está em uso.');
    });
  });
});
