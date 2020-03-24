import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {HolderGroupApiService, HolderGroupCreation, HolderGroupUpdates} from '@profyu/unblock-ng-sdk';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';

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
  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  constructor(private fb: FormBuilder,
              private router: Router,
              private userService: UserService,
              private holderGroupApiService: HolderGroupApiService,
              private message: NzMessageService) {
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

  handleCancel() {
    this.router.navigate(['/flow-labeling']);
  }

}
