import { Injectable, Output } from '@angular/core';
import { DateData } from 'src/app/models/date-data';
import { AggregateOption } from 'src/app/enums/aggregate-option.enum';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class AggregateService {

    constructor() { }

    aggregate(rawData: DateData[], option: AggregateOption): DateData[] {
        const map: {[id: string]: number} = {};

        switch(option) {
            case AggregateOption.month:
                for (const data of rawData) {
                    const key = data.date.format('YYYY-MM');
                    map[key] = map[key] ?? 0 + data.count;
                }
                break;
            case AggregateOption.year:
                for (const data of rawData) {
                    const key = data.date.format('YYYY');
                    map[key] = map[key] ?? 0 + data.count;
                }
                break;
            default:
                throw new Error("Unknown aggregate option");
        }

        const output: DateData[] = [];
        for (const key in map) {
            output.push({
                date: moment(key),
                count: map[key],
            })
        }

        return output;
    }
}
