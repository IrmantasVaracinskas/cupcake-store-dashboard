import { Injectable } from '@angular/core';
import { FileService } from '../file/file.service';
import { DateData } from '../../models/date-data';
import * as moment from 'moment'

@Injectable({
    providedIn: 'root'
})
export class DataCacheService {
    private _basicStartDate = moment();
    private _deluxStartDate = moment();
    private _totalStartDate = moment();
    private _basicDateDate: DateData[];
    private _deluxDateData: DateData[];
    private _totalDateData: DateData[];

    async basicDateData(startDate: moment.Moment): Promise<DateData[]> {
        if (!this._basicDateDate || this._basicStartDate !== startDate) {
            this._basicStartDate = startDate;
            this._basicDateDate = await this._initData('Basic.txt', this._basicStartDate);
            this._basicDateDate.reverse();
        }

        return this._basicDateDate
    }

    async deluxDateData(startDate: moment.Moment): Promise<DateData[]> {
        if (!this._deluxDateData || this._deluxStartDate !== startDate) {
            this._deluxStartDate = startDate;
            this._deluxDateData = await this._initData('Delux.txt', this._deluxStartDate);
            this._deluxDateData.reverse();
        }

        return this._deluxDateData;
    }

    async totalDateData(startDate: moment.Moment): Promise<DateData[]> {
        if (!this._totalDateData || this._totalStartDate !== startDate) {
            this._totalStartDate = startDate;
            this._totalDateData = await this._initData('Total.txt', this._totalStartDate);
            this._totalDateData.reverse();
        }

        return this._totalDateData;
    }

    constructor(private _fileService: FileService) { }

    private async _initData(sourceFile: string, startDate: moment.Moment): Promise<DateData[]> {
        const sourceData = await this._fileService.readFile(sourceFile);
        const rawData = sourceData.split('\n');
        rawData.splice(0, 1);

        rawData.reverse();

        const temp: DateData[] = [];
        for(let i = 0; i < rawData.length; i++) {{
            temp.push({date: moment(startDate).add(i * -1, 'days'), count: Number(rawData[i])})
        }}

        return temp;
    }
}
