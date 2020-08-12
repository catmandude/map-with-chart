import React from "react";
import PropTypes from "prop-types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Grid, Paper } from "@material-ui/core";

function Chart(props) {
  const { chartData, selectBar, selectedDataset } = props;

  return (
    <Grid item xs={11} style={{ height: 300 }}>
      <Paper style={{ width: "100%", height: "100%" }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis dataKey="total" />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="total"
              name={selectedDataset.length === 1 ? "Areas in Range" : "Total Crashes"}
              fill="#E0541F"
              onClick={selectBar}
            />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Grid>
  );
}

Chart.propTypes = {
  chartData: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectBar: PropTypes.func.isRequired,
  selectedDataset: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default Chart;
