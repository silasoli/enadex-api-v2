import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { faker } from '@faker-js/faker';
import { Course, CourseDocument } from '../schema/course.entity';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { CreateCourseDto } from '../dto/create-course.dto';

const courseId = faker.database.mongodbObjectId();
const courseName = faker.company.catchPhrase();
const courseCreatedDate = faker.date.anytime();

const mockCourse = {
  _id: courseId,
  name: courseName,
  createdAt: courseCreatedDate,
};

const courseModelMock: Partial<Model<CourseDocument>> = {
  create: jest.fn().mockImplementation((doc) => {
    return Promise.resolve(doc);
  }),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  find: jest.fn().mockImplementation((query) => {
    return Promise.resolve([mockCourse]);
  }),
  findById: jest.fn().mockImplementation((_id) => {
    if (_id === courseId) return mockCourse;
    return null;
  }),
};

describe('CoursesService', () => {
  let coursesService: CoursesService;
  let courseModel: Model<CourseDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getModelToken(Course.name),
          useValue: courseModelMock,
        },
      ],
    }).compile();

    coursesService = module.get<CoursesService>(CoursesService);
    courseModel = module.get<Model<CourseDocument>>(getModelToken(Course.name));
  });

  it('should be defined', () => {
    expect(coursesService).toBeDefined();
    expect(courseModel).toBeDefined();
  });

  describe('create', () => {
    it('should create a new course', async () => {
      const mockCourseDto: CreateCourseDto = {
        ...mockCourse,
      };

      const lowerCaseName = mockCourse.name.toLowerCase();
      const replace = lowerCaseName.replace(/\s+/g, '_');
      const slug = replace.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      const createdCourse = await coursesService.create(mockCourseDto);

      expect(courseModel.create).toHaveBeenCalledWith({
        ...mockCourseDto,
        slug,
      });
      expect(createdCourse).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return all courses', async () => {
      const allCourses = await coursesService.findAll();

      expect(courseModel.find).toHaveBeenCalled();
      expect(allCourses).toEqual([mockCourse]);
    });

    it('should throw an exception', () => {
      jest.spyOn(courseModel, 'find').mockRejectedValueOnce(new Error());

      expect(coursesService.findAll()).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('should return a specific course', async () => {
      const foundCourse = await coursesService.findOne(mockCourse._id);

      expect(courseModel.findById).toHaveBeenCalled();
      expect(foundCourse).toEqual(mockCourse);
    });

    it('should return COURSES_ERRORS.NOT_FOUND', async () => {
      await expect(
        coursesService.findOne('595e867fe9af41af7f111234'),
      ).rejects.toThrow('Curso não encontrado.');
    });
  });
});
