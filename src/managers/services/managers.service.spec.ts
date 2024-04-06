import { Test, TestingModule } from '@nestjs/testing';
import { ManagersService } from './managers.service';
import { faker } from '@faker-js/faker';
import {
  Manager,
  ManagerDocument,
  ManagersRoleEnum,
} from '../schemas/manager.entity';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { StudentsService } from '../../students/services/students.service';
import { Student } from 'src/students/schemas/student.entity';
import { CreateManagerDto } from '../dto/create-manager.dto';
import { UpdateManagerDto } from '../dto/update-manager.dto';
import { getModelToken } from '@nestjs/mongoose';

const managerId = faker.database.mongodbObjectId();
const managerEmail = faker.internet.email();
const managerName = faker.person.fullName();
const managerRole = ManagersRoleEnum.COORDINATORS;

const mockManager = {
  _id: managerId,
  name: managerName,
  email: managerEmail,
  role: managerRole,
};

const managerModelMock: Partial<Model<ManagerDocument>> = {
  findOne: jest.fn().mockImplementation((query) => {
    if (query._id === managerId) return mockManager;
    return null;
  }),
  findById: jest.fn().mockImplementation((_id) => {
    if (_id === managerId) return mockManager;
    return null;
  }),
  find: jest.fn().mockImplementation((query) => {
    return Promise.resolve([mockManager]); // Adjust if needed
  }),
  create: jest.fn().mockImplementation((doc) => {
    return Promise.resolve(doc);
  }),
  updateOne: jest.fn().mockImplementation((query, update) => {
    if (query._id === managerId) {
      Object.assign(mockManager, update);
      return { nModified: 1 };
    }
    return { nModified: 0 };
  }),
  deleteOne: jest.fn().mockImplementation((query) => {
    if (query._id === managerId) {
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }),
};

const studentsServiceMock = {
  findByEmail: jest.fn().mockImplementation((email) => {
    if (email === managerEmail) return mockManager;
    return null;
  }),
};

describe('ManagersService', () => {
  let managersService: ManagersService;
  let managerModel: Model<ManagerDocument>;
  let studentService: StudentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ManagersService,
        {
          provide: getModelToken(Manager.name),
          useValue: managerModelMock,
        },
        {
          provide: StudentsService,
          useValue: studentsServiceMock,
        },
      ],
    }).compile();

    managersService = module.get<ManagersService>(ManagersService);
    managerModel = module.get<Model<ManagerDocument>>(
      getModelToken(Manager.name),
    );
    studentService = module.get<StudentsService>(StudentsService);
  });

  it('should be defined', () => {
    expect(managersService).toBeDefined();
    expect(managerModel).toBeDefined();
    expect(studentService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all managers', async () => {
      const allManagers = await managersService.findAll();

      expect(managerModel.find).toHaveBeenCalled();
      expect(allManagers).toEqual([mockManager]);
    });

    it('should throw an exception', () => {
      jest.spyOn(managerModel, 'find').mockRejectedValueOnce(new Error());

      expect(managersService.findAll()).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('should return a specific manager', async () => {
      const foundManager = await managersService.findOne(mockManager._id);

      expect(managerModel.findById).toHaveBeenCalled();
      expect(foundManager).toEqual(mockManager);
    });

    it('should return MANAGERS_ERRORS.NOT_FOUND', async () => {
      await expect(
        managersService.findOne('595e867fe9af41af7f111234'),
      ).rejects.toThrow('Usuário não encontrado.');
    });
  });

  describe('findByEmail', () => {
    it('should return a specific manager by email', async () => {
      jest.spyOn(managerModel, 'findOne').mockResolvedValueOnce(mockManager);
      const managersByEmail = await managersService.findByEmail(
        mockManager.email,
        true,
      );
      expect(managerModel.findOne).toHaveBeenCalled();
      expect(managersByEmail).toEqual(mockManager);
    });
    it('should return a specific manager by email and active true', async () => {
      jest.spyOn(managerModel, 'findOne').mockResolvedValueOnce(mockManager);
      const managersByEmail = await managersService.findByEmail(
        mockManager.email,
        true,
      );
      expect(managerModel.findOne).toHaveBeenCalled();
      expect(managerModel.findOne).toHaveBeenCalledWith(
        { active: true, email: mockManager.email.toLowerCase() },
        ['+password'],
      );
      expect(managersByEmail).toEqual(mockManager);
    });
    it('should return a specific manager by email and active false', async () => {
      jest.spyOn(managerModel, 'findOne').mockResolvedValueOnce(mockManager);
      const managersByEmail = await managersService.findByEmail(
        mockManager.email,
        false,
      );
      expect(managerModel.findOne).toHaveBeenCalled();
      expect(managerModel.findOne).toHaveBeenCalledWith(
        { email: mockManager.email.toLowerCase() },
        ['+password'],
      );
      expect(managersByEmail).toEqual(mockManager);
    });
    it('should return null if manager not found', async () => {
      const email = 'nonexistent@email.com';
      jest.spyOn(managerModel, 'findOne').mockResolvedValueOnce(null);
      const managerByEmail = await managersService.findByEmail(email, true);
      expect(managerModel.findOne).toHaveBeenCalled();
      expect(managerByEmail).toBeNull();
    });
  });

  describe('deleteById', () => {
    it('should delete a manager successfully', async () => {
      const deleteManager = await managersService.remove(mockManager._id);

      expect(deleteManager).toBeUndefined();
      expect(managerModel.updateOne).toHaveBeenCalled();
      expect(managerModel.findById).toHaveBeenCalled();
    });

    it('should return MANAGERS_ERRORS.NOT_FOUND', async () => {
      await expect(
        managersService.remove('595e867fe9af41af7f111234'),
      ).rejects.toThrow('Usuário não encontrado.');
    });

    it('should throw an exception', () => {
      jest.spyOn(managerModel, 'updateOne').mockRejectedValue(new Error());

      expect(
        managersService.remove('595e867fe9af41af7f111234'),
      ).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a new manager', async () => {
      const mockManagerDto: CreateManagerDto = {
        ...mockManager,
        password: faker.internet.password(),
      };

      jest.spyOn(studentService, 'findByEmail').mockResolvedValue(null);

      const createdManager = await managersService.create(mockManagerDto);

      expect(managerModel.create).toHaveBeenCalledWith(mockManagerDto);
      expect(createdManager).toBeDefined();
    });

    it('should return MANAGERS_ERRORS.DUPLICATE_EMAIL', async () => {
      const mockManagerDto: CreateManagerDto = {
        ...mockManager,
        password: faker.internet.password(),
      };

      jest
        .spyOn(studentService, 'findByEmail')
        .mockResolvedValue(mockManager as unknown as Student);

      await expect(managersService.create(mockManagerDto)).rejects.toThrow(
        'Este endereço de e-mail já está em uso.',
      );
    });
  });

  describe('update', () => {
    it('should update a manager', async () => {
      const mockManagerDto: UpdateManagerDto = {
        password: faker.internet.password(),
      };

      jest.spyOn(managerModel, 'findById').mockResolvedValue(mockManager);
      jest
        .spyOn(managerModel, 'updateOne')
        .mockResolvedValue({ nModified: 1 } as any);

      const updateManager = await managersService.update(
        managerId,
        mockManagerDto,
      );

      expect(managerModel.updateOne).toHaveBeenCalled();
      expect(managerModel.findById).toHaveBeenCalled();
      expect(updateManager).toBeDefined();
    });

    it('should update a manager email', async () => {
      const mockManagerDto: UpdateManagerDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      jest.spyOn(managerModel, 'findById').mockResolvedValue(mockManager);
      jest.spyOn(studentService, 'findByEmail').mockResolvedValue(null);

      const updateManager = await managersService.update(
        managerId,
        mockManagerDto,
      );

      expect(managerModel.updateOne).toHaveBeenCalled();
      expect(managerModel.findById).toHaveBeenCalled();
      expect(updateManager).toBeDefined();
    });

    it('should return MANAGERS_ERRORS.NOT_FOUND', async () => {
      const mockManagerDto: UpdateManagerDto = {
        password: faker.internet.password(),
      };

      jest.spyOn(managerModel, 'findById').mockReturnValueOnce(null);

      await expect(
        managersService.update('595e867fe9af41af7f111234', mockManagerDto),
      ).rejects.toThrow('Usuário não encontrado.');
    });

    it('should return MANAGERS_ERRORS.DUPLICATE_EMAIL', async () => {
      const mockManagerDto: UpdateManagerDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      jest.spyOn(managerModel, 'findById').mockResolvedValue(mockManager);
      jest
        .spyOn(studentService, 'findByEmail')
        .mockResolvedValue(mockManager as unknown as Student);

      await expect(
        managersService.update(mockManager._id, mockManagerDto),
      ).rejects.toThrow('Este endereço de e-mail já está em uso.');
    });
  });

  describe('findRole', () => {
    it('should return the role of a specific manager', async () => {
      jest.spyOn(managerModel, 'findOne').mockImplementationOnce(
        (
          filter?: FilterQuery<any>,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          projection?: ProjectionType<any> | null,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          options?: QueryOptions<any> | null,
        ) => {
          if ((filter as any)._id === managerId) return mockManager as any;
          return null;
        },
      );

      const managerRole = await managersService.findRole(mockManager._id);

      expect(managerModel.findOne).toHaveBeenCalledWith(
        { _id: mockManager._id },
        ['roles'],
      );
      expect(managerRole).toEqual(mockManager.role);
    });

    it('should return MANAGERS_ERRORS.NOT_FOUND', async () => {
      jest.spyOn(managerModel, 'findOne').mockResolvedValue(null);

      await expect(
        managersService.findRole('595e867fe9af41af7f111234'),
      ).rejects.toThrow('Usuário não encontrado.');
    });
  });
});
