import React, { Component, Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Button, Typography } from '@material-ui/core';
import { observable } from "mobx";
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

interface FreeSoloProps { }
interface FreeSoloState {
  packages: any
}

class FreeSolo extends Component<FreeSoloProps, FreeSoloState> {
  constructor(props: any) {
    super(props);
    this.state = { packages: [] };
  }

  @observable searchString: string = '';

  onChange = async (event: any) => {
    this.searchString = event.target.value;
    if (this.searchString.length >= 3) {
      fetch("https://api.npms.io/v2/search/suggestions?q=" + this.searchString)
        .then(res => res.json())
        .then(res => this.setState({ packages: res }))
    }
  }

  componentDidMount = async () => {
    fetch("https://api.npms.io/v2/search/suggestions?q=react")
      .then(res => res.json())
      .then(res => this.setState({ packages: res }))
  }

  searchPackage = async (pack: any) => {
    fetch("https://api.npms.io/v2/package/" + pack)
      .then(res => res.json())
      .then(res => alert(JSON.stringify(res.collected.metadata)))

  }

  render() {
    if (this.state.packages.length <= 0) {
      return (<Typography>Carregando ...</Typography>)
    } else {
      return (
        <Autocomplete
          id="highlights-demo"
          style={{ width: 300 }}
          options={this.state.packages}
          getOptionLabel={(option: any) => option.package.name}
          renderInput={(params: any) => (
            <Fragment>
              <TextField
                {...params}
                label="Package search"
                margin="normal"
                variant="outlined"
                InputProps={{ ...params.InputProps, type: 'search' }}
                onSelect={(event: any) => this.searchString = event.target.value}
                onChange={this.onChange}
                autoFocus
              />
              <Button onClick={() => this.searchPackage(this.searchString)}>Buscar</Button>
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
      );
    }
  }
}

export default FreeSolo;
