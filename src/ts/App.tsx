import * as React from 'react'
import { render } from 'react-dom'
import { Maybe } from 'monet' // Библиотека монад
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import reducer from './reducers/main' // Главный, комбинированный редьюсер
// Библиотека для функционального программирования
import { forEachObjIndexed as forEachObj } from 'ramda'
import { Map } from 'immutable' // Библиотека с персистентными структурами
import axios from 'axios'

import Header from './components/Header'
import Autocomplete from './components/Autocomplete'

// store :: {}
const store = createStore(reducer)

// Из-за того, что мы используем immutablejs, создаем
// мануальный loger для дебагинга во время разработки
// это позволит на просмотреть все редьюсеры из стейта

// storeLog :: {} -> IO()
const storeLog = (reducers: object) => forEachObj(
    // () :: Map -> IO()
    (mappedReducer: Map<any, any>) => console.log(mappedReducer.toJS())
) (reducers)
store.subscribe(() => storeLog(store.getState()))
storeLog(store.getState()) // Выводим наш стейт при запуске приложения

// Корневой компонент
// ReduxApp :: {} -> JSX
const ReduxApp = props => <>
    <Header />
    <Autocomplete
        value={props.value}
        isFocused={props.isFocused}
        data={props.data}

        changeAutocompleteValue={props.changeAutocompleteValue}
        setShouldBeDisplayed={props.setShouldBeDisplayed}
        shouldBeDisplayed={props.shouldBeDisplayed}
        setIsFocused={props.setIsFocused}
    />
</>

// Соеденяем наш стор с корневым компонентом
// App :: ()
const App = connect(
    (state: any) => ({
        // value :: String
        value: state.autocomplete.get('value'),
        // shouldBeDisplayed :: Boolean
        shouldBeDisplayed: state.autocomplete.get('shouldBeDisplayed'),
        // isFocused :: Boolean
        isFocused: state.autocomplete.get('isFocused'),
        // data :: List
        data: state.autocomplete.get('data')
    }),
    dispatch => ({
        // changeAutocompleteValue :: String -> IO()
        changeAutocompleteValue: payload => dispatch({ type: 'CHANGE_AUTOcomplete_VALUE', payload }),
        // setShouldBeDisplayed :: Boolean -> IO()
        setShouldBeDisplayed: payload => dispatch({ type: 'SET_SHOULD_BE_DISPLAYED', payload }),
        // setIsFocused :: Boolean -> IO()
        setIsFocused: payload => dispatch({ type: 'SET_IS_FOCUSED', payload })
    })
) (ReduxApp)

axios('./json/kladr.json')
    .then((jsonFile: any) => store.dispatch({ type: 'SET_AUTOcomplete_DATA', payload: jsonFile.data }))

// Может быть рендерим приложение, если имеется div с ID app
Maybe.fromNull(document.getElementById('app')).cata(
    // () :: IO()
    () => console.error('Нет ID app'),
    // () :: HTML -> IO()
    appRoot =>
        render(
            <Provider store={store}>
                <App />
            </Provider>,
            appRoot
        )
)
