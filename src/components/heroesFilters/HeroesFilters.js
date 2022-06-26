
// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import classNames from "classnames";

import { useHttp } from "../../hooks/http.hook";
import {filtersFetching, filtersFetched, filtersFetchingError, activeFilterChanged } from "../../actions";



const HeroesFilters = () => {

    const { request } = useHttp()
    const dispatch = useDispatch()
    const {filters, activeFilter} = useSelector(state => state.filters)

    useEffect(() => {
        dispatch(filtersFetching()) 
        request(`http://localhost:3001/filters`)
            .then(data => dispatch(filtersFetched(data)))
            .catch(() => dispatch(filtersFetchingError()))
        // eslint-disable-next-line
    }, [])

    const renderFilters = (array) => {
        if(array.lenght === 0) {
            return <h5 className='text-center mt-5'>Фильтры не найдены</h5>
        }
        return array.map(({name, label, className}) => {
            const classes = name === activeFilter 
                ? `btn ${className} active`
                :  `btn ${className}`

            const btnClass = classNames('btn', className, {
                'active': name === activeFilter
            })

            return <button 
                        key={name}
                        id={name}
                        className={classes}
                        onClick={() => dispatch(activeFilterChanged(name))}>
                            {label}
                        </button>
        })
    }

    const elements = renderFilters(filters)

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group"> 
                    {elements}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;