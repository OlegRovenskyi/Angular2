import {
  Component, ViewEncapsulation, Output, EventEmitter, Input, OnInit, SimpleChanges, OnChanges
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { CourseItem } from '../../../models';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { validateOnlyNumbers } from '../../../shared/validators/only-numbers/only-numbers.validator';
import { validateDateFormat } from '../../../shared/validators/date-format/date-format.validator';
import {
  validateCheckedCheckbox
} from '../../../shared/validators/checked-checkbox.validator/checked-checkbox.validator';
import { Users } from '../../../models/users.model';
import { BreadcrumbService } from 'ng2-breadcrumb/app/components/breadcrumbService';

@Component({
	selector: 'cr-edit-course-form',
	templateUrl: './edit-course-form.html',
  styleUrls: [ './edit-course-form.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class EditCourseFormComponent implements OnInit, OnChanges {
  @Input() public courseInfo: CourseItem;
  @Input() date: string;
  @Input() duration: string;
  @Input() authors: Users;

  @Output() onSubmit: EventEmitter<CourseItem> = new EventEmitter<CourseItem>();

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private datePipe: DatePipe,
              private breadcrumbService: BreadcrumbService) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(500)]],
      date: ['', [validateDateFormat]],
      duration: ['', [validateOnlyNumbers]],
      authors: ['', [validateCheckedCheckbox]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['courseInfo'] && changes['courseInfo'].currentValue) {
      this.breadcrumbService.addFriendlyNameForRouteRegex('/courses/[0-9]', changes['courseInfo'].currentValue.name);

      _.forOwn(this.formGroup.controls, (value, key): void => {
        let data = changes['courseInfo'].currentValue[key];

        if (key === 'date') {
          data = this.datePipe.transform(data, 'yyyy.MM.dd');
        }

        this.setControlValue(key, data);
      });
    }
  }

  setControlValue(controlName, value): void {
    this.formGroup.controls[controlName].setValue(value);

    switch (controlName) {
      case 'date':
        this.date = value || '';
        break;
      case 'duration':
        this.duration = value || '';
        break;
      case 'authors':
        this.authors = value;
        break;
    }
  }

  formatToDateString(data: string): string {
    const date: Date = new Date(data);

    return date.toDateString();
  }

  submit(event: NgForm): void {
    event.value.date = this.formatToDateString(event.value.date);

    if (event.valid) {
      this.onSubmit.emit(Object.assign(this.courseInfo, event.value));
    }
  }
}
