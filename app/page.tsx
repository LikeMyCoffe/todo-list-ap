'use client';

import React, { useState } from 'react';

interface Task {
  id: number;
  title: string;
  list: string;
  dueDate?: string;
  tags?: string[];
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Create a database of guest authors', list: 'Personal', dueDate: '22-03-22', tags: ['Personal'] },
    { id: 2, title: 'Renew driver\'s license', list: 'Personal', dueDate: '22-03-22', tags: ['Personal'] },
    { id: 3, title: 'Print business card', list: 'List', dueDate: '22-03-22', tags: ['List'] },
  ]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');

  const handleTaskClick = (taskId: number) => {
    setSelectedTask(tasks.find(task => task.id === taskId) || null);
  };

  const handleNewTaskTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(event.target.value);
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim() !== '') {
      const newTask: Task = {
        id: tasks.length + 1,
        title: newTaskTitle,
        list: 'Personal', // Default list
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    }
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      setTasks(tasks.filter(task => task.id !== selectedTask.id));
      setSelectedTask(null);
    }
  };

  return (
    <div className="flex min-h-screen font-sans"> {/* Removed bg-gray-50 */}
      {/* Menu */}
      <aside className="w-64 bg-white shadow-md rounded-r-lg p-4 border-r border-gray-200">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <div className="relative">
            <input type="search" placeholder="Search" className="w-full p-2 border rounded pl-8 bg-gray-50" />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">Tasks</h3>
          <ul>
            <li className="py-2 cursor-pointer hover:bg-gray-100 rounded-md px-2 flex items-center justify-between">
              <span className="text-gray-500">»</span> Upcoming <span className="text-gray-400 text-xs ml-1">12</span>
            </li>
            <li className="py-2 cursor-pointer bg-gray-100 rounded-md px-2 flex items-center justify-between">
              <span className="text-gray-500">»</span> Today <span className="text-gray-400 text-xs ml-1">5</span>
            </li>
            <li className="py-2 cursor-pointer hover:bg-gray-100 rounded-md px-2">
              Calendar
            </li>
            <li className="py-2 cursor-pointer hover:bg-gray-100 rounded-md px-2">
              Sticky Wall
            </li>
          </ul>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-2">Lists</h3>
          <ul>
            <li className="py-2 cursor-pointer hover:bg-gray-100 rounded-md px-2 flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span> Personal <span className="text-gray-400 text-xs ml-1">3</span>
            </li>
            <li className="py-2 cursor-pointer hover:bg-gray-100 rounded-md px-2 flex items-center">
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span> Work <span className="text-gray-400 text-xs ml-1">6</span>
            </li>
            <li className="py-2 cursor-pointer hover:bg-gray-100 rounded-md px-2 flex items-center">
              <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span> List 1 <span className="text-gray-400 text-xs ml-1">3</span>
            </li>
            <li className="py-2 cursor-pointer hover:bg-gray-100 rounded-md px-2">
              + Add New List
            </li>
          </ul>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-2">Tags</h3>
          <div className="flex gap-2">
            <span className="bg-gray-200 rounded-full px-2 py-1 text-xs cursor-pointer">Tag 1</span>
            <span className="bg-gray-200 rounded-full px-2 py-1 text-xs cursor-pointer">Tag 2</span>
            <span className="bg-gray-200 rounded-full px-2 py-1 text-xs cursor-pointer">+ Add Tag</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="py-2 cursor-pointer hover:bg-gray-100 rounded-md px-2">Settings</div>
          <div className="py-2 cursor-pointer hover:bg-gray-100 rounded-md px-2">Sign out</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Today <span className="text-gray-500">5</span></h1>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="New task title"
              value={newTaskTitle}
              onChange={handleNewTaskTitleChange}
              className="p-2 border rounded mr-2 bg-gray-50"
            />
            <button onClick={handleAddTask} className="bg-white text-gray-700 p-2 rounded border shadow-sm hover:bg-gray-100">
              + Add New Task
            </button>
          </div>
        </header>

        <section className="task-list">
          <ul>
            {tasks.map(task => (
              <li key={task.id} onClick={() => handleTaskClick(task.id)} className="py-3 px-4 border-b flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>{task.title}</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* Task Details */}
      <aside className="w-96 bg-gray-50 shadow-md rounded-l-lg p-4 border-l border-gray-200">
        {selectedTask ? (
          <>
            <h2 className="text-lg font-semibold mb-2">Task: {selectedTask.title}</h2>
            <p className="text-gray-600 mb-4">Description</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">List</label>
              <select className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option>Personal</option>
                <option>Work</option>
                <option>List 1</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Due date</label>
              <input type="date" className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              <div className="flex gap-2">
                <span className="bg-gray-200 rounded-full px-2 py-1 text-xs cursor-pointer">Tag 1</span>
                <span className="bg-gray-200 rounded-full px-2 py-1 text-xs cursor-pointer">+ Add Tag</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Subtasks</label>
              <div>
                + Add New Subtask
                <div>
                  <input type="checkbox" /> Subtask
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={handleDeleteTask} className="bg-white text-red-500 p-2 rounded border shadow-sm hover:bg-gray-100">
                Delete Task
              </button>
              <button className="bg-green-500 text-white p-2 rounded shadow-sm hover:bg-green-600">Save changes</button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Select a task to view details.</p>
        )}
      </aside>
    </div>
  );
}
