import * as React from 'react'
import styled from 'styled-components'

const
    fontColor = '#404040',
    hoverBgColor = '#3164d1b6',
    hoverFontColor = 'white',

    Element = styled.div`
        ${(props: any) => props.isFindAny && `&:hover { background-color: ${hoverBgColor} }`}
    `,

    Text = styled.p`
        color: ${fontColor};
        padding: 5px 7px;
        ${(props: any) => props.isFindAny && `&:hover { color: ${hoverFontColor} }`}
    `

const AutocompleteElement = props =>
    <Element
        isFindAny={props.isFindAny}
        onMouseDown={() => {
            if(!props.isFindAny) return
            props.changeAutocompleteValue(props.value)
            props.setIsNeverFocused(true)
            props.setChoosedValue(props.value)
        }}
    >
        <Text isFindAny={props.isFindAny}>{props.value}</Text>
    </Element>

export default AutocompleteElement