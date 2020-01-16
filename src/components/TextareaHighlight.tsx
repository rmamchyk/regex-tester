import React, { Component } from 'react';
import './TextareaHighlight.scss';

interface IProps {
    value: string;
    highlight?: RegExp;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

class TextAreaHighlight extends Component<IProps> {
    private backdropRef = React.createRef<HTMLDivElement>();
    private textareaRef = React.createRef<HTMLTextAreaElement>();

    onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.props.onChange(e);
    }

    onScroll = (event: any) => {
        const scrollTop = event.target.scrollTop;
        if (this.backdropRef.current) {
            this.backdropRef.current.scrollTop = scrollTop;
        }
    }

    private applyHighlights(text: string, regex: RegExp) {
        return text
            .replace(/\n$/g, '\n\n')
            .replace(regex, '<mark>$&</mark>');
    }

    render() {
        const { value, highlight, placeholder } = this.props;
        const highlightedValue = highlight ? this.applyHighlights(value, highlight) : '';

        return (
            <div className="textarea-highlight">
                <div className="container">
                    <div className="backdrop" ref={this.backdropRef}>
                        <div
                            className="highlights"
                            dangerouslySetInnerHTML={{ __html: highlightedValue }}
                        ></div>
                    </div>

                    <textarea
                        ref={this.textareaRef}
                        value={value}
                        spellCheck={false}
                        onChange={this.onChange}
                        onScroll={this.onScroll}
                        placeholder={placeholder}
                    ></textarea>
                </div>
            </div>
        )
    }
}

export default TextAreaHighlight;