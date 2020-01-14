import React, { Component } from 'react';
import './App.scss';
import TextAreaHighlight from './components/TextareaHighlight';

interface IState {
  text: string;
  regex: string;
}

class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      text: '',
      regex: ''
    }
  }

  onTextChange = (text: string) => {
    this.setState({ text })
  }

  onRegexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ regex: e.target.value });
  }

  createRegex = (regexString: string): [boolean, RegExp?] => {
    try {
      let regex: RegExp;
      if (regexString.charAt(0) === '/') {
        let parts = regexString.split('/');
        parts.shift();
        
        var flags = parts.pop();
        regexString = parts.join('/');
        console.log(regexString)
        regex = new RegExp(regexString, flags);
      } else {
        console.log(regexString)
        regex = new RegExp(regexString, 'g');
      }
      return [true, regex];
    } catch (error) {
      console.log('Regex invalid')
      return [false, undefined];
    }
  }

  render() {
    const { text, regex } = this.state;
    const [isValid, highlight] = this.createRegex(regex);

    return (
      <div className="container">
        <div className="form-group">
          <div className="label-with-error">
            <label>Test string</label>
            {!isValid && <span>The regular expression is invalid</span>}
          </div>
          <TextAreaHighlight
            value={text}
            highlight={highlight}
            onChange={this.onTextChange}
          />
        </div>
  
        <div className="form-group">
          <label>Regular expression</label>
          <input type="text" value={regex} onChange={this.onRegexChange} />
        </div>
      </div>
    );
  }
}

export default App;
