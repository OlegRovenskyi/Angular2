import {
  Component, ViewEncapsulation, OnInit, OnDestroy, ChangeDetectorRef
} from '@angular/core';
import { CourseItem, CourseRaiting, Pagination, CoursesCount } from '../../models';
import { CoursesService, LoaderService, SearchService } from '../../core/services';
import { Observable, Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
// import { FilterByPipe } from '../../shared';

@Component({
  selector: 'cr-courses',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [ './courses.scss' ],
  templateUrl: './courses.html',
})

export class CoursesComponent implements OnInit, OnDestroy {
  public courseList$: Observable<CourseItem[]>;
  public courseSearchList$: Observable<CourseItem[]>;
  public coursesCount$: Observable<CoursesCount>;
  public courseId: number;
  public isShowModal: boolean;
  public currentPage: number = 0;
  public itemsPerPage: number = 10;
  private subscription: Subscription[] = [];
  private searchCourseSorce: Subject<string> = new Subject();

  constructor(private coursesService: CoursesService,
              private searchService: SearchService,
              private router: Router,
              private loaderService: LoaderService,
              private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getCoursesCount();
    this.getCourses(0, 10);
  }

  getCourses(start: number, count: number): void {
    this.courseList$ = this.coursesService.getCourses(start, count);
    this.changeDetectorRef.detectChanges();
  }

  getCoursesCount(): void {
    this.coursesCount$ = this.coursesService.getCoursesCount();
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((item: Subscription) => {
      item.unsubscribe();
    });
  }

  onSearch(search: string) {
    this.courseList$ = this.searchService.search(search);
    this.changeDetectorRef.detectChanges();
  }

  deleteCourse() {
    this.hideModal();

    this.subscription.push(this.coursesService.deleteCourse(this.courseId)
      .do(() => {
        this.getCoursesCount();
      })
      .do(() => {
        this.getCourses(0, 10);
      })
      .subscribe()
    );
  }

  // onToggleRaiting(topRated: CourseRaiting): void {
  //   this.loaderService.show();
  //
  //   this.subscription.push(this.coursesService.updateRaiting(topRated.id, topRated.topRated)
  //     .subscribe(() => {
  //       this.loaderService.hide();
  //     })
  //   );
  // }

  onDelete(id: number): void {
    this.courseId = id;

    this.showModal();
  }

  onEdit(id: string): void {
    this.router.navigateByUrl(`/edit-course/${ id }`);
  }

  pageChange(data: Pagination): void {
    this.itemsPerPage = data.count;

    if (data.start === 1) {
      this.currentPage = 0;
    } else {
      this.currentPage = (data.start - 1) * data.count;
    }

    this.getCourses(this.currentPage, this.itemsPerPage);
  }

  hideModal(): void {
    this.isShowModal = false;
  }

  showModal(): void {
    this.isShowModal = true;
  }
}
