import React, { Component } from 'react';
import classNames from 'classnames';
import ObjectUtils from '../utils/ObjectUtils';
import DomHandler from '../utils/DomHandler';
import {RowRadioButton} from './RowRadioButton';
import {RowCheckbox} from './RowCheckbox';

export class BodyCell extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editing: this.props.editing
        };

        this.onExpanderClick = this.onExpanderClick.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onEditorFocus = this.onEditorFocus.bind(this);
    }
    
    onExpanderClick(event) {
        if (this.props.onRowToggle) {
            this.props.onRowToggle({
                originalEvent: event,
                data: this.props.rowData
            });
        }
        
        event.preventDefault();
    }
    
    onKeyDown(event) {
        let el = event.target,
            tr = el.closest("tr");
        if (event.which === 13 || event.which === 9) { // enter || tab
            event.preventDefault();
            this.switchCellToViewMode(event, true);
        }
        if (event.which === 13 ) {
            tr = event.shiftKey ? tr.previousSibling :
                                  tr.nextSibling;
            if (tr) { //might be end of table
                tr.children[this.props.cellIndex].getElementsByClassName("p-cell-editor-key-helper")[0].focus()
                // if (helper.length) {
                //     helper[0].focus()
                }
            }
        if (event.which === 9){
            let tbl = el.closest("table");
            // bad logic, should just find all of that class, find the one containing self, and + / - 1 and focus.
            let cols = Array(...tbl.getElementsByClassName("p-cell-editor-key-helper")),
                i = cols.findIndex((n) => n.parentElement.contains(el));
            i = event.shiftKey ? i - 1 : i + 1;
            // if (i === cols.length || i < 0) { // if out of index range of cols
                // Gotta goto next tr..
                // tr = event.shiftKey ? tr.previousSibling :
                //                       tr.nextSibling;
                // cols = Array(...tr.getElementsByClassName("p-cell-editor-key-helper"));
                // i = i < 0 ? cols.length-1 : 0; // last or first col.
            // }
            cols[i].focus() // Open next / prev editor
        }

        if (event.which === 27) // escape
        {
            this.switchCellToViewMode(event, false);
        }
    }
    
    onClick(e) {
        if (this.props.editMode !== 'row') {
            this.editingCellClick = true;

        if (this.props.editor && !this.state.editing  && (!this.props.isDisabled || !this.props.isDisabled(this.props))) {
            this.setState({
                editing: true
            });

            if (this.props.editorValidatorEvent === 'click') {
                this.bindDocumentEditListener();
            }
            this.props.onEditorOpen && this.props.onEditorOpen(e, this.props)
        }
    }}

    onBlur(event) {
        if (this.props.editMode !== 'row' && this.state.editing && this.props.editorValidatorEvent === 'blur') {
            this.switchCellToViewMode(event, true);
        }
    }
    
    onEditorFocus(event) {
        this.onClick(event);
    }
    
    bindDocumentEditListener() {
        if (!this.documentEditListener) {
            this.documentEditListener = (event) => {
                if (!this.editingCellClick) {
                    this.switchCellToViewMode(event,true);
                }

                this.editingCellClick = false;
            };

            this.editingCellClick = false;
            
            document.addEventListener('click', this.documentEditListener);
        }
    }
    
    closeCell() {
        this.setState({
            editing: false
        });

        this.unbindDocumentEditListener();
    }

    switchCellToViewMode(event, submit) {
        if (this.props.editorValidator && submit) {
            let valid = this.props.editorValidator(this.props);
            if (valid) {
                if (this.props.onEditorSubmit) {
                    this.props.onEditorSubmit(event, this.props, this)
                }
                this.closeCell();
            } // as per previous version if not valid and another editor is open, keep invalid data editor open.
        }
        else {
            if (submit && this.props.onEditorSubmit) {
                this.props.onEditorSubmit(event,this.props, this)
            }
            else if (this.props.onEditorCancel) {
                this.props.onEditorCancel(event,this.props, this);
            }
            this.closeCell();
        }
    }
    
    unbindDocumentEditListener() {
        if (this.documentEditListener) {
            document.removeEventListener('click', this.documentEditListener);
            this.documentEditListener = null;
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.editMode === 'row' && nextProps.editing !== prevState.editing) {
            return {
                editing: nextProps.editing
            }
        }

        return null;
    }
        
    componentDidUpdate() {
        if (this.props.editMode !== 'row' && this.container && this.props.editor) {
            clearTimeout(this.tabindexTimeout);
            if (this.state.editing) {
                let focusable = DomHandler.findSingle(this.container, 'input');
                if (focusable) {
                    focusable.setAttribute('data-isCellEditing', true);
                    focusable.focus();
                }
                
                this.keyHelper && (this.keyHelper.tabIndex = -1);
            }
            else {
                this.tabindexTimeout = setTimeout(() => {
                    if (this.keyHelper) {
                        this.keyHelper.setAttribute('tabindex', 0);
                    }
                }, 50);
            }
        }
    }

    componentWillUnmount() {
        this.unbindDocumentEditListener();
    }

    render() {
        let content, header, editorKeyHelper;
        let cellClassName = classNames(this.props.bodyClassName||this.props.className, {
                                'p-selection-column': this.props.selectionMode,
                                'p-editable-column': this.props.editor,
                                'p-cell-editing': this.state.editing && this.props.editor
                            });

        if (this.props.expander) {
            let iconClassName = classNames('p-row-toggler-icon pi pi-fw p-clickable', {'pi-chevron-down': this.props.expanded, 'pi-chevron-right': !this.props.expanded});
            content = (
                <button onClick={this.onExpanderClick} className="p-row-toggler p-link">
                    <span className={iconClassName}></span>
                </button>
            );
        }
        else if (this.props.selectionMode) {
            if (this.props.selectionMode === 'single')
                content = <RowRadioButton onClick={this.props.onRadioClick} rowData={this.props.rowData} selected={this.props.selected}/>;
            else
                content = <RowCheckbox onClick={this.props.onCheckboxClick} rowData={this.props.rowData} selected={this.props.selected}/>;
        }
        else if (this.props.rowReorder) {
            let reorderIcon = classNames('p-table-reorderablerow-handle', this.props.rowReorderIcon);

            content = (
                <i className={reorderIcon}></i>
            );
        }
        else if (this.props.rowEditor) {
            if (this.state.editing) {
                content = (
                    <React.Fragment>
                        <button onClick={this.props.onRowEditSave} className="p-row-editor-save p-link">
                            <span className="p-row-editor-save-icon pi pi-fw pi-check p-clickable"></span>
                        </button>
                        <button onClick={this.props.onRowEditCancel} className="p-row-editor-cancel p-link">
                            <span className="p-row-editor-cancel-icon pi pi-fw pi-times p-clickable"></span>
                        </button>
                    </React.Fragment>
                );
            }
            else {
                content = (
                    <button onClick={this.props.onRowEditInit} className="p-row-editor-init p-link">
                        <span className="p-row-editor-init-icon pi pi-fw pi-pencil p-clickable"></span>
                    </button>
                );
            }
        }
        else {
            if (this.state.editing && this.props.editor) {
                content = this.props.editor(this.props);
            }
            else {
                if (this.props.body)
                    content = this.props.body(this.props.rowData, this.props);
                else
                    content = ObjectUtils.resolveFieldData(this.props.rowData, this.props.field);
            }
        }
        
        if (this.props.responsive) {
            header = <span className="p-column-title">{this.props.header}</span>;
        }

        /* eslint-disable */
        editorKeyHelper = this.props.editor && ( !this.props.isDisabled || !this.props.isDisabled(this.props) ) && <a tabIndex="0" ref={(el) => {this.keyHelper = el;}} className="p-cell-editor-key-helper p-hidden-accessible" onFocus={this.onEditorFocus}><span></span></a>;
        /* eslint-enable */
                       
        return (
            <td ref={(el) => {this.container = el;}} className={cellClassName} style={this.props.bodyStyle||this.props.style} onClick={this.onClick} onKeyDown={this.onKeyDown}
                rowSpan={this.props.rowSpan} onBlur={this.onBlur}>
                {header}
                {editorKeyHelper}
                {content}
            </td>
        );
    }
}
