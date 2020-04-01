import { Component, OnInit, Input } from '@angular/core';
import { EChartOption } from 'echarts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit{
    @Input() dimension: string[];
    @Input() basicData: number[];
    @Input() deluxData: number[];
    @Input() legend: string[];

    chartOptions: EChartOption;

    async ngOnInit() {
        this.chartOptions = {
            xAxis: {
                type: 'category',
                data: this.dimension,
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: this.legend && this.legend[0],
                    data: this.basicData,
                    type: 'bar'
                },
                {
                    name: this.legend && this.legend[1],
                    data: this.deluxData,
                    type: 'bar'
                },
            ],
            dataZoom: [{
                show: true,
                start: 50,
                end: 100
            }],
            tooltip: {
                show: true,
            },
            legend: {
                show: Boolean(this.legend),
                data: this.legend,
            }
        }

        console.log(JSON.stringify(this.chartOptions));
    }
    
    onChartClick(event) {
        console.log(event);
    }
}
