import MarkdownPreviewer from './components/MarkdownPreviewer';
import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <MarkdownPreviewer />
    </div>
  );
};

export default App;