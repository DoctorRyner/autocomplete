import * as React from 'react'
import styled from 'styled-components'

const
    fontColor = '#404040', // Цвет шрифта
    hoverBgColor = '#3164d1b6', // Цвет фона при наведении мышкой
    hoverFontColor = 'white', // Цвет текста при наведении мышкой

    // Обертка над элементом
    Element = styled.div`
        ${(props: any) => props.isFindAny && `&:hover { background-color: ${hoverBgColor} }`}
    `,

    // Стилизация текста
    Text = styled.p`
        color: ${fontColor};
        padding: 5px 7px;
        ${(props: any) => props.isFindAny && `&:hover { color: ${hoverFontColor} }`}
    `

// Компонент элемента из списка автодополнения
// AutocompleteElement -> {} -> JSX
const AutocompleteElement = props =>
    <Element
        isFindAny={props.isFindAny}
        onMouseDown={() => { // При нажатии мышкой на элемент, выбираем его
            if(!props.isFindAny) return
            props.changeAutocompleteValue(props.value)
            props.setIsNeverFocused(true)
            props.setChoosedValue(props.value)
        }}
    >
        <Text isFindAny={props.isFindAny}>{props.value}</Text>
    </Element>

export default AutocompleteElement