import * as React from 'react'
import styled from 'styled-components'

const
    fontColor = '#404040',
    hoverBgColor = '#3164d1b6',
    hoverFontColor = 'white',

    Element = styled.div`&:hover { background-color: ${hoverBgColor} }`,

    Text = styled.p`
        color: ${fontColor};
        padding: 5px 7px;
        &:hover { color: ${hoverFontColor} }
    `

const AutocompleteElement = props =>
    <Element 
        onMouseDown={() => {
            if(!props.isFindAny) return
            props.changeAutocompleteValue(props.value)
            props.setIsNeverFocused(true)
            props.setChoosedValue(props.value)
        }}
    >
        <Text>{props.value}</Text>
    </Element>

export default AutocompleteElement