import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {
  AddressCaseApiService,
  AddressCaseDto,
  HolderAddressDto,
  HolderApiService,
  HolderDto, PageOfHolderAddressDto, PageOfWitnessDto
} from "@profyu/unblock-ng-sdk";
import {filter, map, take} from "rxjs/operators";
import {RISK_LEVEL_MAP} from "../../models/holder-risk-level-option";
import {formatDate} from "@angular/common";


@Component({
  selector: 'app-address-info',
  templateUrl: './address-info.component.html',
  styleUrls: ['./address-info.component.scss']
})
export class AddressInfoComponent implements OnInit, OnChanges {

  @Input()
  public projectId: string;
  @Input()
  public address: string;
  @Input()
  public currencyId: string;
  @Input()
  public tags: Array<{ tag: string, score: number }>

  public isHolderLoading = false;
  public holder: HolderDto

  public isHolderAddressLoading = false;
  public holderAddressPageIdx = 0;
  public holderAddressPageSize = 500;
  public holderAddressPage: PageOfHolderAddressDto = {
    last: false,
    content: [],
  };

  public addressCase: AddressCaseDto;
  private isAddressCaseLoading: boolean = false;


  constructor(private holderApiService: HolderApiService,
              private addressCaseApiService: AddressCaseApiService) {
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.address || changes.projectId) {
      if (this.projectId && this.address) {
        this.reload();
      }
    }
  }

  reload() {
    this.reloadHolder();
    this.reloadAddressCase();
  }

  reloadHolder() {
    this.isHolderLoading = true;
    this.holderApiService.paginateHolderUsingGET(0, 1, this.projectId, null, null, this.currencyId, this.address)
      .pipe(
        take(1),
        filter(page => page.content.length == 1),
        map(page => page.content[0])
      ).subscribe(holder => {
      this.holder = holder;
    }, console.error, () => {
      this.isHolderLoading = false;
    });
  }

  private reloadAddressCase() {
    this.isAddressCaseLoading = true;
    this.addressCaseApiService.paginateAddressCaseUsingGET(0, 1, this.projectId, this.currencyId, this.address)
      .pipe(
        take(1),
        filter(page => page.content.length == 1),
        map(page => page.content[0])
      ).subscribe(addressCase => {
      this.addressCase = addressCase;
    }, console.error, () => {
      this.isAddressCaseLoading = false;
    });
  }


  holderLevelFormatter(level: HolderDto.LevelEnum) {
    const attr = RISK_LEVEL_MAP[level];
    if (!attr) {
      return {
        color: '#108ee9',
        title: 'default'
      };
    }
    return {
      color: attr.color,
      title: attr.label,
    };
  }


}
