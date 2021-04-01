import { Component, OnInit } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { QrScannerService } from 'src/app/services/qr-scanner.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-scan-page',
  templateUrl: './scan-page.component.html',
  styleUrls: ['./scan-page.component.scss']
})
export class ScanPageComponent implements OnInit {

  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;

  formatsEnabled: BarcodeFormat[] = [
    // BarcodeFormat.CODE_128,
    // BarcodeFormat.DATA_MATRIX,
    // BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE,
  ];
  hasDevices: boolean;
  hasPermission: boolean;

  hasResult = false;

  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = true;
  constructor(protected location: Location, protected qrScannerService: QrScannerService) {

  }

  ngOnInit() {
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onCodeResult(code: string) {
    console.log('qrcode', code);
    if (!this.hasResult) {
      this.hasResult = true;
      this.qrScannerService.code$.next(code);
      this.location.back();

    }

  }

  onDeviceSelectChange(selected: string) {
    const device = this.availableDevices.find(x => x.deviceId === selected);
    this.currentDevice = device || null;
  }
  onHasPermission(hasPermission: boolean) {
    this.hasPermission = hasPermission;
  }

  onTorchCompatible(isCompatible: boolean): void {
    this.torchAvailable$.next(isCompatible || false);
  }

  toggleTorch(): void {
    this.torchEnabled = !this.torchEnabled;
  }

  toggleTryHarder(): void {
    this.tryHarder = !this.tryHarder;
  }

  switchDevice() {
    const currIdx = this.availableDevices.indexOf(this.currentDevice);
    const nextDevice = this.availableDevices[(currIdx + 1) % this.availableDevices.length];
    this.currentDevice = nextDevice;
  }

}
