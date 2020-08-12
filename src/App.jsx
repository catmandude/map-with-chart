import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Grid, Typography } from "@material-ui/core";
import ReactMapboxGl from "react-mapbox-gl";
import DisplayArea from "./Components/DisplayArea.jsx";
import { geoData } from "./data";
import "./App.css";

const Map = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAP_TOKEN,
});

function App() {
  const [max, setMax] = useState(0);
  const [selectedDataset, setSelectedDataset] = useState(["home"]);
  const [initialDatasets, setInitialDatasets] = useState({});
  const [chartData, setChartData] = useState([]);
  const [geojson, setGeojson] = useState({});

  const getFillOpacity = (total) => {
    let opacity = 0.2;
    if (total > max) {
      setMax(total);
    }
    const totes = Number(total);
    switch (true) {
      case totes > 0 && totes < 8:
        opacity = 0.4;
        break;
      case totes >= 8 && totes < 16:
        opacity = 0.5;
        break;
      case totes >= 24 && totes < 32:
        opacity = 0.6;
        break;
      case totes >= 32:
        opacity = 0.7;
        break;
      default:
        opacity = 0.2;
    }
    return opacity;
  };

  useState(() => {
    //componentdidmount
    let initData = {
      "0": [],
      "0 to 8": [],
      "8 to 16": [],
      "16 to 24": [],
      "24 to 32": [],
      "32 and up": [],
    };
    const newFeatures = geoData.features.map((geo) => {
      const totes = Number(((geo || {}).properties || {}).total || 0);
      switch (true) {
        case totes > 0 && totes < 8:
          initData["0 to 8"].push(geo);
          break;
        case totes >= 8 && totes < 16:
          initData["8 to 16"].push(geo);
          break;
        case totes >= 16 && totes < 24:
          initData["16 to 24"].push(geo);
          break;
        case totes >= 24 && totes < 32:
          initData["24 to 32"].push(geo);
          break;
        case totes >= 32:
          initData["32 and up"].push(geo);
          break;
        default:
          initData["0"].push(geo);
      }
      return {
        ...geo,
        properties: {
          ...geo.properties,
          color: "red",
          opacity: getFillOpacity(totes),
        },
      };
    });
    setGeojson({ ...geoData, features: newFeatures });
    setInitialDatasets(initData);
    const chartData = Object.keys(initData).map((key) => {
      return {
        total: initData[key].length,
        title: key,
      };
    });
    setChartData(chartData);
  }, []);

  const selectBar = (data, index) => {
    if (initialDatasets[data.title]) {
      setSelectedDataset([...selectedDataset, data.title]);
      const newData = initialDatasets[data.title].map((geo) => {
        return {
          ...geo,
          title: ((geo || {}).properties || {}).name || "",
          total: Number(((geo || {}).properties || {}).total || 0),
        };
      });
      const newIds = newData.map((geo) => String(geo.id));
      filterGeojson(newIds);
      setChartData(newData);
    } else if (data && data.properties) {
      setSelectedDataset([...selectedDataset, data.title]);
      const properties = (data || {}).properties || {};
      let newData = [];
      newData.push({ title: "2010", total: properties["2010"] });
      newData.push({ title: "2011", total: properties["2011"] });
      newData.push({ title: "2012", total: properties["2012"] });
      newData.push({ title: "2013", total: properties["2013"] });
      newData.push({ title: "2014", total: properties["2014"] });
      setChartData(newData);
      if ((data.type = "Feature" && data.id)) {
        filterGeojson([String(data.id)]);
      }
    } else {
      console.log("do nothing");
    }
  };

  const setInitialMap = (m) => {
    m.addLayer({
      id: "deaths",
      type: "fill",
      source: {
        type: "geojson",
        data: geojson,
      },
      layout: {},
      paint: {
        "fill-color": ["get", "color"],
        "fill-opacity": ["get", "opacity"],
        "fill-outline-color": "black",
      },
    });
    m.on("click", "deaths", function (e) {
      filterGeojson([String(e.features[0].id)]);
      findSelectedGeo(e.features[0].id, e.features[0].properties.name);
    });
  };

  const findSelectedGeo = (id, name) => {
    Object.keys(initialDatasets).forEach((key) => {
      const ids = initialDatasets[key].map((geo) => geo.id);
      if (ids.includes(id)) {
        setSelectedDataset(["home", key, name]);
        const data = initialDatasets[key].find((geo) => geo.id === id);
        const properties = (data || {}).properties || {};
        let newData = [];
        newData.push({ title: "2010", total: properties["2010"] });
        newData.push({ title: "2011", total: properties["2011"] });
        newData.push({ title: "2012", total: properties["2012"] });
        newData.push({ title: "2013", total: properties["2013"] });
        newData.push({ title: "2014", total: properties["2014"] });
        setChartData(newData);
        if ((data.type = "Feature" && data.id)) {
          filterGeojson([String(data.id)]);
        }
      }
    });
  };

  const filterGeojson = (ids) => {
    const filteredFeatures = geojson.features.filter((geo) =>
      ids.includes(String(geo.id))
    );
    const newGeo = { ...geojson, features: filteredFeatures };
    App.map.getSource("deaths").setData(newGeo);
  };

  const clickBreadcrumb = (title) => {
    const indexOfBread = selectedDataset.indexOf(title) + 1;
    const newTitles = selectedDataset.filter(
      (sel, index) => index < indexOfBread
    );
    setSelectedDataset(newTitles);

    if (indexOfBread > 1) {
      const newData = initialDatasets[title].map((geo) => {
        return {
          ...geo,
          title: ((geo || {}).properties || {}).name || "",
          total: Number(((geo || {}).properties || {}).total || 0),
        };
      });
      const newIds = newData.map((geo) => String(geo.id));
      filterGeojson(newIds);
      setChartData(newData);
    } else {
      const chartData = Object.keys(initialDatasets).map((key) => {
        return {
          total: initialDatasets[key].length,
          title: key,
          id: initialDatasets[key].id,
        };
      });
      App.map.getSource("deaths").setData(geojson);
      setChartData(chartData);
    }
  };

  return (
    <div className="App">
      <Grid container>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Typography variant="h6" color="inherit">
              Kentik
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={6}>
            <Map
              style="mapbox://styles/mapbox/outdoors-v11"
              containerStyle={{
                height: "94vh",
                width: "50vw",
              }}
              onStyleLoad={(m) => {
                App.map = m;
                setInitialMap(m);
              }}
              center={[-77.050636, 38.889248]}
              zoom={[10]}
            />
          </Grid>
          <Grid
            item
            xs={6}
            style={{ backgroundColor: "black", height: "100%" }}
          >
            <DisplayArea
              chartData={chartData}
              selectedDataset={selectedDataset}
              selectBar={selectBar}
              clickBreadcrumb={clickBreadcrumb}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
