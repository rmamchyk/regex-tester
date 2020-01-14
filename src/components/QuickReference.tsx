import React, { Component } from 'react';
import './QuickReference.scss';
import referenceData from './quick-reference.json'; 

interface IState {
    selectedGroup: IReferenceGroup | null;
}

interface IReferenceGroup {
    name: string;
    items: IReferenceItem[];
}

interface IReferenceItem {
    name: string;
    matcher: string;
}

class QuickReference extends Component<{}, IState> {
    data: IReferenceGroup[] = referenceData;

    constructor(props: {}) {
        super(props);

        this.state = {
            selectedGroup: this.data.find(group => group.name === 'Common Tokens') || null
        }
    }

    onSelectGroup = (group: IReferenceGroup) => {
        this.setState({ selectedGroup: group })
    }

    render() {
        const { selectedGroup } = this.state;

        return (
            <div className="quick-reference">
                <h6>Quick reference</h6>
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
                                    <li className="item" key={idx}>
                                        <div className="item__title">{item.name}</div>
                                        <div className="item__matcher">{item.matcher}</div>
                                    </li>
                                ))}
                            </ul>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default QuickReference;