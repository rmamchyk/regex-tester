import React, { Component } from 'react';
import './QuickReference.scss';
import referenceData from './quick-reference.json';
import MaterialIcon from 'material-icons-react';
import {
    Tails, Database, Flag, Asterisk, Cut,
    Radio, Anchor, Star, Meta
} from '../images';
import { createRegex } from '../utils/regexHelper';

// add 'All Tokens' group
referenceData.unshift({
    name: 'All Tokens',
    icon: 'database',
    items: referenceData.filter(group => group.name !== 'Common Tokens').flatMap(group => group.items)
})

interface IState {
    selectedGroup: IReferenceGroup | null;
    selectedItem: IReferenceItem | null;
    searchTerm: string;
    searchResults: IReferenceGroup[];
}

interface IReferenceGroup {
    name: string;
    icon: string;
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
            selectedItem: null,
            searchTerm: '',
            searchResults: []
        }
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

    renderGroupIcon(icon: string) {
        switch (icon) {
            case 'database': return <Database className="group__icon" />
            case 'tails': return <Tails className="group__icon" />
            case 'flag': return <Flag className="group__icon" />
            case 'asterisk': return <Asterisk className="group__icon" />
            case 'cut': return <Cut className="group__icon" />
            case 'radio': return <Radio className="group__icon" />
            case 'anchor': return <Anchor className="group__icon bigger" />
            case 'star': return <Star className="group__icon bigger" />
            case 'meta': return <Meta className="group__icon" />
            default: return <Tails className="group__icon" />
        }
    }

    private applyHighlights(text: string, regexString: string) {
        const [isValid, regex] = createRegex(regexString);
        if (isValid && regex) {
            return text
                .replace(/\n$/g, '\n\n')
                .replace(regex!, '<mark>$&</mark>');
        }
        return text;
    }

    onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        const searchResults: IReferenceGroup[] = [];
        if (term) {
            const searchItems = this.data.filter(group => group.name !== 'All Tokens')
                .flatMap(group => group.items.filter(item => 
                    item.name.toLowerCase().includes(term) || item.matcher.toLowerCase().includes(term)));
            
            if (searchItems.length) {
                searchResults.push({
                    name: 'Full Search Result',
                    icon: 'database',
                    items: searchItems
                });
                this.data.forEach(group => {
                    if (group.name !== 'All Tokens' && group.items.find(item => 
                        item.name.toLowerCase().includes(term) || item.matcher.toLowerCase().includes(term))) {
                            searchResults.push({
                                ...group,
                                items: group.items.filter(item => 
                                    item.name.toLowerCase().includes(term) || item.matcher.toLowerCase().includes(term))
                            })
                    }
                })
            }
        }

        this.setState({
            searchTerm: e.target.value,
            searchResults,
            selectedGroup: term ?
                searchResults[0] || null :
                this.data.find(group => group.name === 'Common Tokens') || null
        });
    }

    render() {
        const { selectedGroup, selectedItem, searchTerm, searchResults } = this.state;

        return (
            <div className="quick-reference">
                {selectedItem && 
                    <>
                        <div className="header">
                            <h6>{selectedItem.name}</h6>
                            <MaterialIcon icon="close" onClick={this.onCloseItem} />
                        </div>
                        <div className="main">
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
                        <div className="main">
                            <div className="main__inner">
                                <div className="sidebar">
                                    <ul className="groups">
                                        <li>
                                            <input className="search" type="text" value={searchTerm} onChange={this.onSearchChange} placeholder="Search reference"/>
                                        </li>
                                        {(searchTerm ? searchResults : this.data).map((group, idx) => (
                                            <li className={`group ${group === selectedGroup ? 'selected' : ''}`} key={idx} onClick={() => this.onSelectGroup(group)}>
                                                {this.renderGroupIcon(group.icon)}
                                                <div className="group__title">{group.name}</div>
                                                {group === selectedGroup && <MaterialIcon icon="check" onClick={this.onCloseItem} />}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="content">
                                    <ul className="items">
                                        {searchTerm && !searchResults.length && 
                                            <li className="no-data">No data found</li>
                                        }
                                        {selectedGroup && selectedGroup.items.map((item, idx) => (
                                            <li className="item" key={idx} onClick={() => this.onSelectItem(item)}>
                                                <div className="item__title">{item.name}</div>
                                                <div className="item__matcher">{item.matcher}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </>
                }
            </div>
        )
    }
}

export default QuickReference;