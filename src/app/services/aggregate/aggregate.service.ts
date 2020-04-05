import { Injectable } from '@angular/core';
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
            case AggregateOption.Month:
                for (const data of rawData) {
                    const key = data.date.format('YYYY-MM');
                    if (map[key] === undefined) {
                        map[key] = 0;
                    }
                    map[key] = map[key] + data.count;
                }
                break;
            case AggregateOption.Year:
                for (const data of rawData) {
                    const key = data.date.format('YYYY');
                    if (map[key] === undefined) {
                        map[key] = 0;
                    }
                    map[key] = map[key] + data.count;
                }
                break;
            case AggregateOption.Week:
                for (let i = 0; i < rawData.length;) {
                    let weekCount = 0;
                    do {
                        weekCount += rawData[i].count;

                        i++;
                    } while(i < rawData.length && rawData[i].date.day() != 0)

                    if (i >= rawData.length) {
                        const key = this._getFirstDayOfTheWeek(moment(rawData[rawData.length - 1].date))
                            .format('YYYY-MM-DD');
                        map[key] = weekCount;
                    } else {
                        const key = rawData[i].date.format('YYYY-MM-DD');
                        map[key] = weekCount;
                    }
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

    average(data: DateData[]): number {
        let sum = 0;
        for (const temp of data) {
            sum += temp.count;
        }

        return sum / data.length;
    }
    private _getFirstDayOfTheWeek(date: moment.Moment): moment.Moment {
        let resultDate = date;
        while (resultDate.day() != 0) {
            resultDate = resultDate.add(-1, 'day');
        }

        return resultDate;
    }
}
