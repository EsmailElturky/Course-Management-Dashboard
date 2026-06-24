import { CourseStatus } from '../enums';
import { Course } from './course.interface';

export interface CourseQuery {
  page: number;
  pageSize: number;
  search?: string;
  status?: CourseStatus | '';
}

export interface CourseListResponse {
  data: Course[];
  total: number;
  page: number;
  pageSize: number;
}
