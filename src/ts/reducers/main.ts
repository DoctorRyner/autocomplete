import { combineReducers } from 'redux'
import { Map, List, fromJS } from 'immutable' // Беблиотека с персистентными структурами

// autocompleteInit :: Map
const autocompleteInit = Map({
    reducer: 'autocomplete',
    value: '',
    data: List([]),
    shouldBeDisplayed: false,
    isFocused: false,
})

// autocomplete :: Map -> {} -> Map
const autocomplete = (state: Map<any, any> = autocompleteInit, action) =>
      action.type == 'CHANGE_AUTOcomplete_VALUE' ? state.set('value', action.payload)
    : action.type == 'SET_AUTOcomplete_DATA' ? state.set('data', fromJS(action.payload))
    : action.type == 'SET_SHOULD_BE_DISPLAYED' ? state.set('shouldBeDisplayed', action.payload)
    : action.type == 'SET_IS_FOCUSED' ? state.set('isFocused', action.payload)
    : state

export default combineReducers({ autocomplete })



