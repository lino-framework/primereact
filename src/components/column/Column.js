import { Component } from 'react';
import PropTypes from 'prop-types';

export class Column extends Component {

    static defaultProps = {
        columnKey: null,
        field: null,
        sortField: null,
        header: null,
        body: null,
        loadingBody: null,
        footer: null,
        sortable: false,
        sortFunction: null,
        filter: false,
        filterMatchMode: 'startsWith',
        filterPlaceholder: null,
        filterType: 'text',
        filterMaxLength: null,
        filterElement: null,
        filterFunction: null,
        style: null,
        className: null,
        headerStyle: null,
        headerClassName: null,
        bodyStyle: null,
        bodyClassName: null,
        footerStyle: null,
        footerClassName: null,
        expander: false,
        frozen: false,
        selectionMode: null,
        colSpan: null,
        rowSpan: null,
        editor: null,
        editorValidator: null,
        editorValidatorEvent: 'click',
        onEditorSubmit: null,
        onEditorCancel: null,
        excludeGlobalFilter: false,
        rowReorder: false,
        rowReorderIcon: 'pi pi-bars',
        rowEditor: false,
        exportable: true
    }

    static propTypes = {
        columnKey: PropTypes.string,
        field: PropTypes.string,
        sortField: PropTypes.string,
        header: PropTypes.any,
        body: PropTypes.any,
        loadingBody: PropTypes.func,
        footer: PropTypes.any,
        sortable: PropTypes.any,
        sortFunction: PropTypes.func,
        filter: PropTypes.bool,
        filterMatchMode: PropTypes.string,
        filterPlaceholder: PropTypes.string,
        filterType: PropTypes.string,
        filterMaxLength: PropTypes.number,
        filterElement: PropTypes.object,
        filterFunction: PropTypes.func,
        style: PropTypes.object,
        className: PropTypes.string,
        headerStyle: PropTypes.object,
        headerClassName: PropTypes.string,
        bodyStyle: PropTypes.object,
        bodyClassName: PropTypes.string,
        footerStyle: PropTypes.object,
        footerClassName: PropTypes.string,
        expander: PropTypes.bool,
        frozen: PropTypes.bool,
        selectionMode: PropTypes.string,
        colSpan: PropTypes.number,
        rowSpan: PropTypes.number,
        editor: PropTypes.func,
        editorValidator: PropTypes.func,
        onEditorSubmit: PropTypes.func,
        onEditorCancel: PropTypes.func,
        onEditorOpen: PropTypes.func,
        editorValidatorEvent: PropTypes.string,
        excludeGlobalFilter: PropTypes.bool,
        rowReorder: PropTypes.bool,
        rowReorderIcon: PropTypes.string,
        rowEditor: PropTypes.bool,
        exportable: PropTypes.bool
    }
}