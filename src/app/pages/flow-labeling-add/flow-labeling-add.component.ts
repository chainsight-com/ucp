import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {HolderGroupApiService, HolderGroupCreation, HolderGroupUpdates} from '@profyu/unblock-ng-sdk';
import {NzMessageService, UploadFile, UploadXHRArgs} from 'ng-zorro-antd';
import {HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse} from '@angular/common/http';

@Component({
  selector: 'app-flow-labeling-add',
  templateUrl: './flow-labeling-add.component.html',
  styleUrls: ['./flow-labeling-add.component.scss']
})
export class FlowLabelingAddComponent implements OnInit {

  validateForm: FormGroup;
  public id: number;
  public isEditing = false;
  fileList: UploadFile[] = [];
  currencyOpt = [
    {name: 'BTC', val: 'btc'},
    {name: 'ZIL', val: 'zil'},
    {name: 'ETH', val: 'eth'}
  ];

  constructor(private fb: FormBuilder,
              private router: Router,
              private userService: UserService,
              private holderGroupApiService: HolderGroupApiService,
              private message: NzMessageService,
              private http: HttpClient) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      currency: [null, [Validators.required]],
      maxLevel: [null],
      rangePicker: [null],
      label: [null]
    });
  }

  submitForm(): void {
    console.log(this.validateForm.value);
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    // if (!!this.validateForm.valid) {
    //   if (this.isEditing) {
    //     this.holderGroupApiService.updateHolderGroupUsingPUT(
    //       this.id,
    //       {
    //         'name': this.validateForm.value.name,
    //         'enabled': this.validateForm.value.enabled
    //       } as HolderGroupUpdates
    //     ).subscribe(res => {
    //       this.router.navigate(['/holder-group']);
    //     }, (error) => {
    //       this.message.create('error', error);
    //     });
    //   } else {
    //     const newVal = {
    //       name: this.validateForm.value.name,
    //       projectId: this.userService.project$.getValue().id
    //     } as HolderGroupCreation;
    //
    //     this.holderGroupApiService.createHolderGroupUsingPOST(newVal)
    //       .subscribe(res => {
    //         this.router.navigate(['/holder-group']);
    //       }, (error) => {
    //         this.message.create('error', error);
    //       });
    //   }
    // }
  }

  customReq(item: UploadXHRArgs) {
    // Create a FormData here to store files and other parameters.
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    formData.append('file', item.file as any);
    formData.append('id', '1000');

    return this.http.post<any>('http://localhost:8080/savefile', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe((event: any) => {
      if (typeof (event) === 'object') {
        console.log(event.body);
      }
    });
  }

  handleCancel() {
    this.router.navigate(['/flow-labeling']);
  }

}
