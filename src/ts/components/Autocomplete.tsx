import * as React from 'react'
import styled from 'styled-components'

import Completion from './Completion'

const Wrapper = styled.div`
    margin: 10px 20px;
`

const focusedColor = '#005ff7ad'
const fontColor = '#404040';

const TextField = styled.input`
    margin-top: 5px;
    padding-left: 7px;
    height: 30px;
    width: 270px;
    color: ${fontColor};
    ${(props: any) => props.isFocused && `outline: 2.5px solid ${focusedColor}`}
`
const changeHandle = e => (changeAutocompleteValue: Function) => (setShouldBeDisplayed: Function) => {
    changeAutocompleteValue(e.currentTarget.value)
    setShouldBeDisplayed(e.currentTarget.value != '' ? true : false)
}

const Autocomplete = props => <Wrapper>
    <p>Город</p>
    <TextField
        type="text"
        placeholder="Начните вводить имя города"
        value={props.value}
        isFocused={props.isFocused}
        onChange={e => changeHandle(e) (props.changeAutocompleteValue) (props.setShouldBeDisplayed)}
        onFocus={() => {
            props.setIsFocused(true)
            props.value != '' && props.setShouldBeDisplayed(true)
        }}
        onBlur={() => (props.setIsFocused(false), props.shouldBeDisplayed && props.setShouldBeDisplayed(false))}
    />
    {props.shouldBeDisplayed &&
        <Completion
            width={props.width}
            height={props.height}
            data={props.data}
            value={props.value}
            changeAutocompleteValue={props.changeAutocompleteValue}
        />}
</Wrapper>

export default Autocomplete