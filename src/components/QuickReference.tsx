import React, { Component } from 'react';
import './QuickReference.scss';
import referenceData from './quick-reference.json';
import MaterialIcon from 'material-icons-react';

interface IState {
    selectedGroup: IReferenceGroup | null;
    selectedItem: IReferenceItem | null;
}

interface IReferenceGroup {
    name: string;
    items: IReferenceItem[];
}

interface IReferenceItem {
    name: string;
    matcher: string;
    description?: string;
    example?: { pattern: string; text: string; }
}

class QuickReference extends Component<{}, IState> {
    data: IReferenceGroup[] = referenceData;

    constructor(props: {}) {
        super(props);

        this.state = {
            selectedGroup: this.data.find(group => group.name === 'Common Tokens') || null,
            selectedItem: null
        }

        // add 'All Tokens' group
        this.data.unshift({
            name: 'All Tokens',
            items: this.data.filter(group => group.name !== 'Common Tokens').flatMap(group => group.items)
        })
    }

    onSelectGroup = (group: IReferenceGroup) => {
        this.setState({ selectedGroup: group });
    }

    onSelectItem = (item: IReferenceItem) => {
        this.setState({ selectedItem: item });
    }

    onCloseItem = () => {
        this.setState({ selectedItem: null });
    }

    private applyHighlights(text: string, regexString: string) {
        const regex = this.createRegex(regexString);
        if (regex) {
            return text
                .replace(/\n$/g, '\n\n')
                .replace(regex, '<mark>$&</mark>');
        }
        return text;
    }

    private createRegex = (regexString: string): RegExp | undefined => {
        if (!regexString) return;
        try {
          let regex: RegExp;
          const regexMatch = regexString.match(/^\s*\/(.*)\/([gmiyus]*)\s*$/);
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
          return;
        }
      }

    render() {
        const { selectedGroup, selectedItem } = this.state;

        return (
            <div className="quick-reference">
                {selectedItem && 
                    <>
                        <div className="header">
                            <h6>{selectedItem.name}</h6>
                            <MaterialIcon icon="close" onClick={this.onCloseItem} />
                        </div>
                        <div className="container">
                            <div className="matcher">
                                <div className="matcher__info">
                                    <div className="matcher__info--value">
                                        <span>{selectedItem.matcher}</span>
                                    </div>
                                    <div
                                        className="matcher__info--description"
                                        dangerouslySetInnerHTML={{ __html: selectedItem.description! }}
                                    >
                                    </div>
                                </div>
                                {selectedItem.example && 
                                    <div className="matcher__example">
                                        <div className="matcher__example--pattern">{selectedItem.example.pattern}</div>
                                        <div
                                            className="matcher__example--text"
                                            dangerouslySetInnerHTML={{ __html: this.applyHighlights(selectedItem.example.text, selectedItem.example.pattern) }}
                                        ></div>
                                    </div>
                                }
                            </div>
                        </div>
                    </>
                }
                {!selectedItem && 
                    <>
                        <div className="header">
                            <h6>Quick reference</h6>
                        </div>
                        <div className="container">
                            <div className="sidebar">
                                <ul className="groups">
                                    {this.data.map((group, idx) => (
                                        <li className={`group ${group === selectedGroup ? 'selected' : ''}`} key={idx} onClick={() => this.onSelectGroup(group)}>
                                            {/* <div className="group-item__icon"></div> */}
                                            <div className="group__title">{group.name}</div> 
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="content">
                                {selectedGroup &&
                                    <ul className="items">
                                        {selectedGroup.items.map((item, idx) => (
                                            <li className="item" key={idx} onClick={() => this.onSelectItem(item)}>
                                                <div className="item__title">{item.name}</div>
                                                <div className="item__matcher">{item.matcher}</div>
                                            </li>
                                        ))}
                                    </ul>
                                }
                            </div>
                        </div>
                    </>
                }

            </div>
        )
    }
}

export default QuickReference;