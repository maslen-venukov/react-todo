import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

const Sidebar = ({ activeFolder, setActiveFolder }) => {
  const [folders, setFolders] = useState(null);
  const [colors, setColors] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const history = useHistory();
  const inputRef = useRef();

  const getRandomColor = () => colors[Math.trunc(Math.random() * colors.length)].hex;

  useEffect(() => {
    axios.get('http://localhost:3001/folders').then(({ data }) => setFolders(data));
    axios.get('http://localhost:3001/colors').then(({ data }) => setColors(data));
    setActiveFolder(parseInt(history.location.pathname.replace('/folders/', '')));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    isPopupOpen && inputRef.current.focus();
  }, [isPopupOpen])

  const onFolderClick = id => {
    setActiveFolder(id);
    history.push('/folders/' + id);
  };

  const onResetFolder = () => {
    setActiveFolder(null);
    history.push('/');
  };

  const onTogglePopup = () => {
    setPopupOpen(!isPopupOpen);
    setInputValue('');
  };

  const onAddFolder = e => {
    e.preventDefault();
    if(inputValue.trim()) {
      axios.post('http://localhost:3001/folders', { text: inputValue }).then(({ data }) => {
        setFolders([...folders, data]);
        setInputValue('');
        setPopupOpen(false);
        setActiveFolder(data.id);
        history.push('/folders/' + data.id);
      }).catch(() => {
        alert('Что-то пошло не так');
      });
    } else {
      alert('Введите название папки');
      setInputValue('');
      inputRef.current.focus();
    };
  };

  const onRemoveFolder = id => {
    if(window.confirm('Вы действительно хотите удалить папку?')) {
      axios.delete('http://localhost:3001/folders/' + id).then(() => {
        history.push('/');
        const newFolders = folders.filter(folder => folder.id !== id);
        setFolders(newFolders);
      }).catch(() => {
        alert('Что-то пошло не так');
      });
    };
  };

  return (
    <aside className="sidebar">
      <h2 onClick={onResetFolder} className="title title--folders">Папки</h2>
      <ul className="folders">
        {folders ? (
          folders.map(folder => (
            <li key={folder.id} onClick={() => onFolderClick(folder.id)} className={classNames('folders__item', activeFolder === folder.id ? 'active' : '')}>
              {colors && <i className="folders__marker" style={{ backgroundColor: getRandomColor() }} />}
              <span className="folders__text">{folder.text}</span>
              <button onClick={() => onRemoveFolder(folder.id)} className="folders__remove" aria-label="Удалить папку" />
            </li>
          ))
        ) : 'Загрузка...'}
      </ul>
      <button onClick={onTogglePopup} className="add-btn add-btn--folders">Добавить папку</button>
      {isPopupOpen && (
        <form onSubmit={onAddFolder} className="popup">
          <input ref={inputRef} onChange={e => setInputValue(e.target.value)} value={inputValue} className="popup__input" type="text" placeholder="Название" />
          <button className="popup__add">Добавить</button>
        </form>
      )}
    </aside>
  );
};

export default Sidebar;