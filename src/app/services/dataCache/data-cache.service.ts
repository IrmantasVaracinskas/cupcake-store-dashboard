import { Injectable } from '@angular/core';
import { FileService } from '../file/file.service';
import { DateData } from '../../models/date-data';
import * as moment from 'moment'

@Injectable({
  providedIn: 'root'
})
export class DataCacheService {
    private _basicDateDate: DateData[];
    private _deluxDateData: DateData[];

    async basicDateData(): Promise<DateData[]> {
        if (!this._basicDateDate) {
            this._basicDateDate = await this._initData('Basic.txt');
            this._basicDateDate.reverse();
        }

        return this._basicDateDate
    }

    async deluxDateData(): Promise<DateData[]> {
        if (!this._deluxDateData) {
            this._deluxDateData = await this._initData('Delux.txt');
            this._deluxDateData.reverse();
        }

        return this._deluxDateData;
    }

    constructor(private _fileService: FileService) { }

    private async _initData(sourceFile: string): Promise<DateData[]> {
        const sourceData = await this._fileService.readFile(sourceFile);
        const rawData = sourceData.split('\n');
        rawData.splice(0, 1);

        rawData.reverse();

        const temp: DateData[] = [];
        for(let i = 0; i < rawData.length; i++) {{
            temp.push({date: moment().add(i * -1, 'days'), count: Number(rawData[i])})
        }}

        return temp;
    }
}
