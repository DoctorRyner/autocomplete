import { combineReducers } from 'redux'
import { Map, List, fromJS } from 'immutable' // Беблиотека с персистентными структурами

// autocompleteInit :: Map
const autocompleteInit = Map({
    reducer: 'autocomplete',
    value: '',
    data: List([]),
    shouldBeDisplayed: false,
    isFocused: false,
    isNeverFocused: true,
    choosedValue: '',
    tmpValue: ''
})

// autocomplete :: Map -> {} -> Map
const autocomplete = (state: Map<any, any> = autocompleteInit, action) =>
      action.type == 'CHANGE_AUTOCOMPLETE_VALUE' ? state.set('value', action.payload)
    : action.type == 'SET_AUTOCOMPLETE_DATA' ? state.set('data', fromJS(action.payload))
    : action.type == 'SET_SHOULD_BE_DISPLAYED' ? state.set('shouldBeDisplayed', action.payload)
    : action.type == 'SET_IS_FOCUSED' ? state.set('isFocused', action.payload)
    : action.type == 'SET_IS_NEVER_FOCUSED' ? state.set('isNeverFocused', action.payload)
    : action.type == 'SET_CHOOSED_VALUE' ? state.set('choosedValue', action.payload)
    : action.type == 'SET_TMP_VALUE' ? state.set('tmpValue', action.payload)
    : state

export default combineReducers({ autocomplete })



