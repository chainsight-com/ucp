import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { QrScannerService } from "../../../services/qr-scanner.service";
import { HttpClient } from "@angular/common/http";
import { UserService } from "../../../services/user.service";
import { NzMessageService } from "ng-zorro-antd";
import { finalize, map, take } from "rxjs/operators";
import { AddressCaseCreation, IncidentDto, AddressCaseCreationLevelEnum } from '@chainsight/unblock-api-axios-sdk';
import { ApiService } from 'src/app/services/api.service';
import { from } from 'rxjs';

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
    private api: ApiService) {

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
      title: formValue.title,
      currencyId: null,
      address: null,
      level: AddressCaseCreationLevelEnum.High
    };


    this.isSubmitting = true;
    from(this.api.incidentApi.createIncident(body))
      .pipe(
        take(1),
        map(resp => resp.data),
        finalize(() => {
          this.isSubmitting = false;
        })
      ).subscribe(resBody => {
        this.onSubmitted.emit(resBody)
      }, console.error);

  }

}
