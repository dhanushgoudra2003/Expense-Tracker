import React from 'react'
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

import { Line } from 'react-chartjs-2'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import { dateFormat } from '../../utils/dateFormat'

ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

function Chart() {
  const { incomes, expenses } = useGlobalContext()

  // Step 1: Create a set of all unique dates
  const allDatesSet = new Set([
    ...incomes.map(inc => dateFormat(inc.date)),
    ...expenses.map(exp => dateFormat(exp.date))
  ])

  // Step 2: Sort dates
  const labels = Array.from(allDatesSet).sort((a, b) => new Date(a) - new Date(b))

  // Step 3: Sum income/expense for each date
  const incomeData = labels.map(date =>
    incomes
      .filter(inc => dateFormat(inc.date) === date)
      .reduce((acc, cur) => acc + cur.amount, 0)
  )

  const expenseData = labels.map(date =>
    expenses
      .filter(exp => dateFormat(exp.date) === date)
      .reduce((acc, cur) => acc + cur.amount, 0)
  )

  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: 'green',
        borderColor: 'green',
        tension: 0.2,
        fill: false
      },
      {
        label: 'Expenses',
        data: expenseData,
        backgroundColor: 'red',
        borderColor: 'red',
        tension: 0.2,
        fill: false
      }
    ]
  }

  return (
    <ChartStyled>
      <Line data={data} />
    </ChartStyled>
  )
}

const ChartStyled = styled.div`
  background: #FCF6F9;
  border: 2px solid #FFFFFF;
  box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  border-radius: 20px;
  height: 100%;
`

export default Chart
