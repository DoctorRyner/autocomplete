import * as React from 'react'
import styled, { keyframes } from 'styled-components' // Стилизация компонентов
import axios from 'axios' // Средство для AJAX запросов
import { Maybe } from 'monet' // Функциональная библиотека для монад
import { map, compose, take, filter } from 'ramda' // Общенаправленная функциональная библиотека

import Completion from './Completion' // Компонент отвечающий за панель автодополнения

const
    focusedColor = '#005ff7ad', // Цвет рамки при фокусировке
    fontColor = '#404040', // Цвет шрифта
    errorColor = '#d30000', // Цвет рамки при расфокусировке при ошибке
    errorBorderColor = '#7777777e', // Цвет рамки для окна ошибки

    Wrapper = styled.div`margin: 10px 20px;`, // Стиль обертки над компонентом автодополнения

    // Стиль для области ввода текста
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

    // Анимация появления окна ошибки
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

    // Стиль для окна ошибки
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

// Функция для обработки изменения текста
// changeHandle :: Event -> Function -> Function -> Function -> Function -> String -> Function
const changeHandle = e =>
(changeAutocompleteValue: Function) =>
(setShouldBeDisplayed: Function) =>
(setAutocompleteData: Function) =>
(setChoosedValue: Function) =>
(choosedValue: string) =>
(setTmpValue: Function) => {
    changeAutocompleteValue(e.currentTarget.value) // Заносим изменения в store
    // Отображаем окно автодополнения, если поле ввода не пустое
    setShouldBeDisplayed(e.currentTarget.value != '' ? true : false)
    // Отчищам переменную в store, которая отвечает за верификацию значений при расфокусе
    choosedValue != '' && setChoosedValue('')
    // Переменная для хранения нового значения, которое находится в поле текста
    // newValue :: String
    const newValue = e.currentTarget.value

    // const localUrl = './json/kladr.json'
    // Переменная для хранения адреса json файла с городами
    // webUrl :: String
    const webUrl = 'https://raw.githubusercontent.com/DoctorRyner/autocomplete/master/src/json/kladr.json'

    // Производим запрос к серверу где лежит наш фаил
    axios(webUrl)
        .then((jsonFile: any) => {
            // Запоминаем в store данные из json файла
            setAutocompleteData(jsonFile.data)
            // Обработанный массив для валидации
            // cities :: []
            const cities: any = compose ( // Используем функциональную композицию, ВНИМАНИЕ, порядок снизу вверх
                // Копируем все отфильтрованные элементы в нашу константу
                map((el: any) => el),
                // Берем первые 20 элементов из списка
                take(20),
                // Фильтруем на совпадение с введеной строкой в поле текста
                filter((el: any) => el.City.toLowerCase().startsWith(newValue.toLowerCase()))
            ) (jsonFile.data)
            // Используем катоморфизм и в завимисости от наличия cities[0] делаем действия
            Maybe.fromNull(cities[0]).cata(
                () => setTmpValue(''), // Обнуляем переменную для валидации из store в случае null, иначе
                (el): any => setTmpValue(el.City) // Устанавливаем переменную для валидации как 1 город из списка
            )
        })
        .catch(error => console.log(error)) // Выводим в консоль ошибку в случае невозможности получить фаил
}

// Компонент для рендеринга нашей панель автодополнения
// Autocomplete :: {} -> JSX
const Autocomplete = props => <Wrapper>
    <p>Город</p> {/* Заголовок для нашей панели автодополнения */}

    {/* Поле ввода текста */}
    <TextField
        type="text"
        placeholder="Начните вводить имя города" // Указываем подсказку
        value={props.value} // Устанавливаем значение из store
        isFocused={props.isFocused} // Переменная из store для определения находится ли фокус на элементе
        isNeverFocused={props.isNeverFocused} // Переменная для валидации
        choosedValue={props.choosedValue} // Переменная для валидации
        onChange={ // Запуск функции при изменении значения в поле ввода текста
            e => changeHandle
                (e)
                (props.changeAutocompleteValue)
                (props.setShouldBeDisplayed)
                (props.setAutocompleteData)
                (props.setChoosedValue)
                (props.choosedValue)
                (props.setTmpValue)
        }
        onFocus={e => { // Запуск функции при фокусировке на поле ввода
            props.setIsFocused(true)
            props.value != '' && props.setShouldBeDisplayed(true) // Отображаем список автодополнения
            props.isNeverFocused && props.setIsNeverFocused(false)
            e.target.select() // Выделяем весь текст при фокусировке
        }}
        onBlur={() => { // Запуск функции при потере фокуса на поле ввода
            props.setIsFocused(false)
            props.shouldBeDisplayed && props.setShouldBeDisplayed(false) // Скрываем список автодополнения
            // Проверяем соответствует ли введеное значение, элементу из списка, если да, то выбираем
            // Иначе показываем ошибку и просим выбрать город из списка
            props.tmpValue.toLowerCase() == props.value.toLowerCase() &&
                (props.setChoosedValue(props.tmpValue), props.changeAutocompleteValue(props.tmpValue))
        }}
    />
    {props.shouldBeDisplayed &&
        // Если панель должна быть отображена, то отображаем ее
        <Completion
            data={props.data} // Передаем данные из json файла
            value={props.value} // Передаем текст из поля ввода
            tmpValue={props.tmpValue} // Передаем первый элемент из поля ввода

            // Передаем функцию для изменения значения в поле ввода
            changeAutocompleteValue={props.changeAutocompleteValue}
            setIsNeverFocused={props.setIsNeverFocused} // Передаем функцию для помощи в валидации
            setChoosedValue={props.setChoosedValue} // Передаем функцию для помощи в валидации
            setTmpValue={props.setTmpValue} // Передаем функцию для помощи в валидации
        />}
    {/* Выводим сообщение об ошибке, если условия сходятся */}
    {!props.isFocused && !props.isNeverFocused && props.choosedValue == '' && <ErrorMessage>
        <p>⬆︎ Выберите значение из списка</p>
    </ErrorMessage>}
</Wrapper>

export default Autocomplete