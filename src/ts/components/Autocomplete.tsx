import * as React from 'react'
import styled, { keyframes } from 'styled-components'
import axios from 'axios'

import Completion from './Completion'

const
    focusedColor = '#005ff7ad',
    fontColor = '#404040',
    errorColor = '#d30000',
    errorBorderColor = '#7777777e',

    Wrapper = styled.div`margin: 10px 20px;`,

    TextField = styled.input`
        margin-top: 5px;
        padding-left: 7px;
        height: 30px;
        width: 270px;
        color: ${fontColor};
        ${(props: any) => props.isFocused
            ? `border: 2.5px solid ${focusedColor}`
            : props.isNeverFocused || props.choosedValue != '' ? '' : `border: 2.5px solid ${errorColor}`
        }
    `,

    ErrorAppearAnim = keyframes`
        from {
            transform: translateY(-25px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    `,

    ErrorMessage = styled.div`
        position: absolute;
        margin-top: 10px;
        padding-top: 10px;
        color: ${fontColor};
        height: 30px;
        width: 250px;
        background-color: white;
        border: 1.5px solid ${errorBorderColor};
        border-radius: 6px;
        text-align: center;
        animation: ${ErrorAppearAnim} 0.2s ease 1;
    `

const changeHandle = e =>
(changeAutocompleteValue: Function) =>
(setShouldBeDisplayed: Function) =>
(setAutocompleteData: Function) =>
(setChoosedValue: Function) =>
(choosedValue: string) => {
    axios.get('./json/kladr.json')
        .then((jsonFile: any) => setAutocompleteData(jsonFile.data))
        .catch(error => console.log(error))
    changeAutocompleteValue(e.currentTarget.value)
    setShouldBeDisplayed(e.currentTarget.value != '' ? true : false)
    choosedValue != '' && setChoosedValue('')
}

const Autocomplete = props => <Wrapper>
    <p>Город</p>
    <TextField
        type="text"
        placeholder="Начните вводить имя города"
        value={props.value}
        isFocused={props.isFocused}
        isNeverFocused={props.isNeverFocused}
        choosedValue={props.choosedValue}
        onChange={
            e => changeHandle
                (e)
                (props.changeAutocompleteValue)
                (props.setShouldBeDisplayed)
                (props.setAutocompleteData)
                (props.setChoosedValue)
                (props.choosedValue)
        }
        onFocus={() => {
            props.setIsFocused(true)
            props.value != '' && props.setShouldBeDisplayed(true)
            props.isNeverFocused && props.setIsNeverFocused(false)
        }}
        onBlur={() => {
            props.setIsFocused(false)
            props.shouldBeDisplayed && props.setShouldBeDisplayed(false)
        }}
    />
    {props.shouldBeDisplayed &&
        <Completion
            width={props.width}
            height={props.height}
            data={props.data}
            value={props.value}
            changeAutocompleteValue={props.changeAutocompleteValue}
            setIsNeverFocused={props.setIsNeverFocused}
            setChoosedValue={props.setChoosedValue}
        />}
    {!props.isFocused && !props.isNeverFocused && props.choosedValue == '' && <ErrorMessage>
        <p>⬆︎ Выберите значение из списка</p>
    </ErrorMessage>}
    
</Wrapper>

export default Autocomplete