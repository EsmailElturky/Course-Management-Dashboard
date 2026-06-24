import { CourseCategory } from '../enums/course-category.enum';
import { CourseStatus } from '../enums/course-status.enum';

export interface Course {
  id: number;
  courseName: string;
  instructorName: string;
  category: CourseCategory;
  duration: number;
  price: number;
  status: CourseStatus;
  createdDate: string;
  description?: string;
}

export interface CreateCourseRequest {
  courseName: string;
  instructorName: string;
  category: CourseCategory;
  duration: number;
  price: number;
  status: CourseStatus;
  description?: string;
}
