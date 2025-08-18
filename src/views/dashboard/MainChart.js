import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

const MainChart = ({ trafficData = [] }) => {
  const chartRef = useRef(null)

  // Process traffic data for chart
  const processTrafficData = () => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const monthNames = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ]
    const currentMonth = currentDate.getMonth()

    // Generate labels from June (month 5) to current month
    const labels = []
    const startMonth = 5 // June (0-indexed)
    for (let i = startMonth; i <= currentMonth; i++) {
      labels.push(monthNames[i])
    }

    // Count visits by month
    const visitsByMonth = new Array(labels.length).fill(0)

    trafficData.forEach((visit) => {
      const visitDate = new Date(visit.createdAt || visit.date)
      const visitMonth = visitDate.getMonth()
      const visitYear = visitDate.getFullYear()

      if (visitYear === currentYear && visitMonth >= startMonth && visitMonth <= currentMonth) {
        const monthIndex = visitMonth - startMonth
        if (monthIndex >= 0 && monthIndex < visitsByMonth.length) {
          visitsByMonth[monthIndex]++
        }
      }
    })

    return { labels, visitsByMonth }
  }

  const { labels, visitsByMonth } = processTrafficData()

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (chartRef.current) {
        setTimeout(() => {
          chartRef.current.options.scales.x.grid.borderColor = getStyle(
            '--cui-border-color-translucent',
          )
          chartRef.current.options.scales.x.grid.color = getStyle('--cui-border-color-translucent')
          chartRef.current.options.scales.x.ticks.color = getStyle('--cui-body-color')
          chartRef.current.options.scales.y.grid.borderColor = getStyle(
            '--cui-border-color-translucent',
          )
          chartRef.current.options.scales.y.grid.color = getStyle('--cui-border-color-translucent')
          chartRef.current.options.scales.y.ticks.color = getStyle('--cui-body-color')
          chartRef.current.update()
        })
      }
    })
  }, [chartRef])

  return (
    <>
      <CChartLine
        ref={chartRef}
        style={{ height: '300px', marginTop: '40px' }}
        data={{
          labels,
          datasets: [
            {
              label: 'Visitas',
              backgroundColor: `rgba(${getStyle('--cui-info-rgb')}, .1)`,
              borderColor: getStyle('--cui-info'),
              pointHoverBackgroundColor: getStyle('--cui-info'),
              borderWidth: 2,
              data: visitsByMonth,
              fill: true,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              grid: {
                color: getStyle('--cui-border-color-translucent'),
                drawOnChartArea: false,
              },
              ticks: {
                color: getStyle('--cui-body-color'),
              },
            },
            y: {
              beginAtZero: true,
              border: {
                color: getStyle('--cui-border-color-translucent'),
              },
              grid: {
                color: getStyle('--cui-border-color-translucent'),
              },
              max: 250,
              ticks: {
                color: getStyle('--cui-body-color'),
                maxTicksLimit: 5,
                stepSize: Math.ceil(250 / 5),
              },
            },
          },
          elements: {
            line: {
              tension: 0.4,
            },
            point: {
              radius: 0,
              hitRadius: 10,
              hoverRadius: 4,
              hoverBorderWidth: 3,
            },
          },
        }}
      />
    </>
  )
}

MainChart.propTypes = {
  trafficData: PropTypes.array,
}

export default MainChart
