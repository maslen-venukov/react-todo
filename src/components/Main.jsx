import React, { Fragment, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Route } from 'react-router-dom';

const Main = ({ activeFolder }) => {
  const [folder, setFolder] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:3001/folders?_embed=tasks&id=${activeFolder}`)
      .then(({ data }) => data[0] && setFolder(data[0]))
      .finally(() => setLoading(false));
    setPopupOpen(false);
  }, [activeFolder]);

  useEffect(() => {
    isPopupOpen && inputRef.current.focus();
  }, [isPopupOpen])

  const onTogglePopup = () => {
    setPopupOpen(!isPopupOpen);
    setInputValue('');
  };

  const onAddTask = e => {
    e.preventDefault();
    if(inputValue.trim()) {
      axios.post('http://localhost:3001/tasks', { folderId: activeFolder, text: inputValue, completed: false }).then(({ data }) => {
        setFolder({...folder, tasks: [...folder.tasks, data]});
        setPopupOpen(false);
      });
    } else {
      alert('Введите название таска');
      setInputValue('');
      inputRef.current.focus();
    };
  };

  return (
    <main className="main">
      <h2 className="title title--tasks">Таски</h2>
      {isLoading ? 'Загрузка...' : (
        <Fragment>
          <ul className="tasks">
            <Route path="/folders/:id">
              {folder && (
                <Fragment>
                  <h3 className="tasks__title">{folder.text}</h3>
                  {folder.tasks.length > 0 ? folder.tasks.map(task => (
                    <li key={task.id} className="tasks__item">
                      <input id={task.id} type="checkbox" className="tasks__checkbox"  />
                      <label htmlFor={task.id} className="tasks__label">
                        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="10" cy="10" r="10" />
                          <path d="M14.3 7.20001L8.79999 12.7L6.29999 10.2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {task.text}
                      </label>
                    </li>
                  )) : 'Список тасков пуст😕'}
                </Fragment>
              )}
            </Route>
          </ul>
          <Route exact path="/"><span className="select-folder">Выберите папку😉</span></Route>
          <Route path="/folders"><button onClick={onTogglePopup} className="add-btn">Добавить таск</button></Route>
        </Fragment>
      )}
      {isPopupOpen && (
        <form onSubmit={onAddTask} className="popup popup--tasks">
          <input ref={inputRef} onChange={e => setInputValue(e.target.value)} value={inputValue} className="popup__input" type="text" placeholder="Название" />
          <button className="popup__add">Добавить</button>
        </form>
      )}
    </main>
  );
};

export default Main;