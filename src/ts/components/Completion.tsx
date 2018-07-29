import * as React from 'react'
import styled, { keyframes } from 'styled-components'
import { map, compose, take, filter } from 'ramda'

import AutocompleteElement from './AutcompleteElement'

const
    fullHeight = '350px',
    emptyHeight = '50px'


const appearAnim = keyframes`
    from { opacity: 0 }
    to { opacity: 1 }
`

const Panel = styled.div`
    position: absolute;
    width: 277px;
    height: ${(props: any) => props.data.size == 0 ? emptyHeight : fullHeight};
    background-color: #ffffff;
    border-left: 2px solid #5f5f5f36;
    border-right: 2px solid #5f5f5f36;
    border-bottom: 2px solid #5f5f5f36;
    animation: ${appearAnim} 0.2s ease 1;
    overflow: scroll;
`

const Complition = props => <Panel width={props.width} height={props.height} data={props.data}>
    {compose (
        map((el: any) =>
            <AutocompleteElement
                key={el.get('Id')}
                value={el.get('City')}
                changeAutocompleteValue={props.changeAutocompleteValue}
            />),
        take(20),
        filter((el: any) => el.get('City').toLowerCase().startsWith(props.value.toLowerCase()))
    ) (props.data)}
</Panel>

export default Complition