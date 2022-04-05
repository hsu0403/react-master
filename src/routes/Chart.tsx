import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import styled from "styled-components";
import { useState } from "react";

const SelectType = styled.select`
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04);
  &:focus {
    border-color: #aaa;
    box-shadow: 0 0 1px 2px ${(props) => props.theme.accentColor};
    outline: none;
  }
`;
const Option = styled.option``;
const ChartContainer = styled.div``;
const LineChart = styled.div<{ isActive: boolean }>`
  display: ${(props) => (props.isActive ? "block" : "none")};
`;
const CandleChart = styled.div<{ isActive: boolean }>`
  display: ${(props) => (props.isActive ? "block" : "none")};
`;
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

function Chart({ coinId }: IChartProps) {
  const { isLoading, data } = useQuery<IHistorical[]>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 10000,
    }
  );
  const [type, setType] = useState("");
  const Options = [
    { key: 1, value: "line" },
    { key: 2, value: "candlestick" },
  ];
  const onChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setType(event.currentTarget.value);
  };
  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <>
          <form>
            <SelectType onChange={onChange} name="select">
              <Option value="select">===select===</Option>
              <optgroup label="Chart Type">
                {Options.map((type) => (
                  <Option key={type.key} value={type.value}>
                    {type.value}
                  </Option>
                ))}
              </optgroup>
            </SelectType>
          </form>
          <ChartContainer>
            <CandleChart isActive={type === "candlestick"}>
              <ApexChart
                type="candlestick"
                series={[
                  {
                    data:
                      data?.map((price) => {
                        return {
                          x: price.time_close,
                          y: [
                            price.open.toFixed(2),
                            price.high.toFixed(2),
                            price.low.toFixed(2),
                            price.close.toFixed(2),
                          ],
                        };
                      }) ?? [],
                  },
                ]}
                options={{
                  yaxis: {
                    labels: {
                      formatter: (value) => `$${value.toFixed(2)}`,
                    },
                  },
                  xaxis: {
                    type: "datetime",
                  },
                  theme: {
                    mode: "dark",
                  },
                  chart: {
                    height: 500,
                    width: 500,
                    background: "rgba(0, 0, 0, 0.5)",
                  },
                }}
              />
            </CandleChart>
            <LineChart isActive={type === "line"}>
              <ApexChart
                type="line"
                series={[
                  {
                    name: "LowPrice",
                    data: data?.map((price) => price.low) ?? [],
                  },
                  {
                    name: "HighPrice",
                    data: data?.map((price) => price.high) ?? [],
                  },
                  {
                    name: "ClosePrice",
                    data: data?.map((price) => price.close) ?? [],
                  },
                ]}
                options={{
                  yaxis: {
                    labels: {
                      formatter: (value) => `$${value.toFixed(2)}`,
                    },
                  },
                  xaxis: {
                    type: "datetime",
                    categories: data?.map((day) => day.time_close) ?? [],
                  },
                  theme: {
                    mode: "dark",
                  },
                  chart: {
                    height: 500,
                    width: 500,
                    background: "rgba(0, 0, 0, 0.5)",
                  },
                  stroke: {
                    curve: "smooth",
                    width: 3,
                  },
                  colors: ["#FF1654", "#247BA0", "#fbff00"],
                  tooltip: {
                    y: {
                      formatter: (value) => `$${value.toFixed(2)}`,
                    },
                  },
                }}
              />
            </LineChart>
          </ChartContainer>
        </>
      )}
    </div>
  );
}

export default Chart;
