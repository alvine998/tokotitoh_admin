import dynamic from 'next/dynamic'
import React, { useState } from 'react'
// import Chart from 'react-apexcharts'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function ApexChart() {
    const [chart, setChart] = useState<any>({
        options: {
            chart: {
                id: "basic-bar"
            },
            xaxis: {
                categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
            }
        },
        series: [
            {
                name: "series-1",
                data: [30, 40, 45, 50, 49, 60, 70, 91]
            }
        ]
    })
    return (
        <div>
            <Chart
                options={chart?.options}
                series={chart?.series}
                type="bar"
                width="100%"
            />
        </div>
    )
}
