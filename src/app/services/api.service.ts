import { Injectable } from '@angular/core';
import { AccountApi, AddressApi, AddressCaseApi, AddressCaseCommentApi, AddressScanApi, AddressScanBatchApi, AuthApi, BlobApi, Configuration, CurrencyApi, FlowLabelingApi, HolderAddressApi, HolderApi, IncidentAddressScanApi, IncidentApi, IncidentClusterApi, LabelApi, LabelCategoryApi, ProjectApi, RuleApi, TxApi } from '@chainsight/unblock-api-axios-sdk';
import { UserService } from './user.service';
import axios, { AxiosInstance } from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public addressScanApi: AddressScanApi;
  public holderApi: HolderApi;
  public addressCaseApi: AddressCaseApi;
  public accountApi: AccountApi;
  public projectApi: ProjectApi;
  public addressApi: AddressApi;
  public authApi: AuthApi;
  public incidentApi: IncidentApi;
  public incidentClusterApi: IncidentClusterApi;
  public incidentAddressScanApi: IncidentAddressScanApi;
  public flowLabelingApi: FlowLabelingApi;
  public labelCategoryApi: LabelCategoryApi;
  public labelApi: LabelApi;
  public blobApi: BlobApi;
  public txApi: TxApi;
  public currencyApi: CurrencyApi;
  public addressScanBatchApi: AddressScanBatchApi;
  public addressCaseCommentApi: AddressCaseCommentApi;
  public ruleApi: RuleApi;
  public holderAddressApi: HolderAddressApi;
             
              
              

  constructor(private userService: UserService) {
    const axiosInst = axios.create({
      // baseURL: environment.baseApiUrl,
      timeout: 30000,
    });
    const config = new Configuration({
      apiKey: async () => {
        return `Bearer ${userService.token}`;
      }
    });
    this.addressScanApi = new AddressScanApi(config, environment.baseApiUrl, axios);
    this.holderApi = new HolderApi(config, environment.baseApiUrl, axios);
    this.addressCaseApi = new AddressCaseApi(config, environment.baseApiUrl, axios);
    this.accountApi = new AccountApi(config, environment.baseApiUrl, axios);
    this.projectApi = new ProjectApi(config, environment.baseApiUrl, axios);
    this.addressApi = new AddressApi(config, environment.baseApiUrl, axios);
    this.authApi = new AuthApi(config, environment.baseApiUrl, axios);
    this.incidentApi = new IncidentApi(config, environment.baseApiUrl, axios);
    this.incidentClusterApi = new IncidentClusterApi(config, environment.baseApiUrl, axios);
    this.incidentAddressScanApi = new IncidentAddressScanApi(config, environment.baseApiUrl, axios);
    this.flowLabelingApi = new FlowLabelingApi(config, environment.baseApiUrl, axios);
    this.labelCategoryApi = new LabelCategoryApi(config, environment.baseApiUrl, axios);
    this.labelApi = new LabelApi(config, environment.baseApiUrl, axios);
    this.blobApi = new BlobApi(config, environment.baseApiUrl, axios);
    this.txApi = new TxApi(config, environment.baseApiUrl, axios);
    this.currencyApi = new CurrencyApi(config, environment.baseApiUrl, axios);
    this.addressScanBatchApi = new AddressScanBatchApi(config, environment.baseApiUrl, axios);
    this.addressCaseCommentApi = new AddressCaseCommentApi(config, environment.baseApiUrl, axios);
    this.ruleApi = new RuleApi(config, environment.baseApiUrl, axios);
    this.holderAddressApi = new HolderAddressApi(config, environment.baseApiUrl, axios);
    


  }
}
