import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {RuleApiService, RuleDto} from "@profyu/unblock-ng-sdk";
import {finalize, take} from "rxjs/operators";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-rule-info',
  templateUrl: './rule-info.component.html',
  styleUrls: ['./rule-info.component.scss']
})
export class RuleInfoComponent implements OnInit, OnChanges {

  @Input()
  public ruleId: string;
  public rule: RuleDto;
  public isLoading: boolean;

  videoUrl() {
    if (this.rule && this.rule.videoUrl) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.rule.videoUrl);
    }
    return null;

  }

  constructor(private ruleApiService: RuleApiService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.reloadRule();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ruleId && changes.ruleId.currentValue) {
      this.reloadRule();
    }
  }

  reloadRule() {
    this.rule = null;
    this.isLoading = true;
    this.ruleApiService.getHolderUsingGET1(this.ruleId)
      .pipe(
        take(1),
        finalize(() => this.isLoading = false)
      ).subscribe(resp => {
      this.rule = resp;
    });
  }


}
