import * as React from 'react'
import styled from 'styled-components'

const
    Panel = styled.div`
        width: 100%;
        height: 60px;
        background-color: palevioletred;
    `,

    Title = styled.p`
        transform: translate(20px, 95%);
        font-size: 35px;
        color: papayawhip;
        font-weight: 900;
    `

const Header = () => <Panel>
    <Title>Autocomplite</Title>
</Panel>

export default Header