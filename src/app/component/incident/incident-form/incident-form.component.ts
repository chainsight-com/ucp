import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {QrScannerService} from "../../../services/qr-scanner.service";
import {HttpClient} from "@angular/common/http";
import {
  AccountApiService,
  AddressCaseApiService,
  AddressCaseCreation, AddressScanDto,
  IncidentApiService, IncidentDto, RestApiException
} from "@profyu/unblock-ng-sdk";
import {UserService} from "../../../services/user.service";
import {NzMessageService} from "ng-zorro-antd";
import {finalize, take} from "rxjs/operators";
import ApiErrorCodeEnum = RestApiException.ApiErrorCodeEnum;

@Component({
  selector: 'app-incident-form',
  templateUrl: './incident-form.component.html',
  styleUrls: ['./incident-form.component.scss']
})
export class IncidentFormComponent implements OnInit {
  @Input()
  public projectId: string;

  @Output()
  public onSubmitted: EventEmitter<IncidentDto> = new EventEmitter<IncidentDto>();

  public form: FormGroup;
  public isSubmitting = false;

  constructor(private fb: FormBuilder,
              private message: NzMessageService,
              private incidentApiService: IncidentApiService) {

  }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [null, [Validators.required]]
    });
  }

  clear() {
    this.form.reset();
  }

  submit() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }

    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;

    const body: AddressCaseCreation = {
      projectId: this.projectId,
      title: formValue.title
    };


    this.isSubmitting = true;
    this.incidentApiService.createIncidentUsingPOST(body)
      .pipe(
        take(1),
        finalize(() => {
          this.isSubmitting = false;
        })
      ).subscribe(resBody => {
      this.onSubmitted.emit(resBody)
    }, console.error);

  }

}
