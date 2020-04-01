import { Component, OnInit } from '@angular/core';
import { DataCacheService } from 'src/app/services/dataCache/data-cache.service';
import { AggregateService } from 'src/app/services/aggregate/aggregate.service';
import { AggregateOption } from 'src/app/enums/aggregate-option.enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    dimension: string[];
    basicData: number[];
    deluxData: number[];
    legend: string[];

    loading = true;

    constructor(
        private _dataCacheService: DataCacheService, 
        private _aggregateService: AggregateService
    ) { }

    async ngOnInit(): Promise<void> {
        this.loading = true;

        const rawBasicData = await this._dataCacheService.basicDateData();
        const rawDeluxData = await this._dataCacheService.deluxDateData();

        const aggregateOption = AggregateOption.month;
        const aggregatedBasicData = this._aggregateService.aggregate(rawBasicData, aggregateOption);
        const aggregatedDeluxData = this._aggregateService.aggregate(rawDeluxData, aggregateOption);

        this.dimension = aggregatedBasicData.map(x => x.date.format('YYYY-MM'));
        this.basicData = aggregatedBasicData.map(x => x.count);
        this.deluxData = aggregatedDeluxData.map(x => x.count);

        this.legend = ['Basic', 'Delux'];

        this.loading = false;
    }

}
