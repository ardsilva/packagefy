import React, { Component, Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Alert from '@material-ui/lab/Alert';
import { Button } from '@material-ui/core';
import { observable } from "mobx";
import { observer } from "mobx-react"
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

interface SearchProps {
  showGraphics: any;
  mountPackage: any;
  mountSize?: any;
  mountVersions?: any;
}

interface SearchState {
  packages: any;
}

@observer
class Search extends Component<SearchProps, SearchState> {
  constructor(props: any) {
    super(props);
    this.state = { packages: [] };
  }

  @observable searchString: string = '';
  @observable showAlert: boolean = false;

  onChange = async (event: any) => {
    this.searchString = event.target.value;
    if (this.searchString.length >= 3) {
      fetch("https://api.npms.io/v2/search/suggestions?q=" + this.searchString)
        .then(res => res.json())
        .then(res => this.setState({ packages: res }))
    }
  }

  onSelect = (event: any) => {
    this.clear();
    this.searchString = event.target.value
  }

  searchPackage = async (pack: any) => {
    this.clearProps();
    fetch("/" + pack)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Something went wrong.');
      })
      .then(response => {
        this.props.mountPackage(response);
        this.props.showGraphics(true);
      })
      .catch(() => { this.showAlert = true })
  }

  clear = () => {
    this.searchString = ''
    this.clearProps();
    this.setState({ packages: [] })
    this.showAlert = false;
  }

  private clearProps() {
    this.props.showGraphics(false);
    this.props.mountPackage(null);
  }

  render() {
    return (
      <Fragment>
        {this.showAlert && <Alert severity="error">{`Package: ${this.searchString} was not found`}</Alert>}
        <Autocomplete
          clearOnBlur={false}
          id="search-packages"
          style={{ width: 300 }}
          options={this.state.packages}
          getOptionLabel={(option: any) => option.package.name}
          renderInput={(params: any) => (
            <Fragment>
              <TextField
                {...params}
                placeholder="Type a package name to search the cost of it"
                label="Package search"
                margin="normal"
                variant="outlined"
                InputProps={{ ...params.InputProps, type: 'search' }}
                onSelect={this.onSelect}
                onChange={this.onChange}
                autoFocus
              />
            </Fragment>)}
          renderOption={(option: any, { inputValue }: any) => {
            const matches = match(option.package.name, inputValue);
            const parts = parse(option.package.name, matches);
            return (
              <div>
                {parts.map((part: any, index: number) => (
                  <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                    {part.text}
                  </span>
                ))}
              </div>
            );
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <Button
            style={{ marginRight: 16 }}
            color={"primary"}
            variant={"contained"}
            disabled={this.searchString.length === 0}
            onClick={() => this.searchPackage(this.searchString)}
          >
            Search
          </Button>
          <Button
            style={{ marginLeft: 16 }}
            color={"secondary"}
            variant={"contained"}
            disabled={this.searchString.length === 0}
            onClick={() => this.clear()}
          >
            Clear
          </Button>
        </div>
      </Fragment>
    );
  }
}

export default Search;
