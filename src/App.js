import { useState } from 'react';

import Sidebar from './components/Sidebar';
import Main from './components/Main';

const App = () => {
  const [activeFolder, setActiveFolder] = useState(null);

  return (
    <div className="wrapper">
      <div className="todo">
        <Sidebar activeFolder={activeFolder} setActiveFolder={setActiveFolder} />
        <Main activeFolder={activeFolder} />
      </div>
    </div>
  );
};

export default App;