import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {HolderGroupApiService, HolderGroupCreation, HolderGroupUpdates} from '@profyu/unblock-ng-sdk';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-holder-group-add',
  templateUrl: './holder-group-add.component.html',
  styleUrls: ['./holder-group-add.component.scss']
})
export class HolderGroupAddComponent implements OnInit {

  validateForm: FormGroup;
  public id: number;
  public isEditing = false;

  constructor(private fb: FormBuilder,
              private router: Router,
              private userService: UserService,
              private holderGroupApiService: HolderGroupApiService,
              private message: NzMessageService,
              private route: ActivatedRoute) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (!!this.id) {
      this.isEditing = true;
    }
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      enabled: [null, [Validators.required]]
    });
    if (this.isEditing) {
      this.holderGroupApiService.getHolderGroupUsingGET(this.id).subscribe(res => {
        console.log(res);
        this.validateForm.setValue({'name': res.name, 'enabled': res.enabled});
      }, (error) => {
        this.message.create('error', error);
      });
    }
  }

  submitForm(): void {
    console.log(this.validateForm.value);
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (!!this.validateForm.valid) {
      if (this.isEditing) {
        this.holderGroupApiService.updateHolderGroupUsingPUT(
          this.id,
          {
            'name': this.validateForm.value.name,
            'enabled': this.validateForm.value.enabled
          } as HolderGroupUpdates
        ).subscribe(res => {
          this.router.navigate(['/holder-group']);
        }, (error) => {
          this.message.create('error', error);
        });
      } else {
        const newVal = {
          name: this.validateForm.value.name,
          projectId: this.userService.project$.getValue().id
        } as HolderGroupCreation;

        this.holderGroupApiService.createHolderGroupUsingPOST(newVal)
          .subscribe(res => {
            this.router.navigate(['/holder-group']);
          }, (error) => {
            this.message.create('error', error);
          });
      }
    }
  }

  handleCancel() {
    this.router.navigate(['/holder-group']);
  }

}
