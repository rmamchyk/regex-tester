import React, { Component } from 'react';
import './App.scss';
import TextAreaHighlight from './components/TextareaHighlight';

interface IState {
  text: string;
  regexString: string;
}

class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      text: '',
      regexString: ''
    }
  }

  onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ text: e.target.value })
  }

  onRegexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ regexString: e.target.value });
  }

  createRegex = (regexString: string): RegExp | undefined => {
    try {
      let regex: RegExp;
      const regexMatch = regexString.match(/^\s*\/(.+)\/(g?m?i?y?u?s?)\s*$/);
      if (regexMatch) {
        regexString = regexMatch[1];
        var flags = regexMatch[2];
        regex = new RegExp(regexString, flags);
      } else {
        regex = new RegExp(regexString, 'g');
      }
      return regex;
    } catch (error) {
      console.log('Regex invalid')
    }
  }

  render() {
    const { text, regexString } = this.state;
    const regex = this.createRegex(regexString);

    return (
      <div className="container">
        <div className="form-group">
          <label>Test string</label>
          <TextAreaHighlight
            value={text}
            highlight={regex}
            onChange={this.onTextChange}
          />
        </div>
  
        <div className="form-group">
          <label>Regular expression</label>
          <input type="text" value={regexString} onChange={this.onRegexChange} />
        </div>
      </div>
    );
  }
}

export default App;
