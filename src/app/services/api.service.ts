import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { AddressScanApi, Configuration } from '@chainsight/unblock-api-axios-sdk';
import { UserService } from './user.service';
import axios, { AxiosInstance } from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public addressScanApi: AddressScanApi;

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


  }
}
