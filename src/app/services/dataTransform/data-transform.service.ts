import { Injectable } from '@angular/core';
import { FileService } from '../file/file.service';
import { DataCacheService } from '../dataCache/data-cache.service';

@Injectable({
  providedIn: 'root'
})
export class DataTransformService {

  constructor(private _dataCacheService: DataCacheService) { }
}
