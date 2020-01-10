import React, { Component } from 'react';
import './TextareaHighlight.scss';

interface IState {
    value: string;
    perspective: boolean;
    highlightedText: string;
}

const DEFAULT_TEXT = `This demo shows how to highlight bits of text within a textarea. Alright, that's a lie. You can't actually render markup inside a textarea. However, you can fake it by carefully positioning a div behind the textarea and adding your highlight markup there. JavaScript takes care of syncing the content and scroll position from the textarea to the div, so everything lines up nicely. Hit the toggle button to peek behind the curtain. And feel free to edit this text. All capitalized words will be highlighted.`;

class TextAreaHighlight extends Component<{}, IState> {
    private backdropRef = React.createRef<HTMLDivElement>();
    private textareaRef = React.createRef<HTMLTextAreaElement>();

    constructor(props: {}) {
        super(props);

        this.state = {
            perspective: false,
            value: DEFAULT_TEXT,
            highlightedText: this.applyHighlights(DEFAULT_TEXT)
        }
    }

    onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        this.setState({
            value: text,
            highlightedText: this.applyHighlights(text)
        });
    }

    onScroll = (event: any) => {
        const scrollTop = event.target.scrollTop;
        if (this.backdropRef.current) {
            this.backdropRef.current.scrollTop = scrollTop;
        }
    }

    applyHighlights(text: string) {
        text = text
            .replace(/\n$/g, '\n\n')
            .replace(/[A-Z].*?\b/g, '<mark>$&</mark>');
        return text;
    }

    onTogglePerspective = () => {
        this.setState(state => ({ perspective: !state.perspective}));
    }

    render() {
        const { value, highlightedText, perspective } = this.state;

        return (
            <>
                <div className={`container ${perspective ? 'perspective' : ''}`}>
                    <div className="backdrop" ref={this.backdropRef}>
                        <div
                            className="highlights"
                            dangerouslySetInnerHTML={{ __html: highlightedText }}
                        ></div>
                    </div>

                    <textarea
                        ref={this.textareaRef}
                        value={value}
                        spellCheck={false}
                        onChange={this.onChange}
                        onScroll={this.onScroll}
                    ></textarea>
                </div>
                <button onClick={this.onTogglePerspective}>Toggle Perspective</button>
            </>
        )
    }
}

export default TextAreaHighlight;