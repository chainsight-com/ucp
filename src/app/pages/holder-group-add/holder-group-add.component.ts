import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {HolderGroupApiService, HolderGroupCreation} from '@profyu/unblock-ng-sdk';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-holder-group-add',
  templateUrl: './holder-group-add.component.html',
  styleUrls: ['./holder-group-add.component.scss']
})
export class HolderGroupAddComponent implements OnInit {

  validateForm: FormGroup;


  constructor(private fb: FormBuilder,
              private router: Router,
              private userService: UserService,
              private holderGroupApiService: HolderGroupApiService,
              private message: NzMessageService) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]]
    });
  }

  submitForm(): void {
    console.log(this.validateForm.value);
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (!!this.validateForm.valid) {
      console.log(this.validateForm.value);
      console.log(this.userService.project$.getValue());
      const newVal = {
        name: this.validateForm.value.name,
        projectId: this.userService.project$.getValue().id
      } as HolderGroupCreation;

      this.holderGroupApiService.createHolderGroupUsingPOST(newVal).subscribe(res => {
        this.router.navigate(['/holder-group']);
      }, (error) => {
        this.message.create('error', error);
      });

    }
  }

  handleCancel() {
    this.router.navigate(['/holder-group']);
  }

}
