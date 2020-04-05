import { Component, Input, OnChanges } from '@angular/core';
import { EChartOption } from 'echarts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnChanges{
    @Input() dimension: string[];
    @Input() basicData: number[];
    @Input() deluxData: number[];
    @Input() totalData: number[];
    @Input() legend: string[];

    chartOptions: EChartOption;

    ngOnChanges() {
        if (!this.dimension || !this.basicData || !this.deluxData || !this.totalData || !this.legend) {
            return;
        }

        this.chartOptions = {
            xAxis: {
                type: 'category',
                data: this.dimension,
                axisLabel: {
                    rotate: 30,
                },
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: this.legend && this.legend[0],
                    data: this.basicData,
                    type: 'line'
                },
                {
                    name: this.legend && this.legend[1],
                    data: this.deluxData,
                    type: 'line'
                },
                {
                    name: this.legend && this.legend[2],
                    data: this.totalData,
                    type: 'line'
                },
            ],
            dataZoom: [{
                show: true,
                start: 50,
                end: 100,
            }],
            tooltip: {
                show: true,
            },
            legend: {
                show: Boolean(this.legend),
                data: this.legend,
            },
            grid: {
                bottom: 100,
            },
        }
    }
}
