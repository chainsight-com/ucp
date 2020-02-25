import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-holder-detail-address-add',
  templateUrl: './holder-detail-address-add.component.html',
  styleUrls: ['./holder-detail-address-add.component.scss']
})
export class HolderDetailAddressAddComponent implements OnInit {

  public validateForm: FormGroup;
  public id: string;


  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {

    this.validateForm = this.fb.group({
      flow: [null, [Validators.required]],
      name: [null, [Validators.required]],
      type: [null, [Validators.required]],
      address: [null, [Validators.required]]
    });
    if (!!this.id) {
      console.log(this.id);
      this.validateForm.patchValue({'holderId': this.id});
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
    this.router.navigate(['/holder-detail-address/' + this.id]);
  }
}
