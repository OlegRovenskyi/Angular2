import { Injectable } from '@angular/core';
import { CourseItem } from '../models/course-item.model';
import { Observable, Subject } from 'rxjs';
import * as _ from 'lodash';

@Injectable()
export class CoursesService {
  private courseList: CourseItem[] = [{
    id: '1',
    name: 'name 1',
    duration: 5000,
    date: new Date(),
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ' +
    'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer ' +
    'took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, ' +
    'but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s ' +
    'with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing ' +
    'software like Aldus PageMaker including versions of Lorem Ipsum.'
  }, {
    id: '2',
    name: 'name 2',
    duration: 5000,
    date: new Date(),
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ' +
    'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer ' +
    'took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, ' +
    'but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s ' +
    'with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing ' +
    'software like Aldus PageMaker including versions of Lorem Ipsum.'
  }, {
    id: '3',
    name: 'name 3',
    duration: 5000,
    date: new Date(),
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ' +
    'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer ' +
    'took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, ' +
    'but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s ' +
    'with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing ' +
    'software like Aldus PageMaker including versions of Lorem Ipsum.'
  }];

  private courseListSorce: Subject<CourseItem[]> = new Subject();
  public courseList$: Observable<CourseItem[]> = this.courseListSorce.asObservable().startWith(this.courseList);

  constructor() {}

  getCourseItems(): Observable<CourseItem[]> {
    return this.courseList$;
  }

  generateId(): string {
    return _.uniqueId('id_');
  }

  createCourse(data: CourseItem): Observable<CourseItem> {
    const newCourse: CourseItem = {
      id: this.generateId(),
      name: data.name,
      duration: data.duration,
      date: new Date(),
      description: data.description
    };

    this.courseList.push(newCourse);

    this.courseListSorce.next(this.courseList);

    return Observable.of(newCourse);
  }

  getCourse(id: string): Observable<CourseItem> {
    let course: CourseItem;
    const courseId = { id };

    course = _.find( this.courseList, courseId);

    return Observable.of(course);
  }

  updateCourse(id: string, data: CourseItem): Observable<{}> {
    this.courseList.forEach((item) => {
      if (item.id === id) {
        Object.assign(item, data);
      }
    });

    this.courseListSorce.next(this.courseList);

    return Observable.of(this.courseList);
  }

  removeCourse(id: string): Observable<CourseItem[]> {
    this.courseList.forEach((item, index) => {
      if (item.id === id) {
        this.courseList.splice(index, 1);
      }
    });

    this.courseListSorce.next(this.courseList);

    return Observable.of(this.courseList);
  }
}
