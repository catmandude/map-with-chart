import React from "react";
import PropTypes from "prop-types";
import { Grid, Typography, Breadcrumbs } from "@material-ui/core";
import Chart from "./Chart.jsx";

function DisplayArea(props) {
  const { chartData, selectedDataset, selectBar, clickBreadcrumb } = props;

  return (
    <>
      <Grid container direction="row" justify="flex-start" alignItems="center">
        <Typography
          color="textPrimary"
          variant="h4"
          style={{ marginBottom: 10, marginLeft: 35, marginTop: 50 }}
        >
          Impaired car crashes
        </Typography>
      </Grid>
      <Grid container direction="row" justify="flex-start" alignItems="center">
        <Typography
          color="textPrimary"
          variant="subtitle1"
          style={{ marginBottom: 30, marginLeft: 35 }}
        >
          Washington, D.C. - by area
        </Typography>
      </Grid>
      {chartData && (
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={12} style={{ marginBottom: 30, marginLeft: 95 }}>
            <Breadcrumbs aria-label="breadcrumb">
              {selectedDataset.map((title, index) => (
                <Typography
                  color="textPrimary"
                  key={title}
                  onClick={() => clickBreadcrumb(title)}
                  style={{
                    borderBottom:
                      title !== selectedDataset[selectedDataset.length - 1] &&
                      "1px solid white",
                  }}
                >
                  {title}
                </Typography>
              ))}
            </Breadcrumbs>
          </Grid>
          <Chart
            chartData={chartData}
            selectBar={selectBar}
            selectedDataset={selectedDataset}
          />
        </Grid>
      )}
    </>
  );
}

DisplayArea.propTypes = {
  chartData: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedDataset: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectBar: PropTypes.func.isRequired,
  clickBreadcrumb: PropTypes.func.isRequired,
};

export default DisplayArea;
