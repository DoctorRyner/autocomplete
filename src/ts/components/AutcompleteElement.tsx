import * as React from 'react'
import styled from 'styled-components'

const
    fontColor = '#404040',
    hoverBgColor = '#3164d1b6',
    hoverFontColor = 'white'

const Element = styled.div`
    &:hover {
        background-color: ${hoverBgColor};
    }
`

const Text = styled.p`
    color: ${fontColor};
    padding: 5px 7px;
    &:hover {
        color: ${hoverFontColor};
    }
`

const AutocompleteElement = props => <Element onMouseDown={() => props.changeAutocompleteValue(props.value)}>
    <Text>{props.value}</Text>
</Element>

export default AutocompleteElement