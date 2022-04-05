import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { fetchCoinHistory } from "../api";

const Table = styled.table`
  width: 440px;
  background-color: ${(props) => props.theme.textColor};
  color: ${(props) => props.theme.bgColor};
  border-collapse: separate;
  border-spacing: 0 10px;
  border-radius: 10px;
  thead {
    th {
      font-weight: 600;
    }
  }
  tbody {
    tr {
      td {
        text-align: center;
      }
    }
  }
`;
const TableRow = styled.tr``;
const TableData = styled.td``;

interface IHistorical {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

interface IChartProps {
  coinId: string;
}

function Price({ coinId }: IChartProps) {
  const { isLoading, data } = useQuery<IHistorical[]>(["price", coinId], () =>
    fetchCoinHistory(coinId)
  );

  return (
    <div>
      {isLoading ? (
        "Loading Price..."
      ) : (
        <Table>
          <thead>
            <th>일자</th>
            <th>종가</th>
            <th>시가 총액 ( :억)</th>
          </thead>
          <tbody>
            {data
              ?.slice(0)
              .reverse()
              .map((value, index) => (
                <TableRow key={index}>
                  <TableData>{value.time_close.slice(0, 10)}</TableData>
                  <TableData>{`$ ${value.close.toFixed(3)}`}</TableData>
                  <TableData>{`$ ${value.market_cap
                    .toString()
                    .slice(0, -8)}`}</TableData>
                </TableRow>
              ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default Price;
