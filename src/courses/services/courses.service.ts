import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from '../dto/create-course.dto';
import { Course, CourseDocument } from '../schema/course.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CourseResponseDto } from '../dto/course-response.dto';
import { COURSES_ERRORS } from '../constants/courses-errors';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name)
    private courseModel: Model<CourseDocument>,
  ) {}

  private createSlugByName(name: string): string {
    const lowerCaseName = name.toLowerCase();
    const slug = lowerCaseName.replace(/\s+/g, '_');
    return slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }


  public async create(dto: CreateCourseDto): Promise<CourseResponseDto> {
    const slug = this.createSlugByName(dto.name);

    const created = await this.courseModel.create({ ...dto, slug });

    return new CourseResponseDto(created);  
  }

  public async findAll(): Promise<CourseResponseDto[]> {
    const courses = await this.courseModel.find();

    return courses.map((item) => new CourseResponseDto(item));
  }

  public async findCourseByID(_id: string): Promise<Course> {
    const student = await this.courseModel.findById(_id);

    if (!student) throw COURSES_ERRORS.NOT_FOUND;

    return student;
  }

  public async findOne(_id: string): Promise<CourseResponseDto> {
    const course = await this.findCourseByID(_id);

    return new CourseResponseDto(course);
  }
}
