import React, { Component } from "react";
import detective from "../assets/detective.svg";
import "../css/App.css";
import Search from "./Search";
import Result from "./Result";
import { Typography, Grid, Paper } from "@material-ui/core";
import { observable } from "mobx";

interface AppProps {}

interface AppState {
  showGraphics: boolean;
  mountPackage: any;
}

class App extends Component<AppProps, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      showGraphics: false,
      mountPackage: null,
    };
  }

  @observable majorVer: any = null;
  @observable majorVer2nd: any = null;
  @observable majorVer3rd: any = null;
  @observable majorVerMinor: any = null;

  showGraphics = (toogle: any) => {
    this.setState({ showGraphics: toogle });
  };

  mountPackage = (packageMounted: any) => {
    if (packageMounted) {
      this.setState({ mountPackage: packageMounted });
      let max = packageMounted
        .map((it: any) => it.version)
        .reduce((p: any, c: any) => (p > c ? p : c));
      this.majorVer = packageMounted.find((obj: any) => {
        return obj.version === max;
      });
      this.majorVer2nd = this.getInfoByMajorityOrder(
        packageMounted,
        this.majorVer
      );
      this.majorVer3rd = this.getInfoByMajorityOrder(
        packageMounted,
        this.majorVer2nd
      );
      this.majorVerMinor = this.getInfoByMajorityOrder(
        packageMounted,
        this.majorVer3rd
      );
    } else {
      this.setState({ mountPackage: null });
      this.majorVer = "";
      this.majorVer2nd = "";
      this.majorVer3rd = "";
      this.majorVerMinor = "";
    }
  };

  getInfoByMajorityOrder = (arr: any, ver: string) => {
    let spliced = arr.splice(
      arr.indexOf((obj: any) => {
        return obj.version === ver;
      })
    );
    let max = spliced
      .map((it: any) => it.version)
      .reduce((p: any, c: any) => (p > c ? p : c));
    let major = spliced.find((obj: any) => {
      return obj.version === max;
    });
    return major;
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Typography
            variant={"h4"}
            style={{ color: "#3f51b5", marginBottom: 10 }}
          >
            {"PACKAGE ANALYZER"}
          </Typography>
          <img src={detective} className="App-logo" alt="logo" />
          <Search
            showGraphics={(e: any) => this.showGraphics(e)}
            mountPackage={(packageMounted: any) =>
              this.mountPackage(packageMounted)
            }
          />
          {this.majorVer && (
            <Paper
              elevation={3}
              style={{
                position: "relative",
                display: "flex",
                width: 300,
                backgroundColor: "#282c34",
                color: "#ffffff",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant={"body1"} color={"inherit"}>
                    {"Package Name: "}
                  </Typography>
                  <Typography variant={"body2"} color={"inherit"}>
                    {this.majorVer.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant={"body1"} color={"inherit"}>
                    {"Latest Version: "}
                  </Typography>
                  <Typography variant={"body2"} color={"inherit"}>
                    {this.majorVer.version}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant={"body1"} color={"inherit"}>
                    {"Unpacked Size: "}
                  </Typography>
                  <Typography variant={"body2"} color={"inherit"}>
                    {this.majorVer.sizes.bundle}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant={"body1"} color={"inherit"}>
                    {"Gzipped: "}
                  </Typography>
                  <Typography variant={"body2"} color={"inherit"}>
                    {this.majorVer.sizes.gzipped}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          )}
          {this.state.showGraphics && this.state.mountPackage && (
            <Result
              value1={this.majorVer}
              value2={this.majorVerMinor}
              value3={this.majorVer3rd}
              value4={this.majorVer2nd}
            />
          )}
        </header>
      </div>
    );
  }
}

export default App;
