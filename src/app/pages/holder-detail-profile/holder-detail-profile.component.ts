import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-holder-detail-profile',
  templateUrl: './holder-detail-profile.component.html',
  styleUrls: ['./holder-detail-profile.component.scss']
})
export class HolderDetailProfileComponent implements OnInit {

  holderId: string;
  public validateForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.holderId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      namespace: [null, [Validators.required]],
      holderId: [null, [Validators.required]],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      country: [null, [Validators.required]],
      birthday: [null, [Validators.required]]
    });
    if (!!this.holderId) {
      console.log(this.holderId);
      this.validateForm.patchValue({'holderId': this.holderId});
    }
  }
  submitForm(): void {
    console.log(this.validateForm.value);
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  handleCancel() {
    this.router.navigate(['/holder']);
  }
}
