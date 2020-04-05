import { Component, OnInit } from '@angular/core';
import { DataCacheService } from 'src/app/services/dataCache/data-cache.service';
import { AggregateService } from 'src/app/services/aggregate/aggregate.service';
import { AggregateOption } from 'src/app/enums/aggregate-option.enum';
import * as moment from 'moment';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { FormControl } from '@angular/forms';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    ]
})
export class DashboardComponent implements OnInit {
    dimension: string[];

    basicData: number[];
    deluxData: number[];
    totalData: number[];

    averageBasic: number;
    averageDelux: number;
    averageTotal: number;

    legend: string[];

    aggregationSelection = [AggregateOption.Year, AggregateOption.Month, AggregateOption.Week];
    selectedAggregation = AggregateOption.Year;
    selectedDate = new FormControl(moment());
    loading = true;

    constructor(
        private _dataCacheService: DataCacheService, 
        private _aggregateService: AggregateService,
    ) { }

    async ngOnInit(): Promise<void> {
        await this._computeData();
    }

    async aggregationSelectionChanged(selectedAggregation: any): Promise<void> {
        this.selectedAggregation = AggregateOption[selectedAggregation.value];

        await this._computeData();
    }

    async dateChanged(): Promise<void> {
        await this._computeData();
    }

    private async _computeData(): Promise<void> {
        this.loading = true;

        const rawBasicData = await this._dataCacheService.basicDateData(this.selectedDate.value);
        const rawDeluxData = await this._dataCacheService.deluxDateData(this.selectedDate.value);
        const rawTotalData = await this._dataCacheService.totalDateData(this.selectedDate.value);

        const aggregatedBasicData = this._aggregateService.aggregate(rawBasicData, this.selectedAggregation);
        const aggregatedDeluxData = this._aggregateService.aggregate(rawDeluxData, this.selectedAggregation);
        const aggregatedTotalData = this._aggregateService.aggregate(rawTotalData, this.selectedAggregation);

        const dateFormat = this._getAggregationDateFormat(this.selectedAggregation);
        this.dimension = aggregatedBasicData.map(x => x.date.format(dateFormat));
        this.basicData = aggregatedBasicData.map(x => x.count);
        this.deluxData = aggregatedDeluxData.map(x => x.count);
        this.totalData = aggregatedTotalData.map(x => x.count);

        this.averageBasic = this._aggregateService.average(aggregatedBasicData);
        this.averageDelux = this._aggregateService.average(aggregatedDeluxData);
        this.averageTotal = this._aggregateService.average(aggregatedTotalData);

        this.legend = ['Basic', 'Delux', 'Total'];

        this.loading = false;
    }

    private _getAggregationDateFormat(aggregationOption: AggregateOption): string {
        switch(aggregationOption) {
            case AggregateOption.Year:
                return 'YYYY';
            case AggregateOption.Month:
                return 'YYYY-MM'
            case AggregateOption.Week:
                return 'YYYY-MM-DD';
        }
    }

}
