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
            case AggregateOption.week:
                for (let i = 0; i < rawData.length;) {
                    let weekCount = 0;
                    do {
                        weekCount += rawData[i].count;

                        i++;
                    } while(i < rawData.length && rawData[i].date.day() != 1)

                    if (i >= rawData.length) {
                        const key = this._getFirstDayOfTheWeek(rawData[rawData.length - 1].date)
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

    private _getFirstDayOfTheWeek(date: moment.Moment): moment.Moment {
        let resultDate = date;
        while (resultDate.day() != 1) {
            resultDate = resultDate.add(-1, 'day');
        }

        return resultDate;
    }
}
