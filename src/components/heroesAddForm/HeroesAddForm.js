

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров


import { useState } from "react"
import { v4 as uuid } from "uuid"
import { useHttp } from "../../hooks/http.hook"
import { useDispatch, useSelector } from 'react-redux'

import { heroCreated } from '../../actions'

const HeroesAddForm = () => {
    const [heroName, setHeroName] = useState(''),
          [heroDesc, setHeroDesc] = useState(''),
          [heroElement, setHeroElement] = useState('')

    const { filters, filtersLoadingStatus } = useSelector(state => state.filters)
    const dispatch = useDispatch()
    const { request } = useHttp()


    const onSubmitHandler = (event) => {
        event.preventDefault()

        const newHero = {
            id: uuid(),
            name: heroName,
            description: heroDesc,
            element: heroElement
        }   


        request(`http://localhost:3001/heroes`, 'POST', JSON.stringify(newHero))
            .then(res => console.log(res, "Отправка успешна"))
            .then(dispatch(heroCreated(newHero)))
            .catch(err => console.log(err))

            
        setHeroName('')
        setHeroDesc('')
        setHeroElement('')
    }

    const renderFilters = (filters, status) => {
        if(status === 'loading') {
            return <option>Загрузка элементов</option>
        } else if (status === 'error') {
            return <option>Ошибка загрузки</option>
        }

        if(filters && filters.length > 0) {
            return filters.map(({name, label}) => {
                if(name === 'all') return

                return <option key={name} value={name}>{label}</option>
            })
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"
                    value={heroName}
                    onChange={event => setHeroName(event.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}
                    value={heroDesc}
                    onChange={event => setHeroDesc(event.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    value={heroElement}
                    onChange={event => setHeroElement(event.target.value)}>
                    <option >Я владею элементом...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;