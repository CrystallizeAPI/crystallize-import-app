import { Action, Actions, Dispatch, State } from './types';

export const Reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'UPDATE_SELECTED_SHAPE':
            return {
                ...state,
                selectedShape: action.shape,
            };
        case 'UPDATE_SELECTED_FOLDER':
            return {
                ...state,
                selectedFolder: action.folder,
            };
        case 'UPDATE_GROUP_PRODUCTS_BY':
            return {
                ...state,
                groupProductsBy: action.groupProductsBy,
            };
        case 'UPDATE_ROWS':
            return {
                ...state,
                rows: action.rows,
            };
        case 'UPDATE_HEADERS':
            return {
                ...state,
                headers: action.headers,
            };
        case 'UPDATE_MAPPING':
            return {
                ...state,
                mapping: action.mapping,
            };
    }
};

export const mapToReducerActions = (dispatch: Dispatch): Actions => ({
    updateSelectedShape: (shape) => dispatch({ type: 'UPDATE_SELECTED_SHAPE', shape }),
    updateSelectedFolder: (folder) => dispatch({ type: 'UPDATE_SELECTED_FOLDER', folder }),
    updateGroupProductsBy: (groupProductsBy) => dispatch({ type: 'UPDATE_GROUP_PRODUCTS_BY', groupProductsBy }),
    updateRows: (rows) => dispatch({ type: 'UPDATE_ROWS', rows }),
    updateHeaders: (headers) => dispatch({ type: 'UPDATE_HEADERS', headers }),
    updateMapping: (mapping) => dispatch({ type: 'UPDATE_MAPPING', mapping }),
});
