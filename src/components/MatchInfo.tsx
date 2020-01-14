import React, { Component } from 'react';
import './MatchInfo.scss'

interface IProps {
    text: string;
    regex?: RegExp;
}

interface IMatchResult {
    startIndex: number;
    endIndex: number;
    matches: string[];
}

class MatchInfo extends Component<IProps> {
    private getMatchResults(regex: RegExp, text: string): IMatchResult[] {
        const results: IMatchResult[] = [];
        let result;

        if (regex.global) {
            while((result = regex.exec(text))) {
                const matches = result.toString().split(',').filter(match => !!match);
                if (!matches.length) {
                    break;
                }
                results.push({
                    startIndex: result.index,
                    endIndex: result.index + matches[0].length,
                    matches
                });
            }
        } else {
            result = regex.exec(text);
            if (result) {
                const matches = result.toString().split(',');
                results.push({
                    startIndex: result.index,
                    endIndex: result.index + matches[0].length,
                    matches
                });
            }
        }
        return results;
    }

    render() {
        const { text, regex } = this.props;
        const missingData = !text || !regex;
        let matchResults: IMatchResult[] = [];
        if (!missingData) {
            matchResults = this.getMatchResults(regex!, text);
        }

        return (
            <div className="match-info">
                <h6>Match information</h6>
                <div className="match-items">
                    {missingData && <p className="info-message">Detailed match information will be displayed here automatically</p>}

                    {matchResults.map((matchResult, index) => (
                        <div className="match-item" key={index}>
                            <table>
                                <thead>
                                    <tr><th colSpan={3}>Match {index + 1}</th></tr>
                                </thead>
                                <tbody>
                                    {matchResult.matches.map((match, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                <span className={`match-type ${idx === 0 ? 'full' : ''}`}>{idx === 0 ? 'Full match' : `Group ${idx}`}</span>
                                            </td>
                                            <td className="index-range">
                                                {idx === 0 && `${matchResult.startIndex}-${matchResult.endIndex}`}
                                            </td>
                                            <td className="match-string">
                                                {match}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default MatchInfo;