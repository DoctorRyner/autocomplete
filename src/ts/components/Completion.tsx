import * as React from 'react'
import styled, { keyframes } from 'styled-components'
import { map, compose, take, filter } from 'ramda'

import AutocompleteElement from './AutcompleteElement'

const
    fullHeight = '350px', // Максимальная высота
    emptyHeight = '50px', // Минимальная высота

    // Анимация появления панели автодополнения
    appearAnim = keyframes`
        from { opacity: 0 }
        to { opacity: 1 }
    `,

    // Стилизация панели автодополнения
    Panel = styled.div`
        position: absolute;
        width: 277px;
        max-height: ${(props: any) => props.data.size == 0 ? emptyHeight : fullHeight};
        background-color: #ffffff;
        border-left: 2px solid #5f5f5f36;
        border-right: 2px solid #5f5f5f36;
        border-bottom: 2px solid #5f5f5f36;
        animation: ${appearAnim} 0.2s ease 1;
        overflow: scroll;
    `

// Компонент панели / списка автодополнения
// Complition :: {} -> JSX
const Complition = props => {
    // Фильтруем элементы для получения списка для отображения
    const cities: any = compose (
        map((el: any) => el),
        take(20),
        filter((el: any) => el.get('City').toLowerCase().startsWith(props.value.toLowerCase()))
    ) (props.data)
    
    // Рендерим панель автодополнения
    return <Panel width={props.width} height={props.height} data={props.data}>
        {
            // При условии что tmpValue равняется чему то, то выводим список городов
            props.tmpValue
                ? map((el: any) =>
                    <AutocompleteElement
                        key={el.get('Id')}
                        value={el.get('City')}
                        changeAutocompleteValue={props.changeAutocompleteValue}
                        setIsNeverFocused={props.setIsNeverFocused}
                        setChoosedValue={props.setChoosedValue}
                        isFindAny={true} // Переменная отвечающая за режим отображения
                    />
                ) (cities)
            // Иначе выводим надпись ненайдено
                : <AutocompleteElement
                    key={0}
                    value='Не найдено'
                    changeAutocompleteValue={props.changeAutocompleteValue}
                    setIsNeverFocused={props.setIsNeverFocused}
                    setChoosedValue={props.setChoosedValue}
                    isFindAny={false} // При false не выделяется и не реагирует на нажатия
                />
        }
    </Panel>
}

export default Complition