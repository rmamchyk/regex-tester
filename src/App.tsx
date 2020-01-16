import React, { Component } from 'react';
import './App.scss';
import TextAreaHighlight from './components/TextareaHighlight';
import MatchInfo from './components/MatchInfo';
import QuickReference from './components/QuickReference';
import { createRegex } from './utils/regexHelper';

interface IState {
  text: string;
  regexString: string;
  showMatchInfo: boolean;
  showQuickReference: boolean;
}

class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      text: 'This is foo and bar',
      regexString: '(foo)|bar',
      showMatchInfo: true,
      showQuickReference: false
    }
  }

  onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ text: e.target.value })
  }

  onRegexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ regexString: e.target.value });
  }

  onToggleMatchInfo = () => {
    this.setState(state => ({ showMatchInfo: !state.showMatchInfo }))
  }

  onToggleQuickReference = () => {
    this.setState(state => ({ showQuickReference: !state.showQuickReference }))
  }

  render() {
    const { text, regexString, showMatchInfo, showQuickReference } = this.state;
    const [isValid, regex] = createRegex(regexString);

    return (
      <div className="container">
        <div className="form-group">
          <label>Test string</label>
          <TextAreaHighlight
            value={text}
            placeholder="Enter your test string here"
            highlight={regex}
            onChange={this.onTextChange}
          />
        </div>
  
        <div className="form-group" style={{ marginBottom: 25 }}>
          <label>Regular expression</label>
          <input type="text" value={regexString} onChange={this.onRegexChange} placeholder="Enter your regular expression here" />
          <div className="regex-options">
            <div className="regex-options__item" onClick={this.onToggleMatchInfo}>{showMatchInfo ? 'Hide' : 'Show'} Match Information</div>
            <div className="regex-options__item" onClick={this.onToggleQuickReference}>{showQuickReference ? 'Hide' : 'Show'} Quick Reference</div>
          </div>
        </div>

        <div className="regex-more" style={{ marginBottom: 25 }}>
          {showMatchInfo &&
            <>
              <div className="regex-more__item">
                <MatchInfo text={text} regex={regex} isRegexValid={isValid} />
              </div>
              <div className="regex-more__divider"></div>
            </>
          }
          {showQuickReference &&
            <div className="regex-more__item">
              <QuickReference />
            </div>
          }
        </div>
      </div>
    );
  }
}

export default App;
