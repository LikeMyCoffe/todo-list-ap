'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Toast from '../components/Toast';
import { User } from '@supabase/supabase-js';

// Task interface for type safety and clarity
interface Task {
  id: string; // UUID
  user_id: string;
  title: string;
  list?: string;
  due_date?: string | null; // Allow null values
  tags?: string[];
  completed: boolean;
  created_at: string;
}

// List interface for type safety and clarity
interface List {
  id: string;
  user_id: string;
  name: string;
  color: string;
}

// Map list id to color for UI display
const listColors: Record<string, string> = {
  Personal: 'bg-red-500',
  Work: 'bg-blue-500',
  // Add other default colors here
};

export default function Home() {
  // Router and Supabase client initialization
  const router = useRouter();
  const supabase = createClientComponentClient();

  // State for user authentication and loading
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarButtonRef = useRef<HTMLLIElement>(null);

  // State for tasks and UI
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [taskFilter, setTaskFilter] = useState<'all' | 'today' | 'upcoming'>('today');

  // Compute unique lists and their task counts from tasks
  // Used for displaying list counts in the UI
  const listsWithCounts = tasks.reduce((acc, task) => {
    const listName = task.list || 'Personal';
    if (!acc[listName]) acc[listName] = 0;
    acc[listName]++;
    return acc;
  }, {} as Record<string, number>);

  // State for lists from Supabase and related UI
  const [dbLists, setDbLists] = useState<List[]>([]);
  const [newListName, setNewListName] = useState('');
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch lists from Supabase for the current user
  useEffect(() => {
    const fetchLists = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('lists')
          .select('*')
          .eq('user_id', user.id);
        if (!error && data) setDbLists(data);
      }
    };
    fetchLists();
  }, [user, supabase]);

  // Compute all unique lists (from db and tasks) for UI display
  const allLists = useMemo(() => {
    // Always include Personal as a default list
    const dbListNames = dbLists.map(l => l.name);
    const taskListNames = tasks.map(t => t.list || 'Personal');
    const uniqueNames = Array.from(new Set([...dbListNames, ...taskListNames]));
    return uniqueNames.map(name => {
      const dbList = dbLists.find(l => l.name === name);
      return dbList
        ? { id: dbList.id, name: dbList.name, color: dbList.color }
        : { id: name, name, color: listColors[name] || 'bg-yellow-500' }; // fallback for Personal
    });
  }, [dbLists, tasks]);

  // Helper to generate a random color for new lists
  function getRandomColor() {
    const colors = [
      'bg-pink-500', 'bg-purple-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-orange-500', 'bg-teal-500', 'bg-indigo-500', 'bg-rose-500', 'bg-cyan-500', 'bg-fuchsia-500', 'bg-lime-500', 'bg-amber-500', 'bg-violet-500', 'bg-emerald-500', 'bg-red-500', 'bg-sky-500', 'bg-gray-500'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Check authentication status on component mount and set up auth state listener
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);

        if (!session?.user) {
          // Redirect to login if not authenticated
          router.push('/login');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Set up auth state listener to handle sign in/out events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        if (event === 'SIGNED_OUT') {
          router.push('/login');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  // Fetch tasks from Supabase when user is authenticated
  useEffect(() => {
    const fetchTasks = async () => {
      if (user) {
        setTasksLoading(true);
        try {
          const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching tasks:', error);
          } else {
            console.log('Fetched tasks:', data);
            setTasks(data || []);
          }
        } catch (err) {
          console.error('Exception fetching tasks:', err);
        } finally {
          setTasksLoading(false);
        }
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user, supabase]);

  // Select a task for viewing/editing details
  const handleTaskClick = (taskId: string) => {
    setSelectedTask(tasks.find(task => task.id === taskId) || null);
  };

  // Update new task title as user types
  const handleNewTaskTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(event.target.value);
  };

  // Add a new task to Supabase and update local state
  const handleAddTask = async () => {
    if (newTaskTitle.trim() !== '' && user) {
      try {
        const newTask = {
          title: newTaskTitle,
          list: 'Personal', // Default list
          user_id: user.id,
          completed: false
        };

        const { data, error } = await supabase
          .from('tasks')
          .insert([newTask])
          .select();

        if (error) {
          console.error('Error adding task:', error);
          setToast({ message: 'Failed to add task. Please try again.', type: 'error' });
        } else if (data && data.length > 0) {
          console.log('Added task:', data[0]);
          setTasks([data[0], ...tasks]);
          setNewTaskTitle('');
          setToast({ message: 'Task added successfully!', type: 'success' });
        }
      } catch (err) {
        console.error('Exception adding task:', err);
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };

  // Delete the selected task from Supabase and update local state
  const handleDeleteTask = async () => {
    if (selectedTask) {
      try {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', selectedTask.id);

        if (error) {
          console.error('Error deleting task:', error);
          setToast({ message: 'Failed to delete task. Please try again.', type: 'error' });
        } else {
          setTasks(tasks.filter(task => task.id !== selectedTask.id));
          setSelectedTask(null);
          setToast({ message: 'Task deleted successfully!', type: 'success' });
        }
      } catch (err) {
        console.error('Exception deleting task:', err);
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };

  // Toggle completion status of a task and update Supabase/local state
  const handleTaskCompletion = async (taskId: string, isCompleted: boolean, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent task selection when clicking checkbox

    setCompletingTaskId(taskId); // Set the task as being completed (for loading state)

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: isCompleted })
        .eq('id', taskId);

      if (error) {
        console.error('Error updating task completion:', error);
        setToast({ message: 'Failed to update task status. Please try again.', type: 'error' });
      } else {
        // Update the task in the local state
        setTasks(tasks.map(task =>
          task.id === taskId ? { ...task, completed: isCompleted } : task
        ));

        // Update selected task if it's the one being modified
        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask({ ...selectedTask, completed: isCompleted });
        }

        setToast({
          message: isCompleted ? 'Task marked as completed!' : 'Task marked as incomplete!',
          type: 'success'
        });
      }
    } catch (err) {
      console.error('Exception updating task completion:', err);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setCompletingTaskId(null); // Clear the completing state
    }
  };

  // Update details of the selected task in Supabase and local state
  const handleUpdateTask = async () => {
    if (selectedTask) {
      try {
        // Create an update object with proper typing
        const updateData: Record<string, unknown> = {
          title: selectedTask.title,
          list: selectedTask.list || 'Personal',
          completed: selectedTask.completed
        };

        // Only include due_date if it exists
        if (selectedTask.due_date) {
          updateData.due_date = selectedTask.due_date;
        }

        const { error } = await supabase
          .from('tasks')
          .update(updateData)
          .eq('id', selectedTask.id);

        if (error) {
          console.error('Error updating task:', error);
          setToast({ message: 'Failed to update task. Please try again.', type: 'error' });
        } else {
          // Update the task in the local state
          setTasks(tasks.map(task =>
            task.id === selectedTask.id ? selectedTask : task
          ));
          setToast({ message: 'Task updated successfully!', type: 'success' });
        }
      } catch (err) {
        console.error('Exception updating task:', err);
        setToast({ message: 'An unexpected error occurred. Please try again.', type: 'error' });
      }
    }
  };

  // Group tasks by due date for calendar display
  const tasksByDate = tasks.reduce((acc, task) => {
    if (task.due_date) {
      const dateKey = new Date(task.due_date).toISOString().split('T')[0];
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(task);
    }
    return acc;
  }, {} as Record<string, Task[]>);

  // Filter tasks for main section based on search, list, and filter
  const filteredTasks: Task[] = useMemo(() => {
    return tasks.filter(task => {
      // Filter by search query (from left panel)
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      // Filter by selected list
      const dbList = dbLists.find(l => l.id === selectedList);
      const matchesList = selectedList
        ? (dbList
            ? (task.list || 'Personal') === dbList.name
            : selectedList === 'Personal' && (!task.list || task.list === 'Personal'))
        : true;
      // Filter by taskFilter (from left panel)
      if (taskFilter === 'today') {
        // Only tasks due today
        const today = new Date().toISOString().split('T')[0];
        return matchesSearch && matchesList && task.due_date && new Date(task.due_date).toISOString().split('T')[0] === today;
      } else if (taskFilter === 'upcoming') {
        // Tasks due after today
        const today = new Date().toISOString().split('T')[0];
        return matchesSearch && matchesList && task.due_date && new Date(task.due_date).toISOString().split('T')[0] > today;
      }
      return matchesSearch && matchesList;
    });
  }, [tasks, searchQuery, selectedList, taskFilter, dbLists]);

  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Add a new list to Supabase and update local state
  const handleAddList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newListName || allLists.some(l => l.name === newListName)) return;
    const color = getRandomColor();
    const { data, error } = await supabase
      .from('lists')
      .insert([{ name: newListName, user_id: user.id, color }])
      .select();
    if (!error && data && data.length > 0) {
      setDbLists([...dbLists, data[0]]);
      setNewListName('');
    } else if (error) {
      setToast({ message: 'Failed to add list: ' + error.message, type: 'error' });
    }
  };

  // Remove a list from Supabase and update local state
  const handleRemoveList = async (listId: string) => {
    if (!user) return;
    try {
      // Find the list object to get its name
      const listToDelete = dbLists.find(l => l.id === listId);
      if (!listToDelete) return;
      const listName = listToDelete.name;

      // 1. Update all tasks with this list to 'Personal' in Supabase
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ list: 'Personal' })
        .eq('user_id', user.id)
        .eq('list', listName);
      if (updateError) {
        setToast({ message: 'Failed to reassign tasks. Please try again.', type: 'error' });
        return;
      }
      // 2. Update local state for tasks
      setTasks(tasks => tasks.map(task =>
        task.list === listName ? { ...task, list: 'Personal' } : task
      ));

      // 3. Remove from Supabase
      const { error } = await supabase
        .from('lists')
        .delete()
        .eq('id', listId)
        .eq('user_id', user.id);
      if (error) {
        setToast({ message: 'Failed to delete list. Please try again.', type: 'error' });
        return;
      }
      // 4. Remove from local state
      setDbLists(dbLists.filter(l => l.id !== listId));
      // If the deleted list was selected, reset selection
      if (selectedList === listId) setSelectedList(null);
      setToast({ message: 'List deleted successfully!', type: 'success' });
    } catch (err) {
      setToast({ message: 'An unexpected error occurred. Please try again.', type: 'error' });
      console.error('Exception deleting list:', err);
    }
  };

  // Handler for search input (used in sidebar)
  const handleSearch = (query: string) => setSearchQuery(query);

  // Handler to open the calendar popup
  const handleCalendarOpen = () => setIsCalendarOpen(true);

  // Main render for the Home page, including sidebar, main content, and overlays
  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans bg-background">
      {/* Menu - hidden on mobile, collapsible on small screens */}
      <aside className="hidden md:block w-full md:w-64 bg-white shadow-md rounded-r-lg p-4 border-r border-gray-200 md:relative fixed z-40 h-full md:h-auto overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <div className="relative">
            <input
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              className="w-full p-2 border rounded pl-8 bg-gray-50"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">Tasks</h3>
          <ul>
            <li className={`py-2 cursor-pointer rounded-md px-2 flex items-center justify-between ${taskFilter === 'upcoming' ? 'bg-green-500 text-white' : 'hover:bg-gray-100'}`} onClick={() => setTaskFilter('upcoming')}>
              <span className="text-gray-500">»</span> Upcoming <span className="text-gray-400 text-xs ml-1">{tasks.filter(task => task.due_date && new Date(task.due_date).toISOString().split('T')[0] > new Date().toISOString().split('T')[0]).length}</span>
            </li>
            <li className={`py-2 cursor-pointer rounded-md px-2 flex items-center justify-between ${taskFilter === 'today' ? 'bg-green-500 text-white' : 'hover:bg-gray-100'}`} onClick={() => setTaskFilter('today')}>
              <span className="text-gray-500">»</span> Today <span className="text-gray-400 text-xs ml-1">{tasks.filter(task => task.due_date && new Date(task.due_date).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]).length}</span>
            </li>
            <li className={`py-2 cursor-pointer rounded-md px-2 flex items-center justify-between ${taskFilter === 'all' ? 'bg-green-500 text-white' : 'hover:bg-gray-100'}`} onClick={() => setTaskFilter('all')}>
              <span className="text-gray-500">»</span> All <span className="text-gray-400 text-xs ml-1">{tasks.length}</span>
            </li>
            <li
              ref={calendarButtonRef}
              className="py-2 cursor-pointer hover:bg-gray-100 rounded-md px-2"
              onClick={handleCalendarOpen}
            >
              Calendar
            </li>
          </ul>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-2">Lists</h3>
          <ul>
            {allLists.map((list) => (
              <li
                key={list.id}
                className={`py-2 cursor-pointer rounded-md px-2 flex items-center group transition-colors duration-150 ${selectedList === list.id ? 'bg-green-500 text-white' : 'hover:bg-gray-100'}`}
                onClick={() => setSelectedList(selectedList === list.id ? null : list.id)}
              >
                <span className={`w-2 h-2 rounded-full mr-2 ${list.color || 'bg-yellow-500'}`}></span>
                {list.name} <span className="text-gray-400 text-xs ml-1">{listsWithCounts[list.name] || 0}</span>
                {selectedList === list.id && (
                  <button
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={e => {
                      e.stopPropagation();
                      setShowDeleteConfirm(true);
                    }}
                    title="Delete list"
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>
          <form onSubmit={handleAddList} className="flex mt-2">
            <input
              type="text"
              placeholder="+ Add New List"
              value={newListName}
              onChange={e => setNewListName(e.target.value)}
              className="flex-1 p-1 border rounded text-xs"
            />
            <button type="submit" className="ml-2 px-2 py-1 text-xs bg-green-500 text-white rounded">Add</button>
          </form>
        </div>

        {user && (
          <button
            className="mt-6 w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded shadow hover:bg-red-600 transition-colors font-semibold"
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/login');
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
            </svg>
            Sign Out
          </button>
        )}
      </aside>

      {/* Main Content - scrollable and responsive */}
      <main className="flex-1 p-2 sm:p-4 overflow-y-auto min-h-0 bg-background">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <h1 className="text-2xl font-semibold mb-2 sm:mb-0">Today <span className="text-gray-500">{tasks.length}</span></h1>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <input
              type="text"
              placeholder="New task title"
              value={newTaskTitle}
              onChange={handleNewTaskTitleChange}
              className="p-2 border rounded bg-white flex-1 sm:flex-none text-sm"
            />
            <button
              onClick={handleAddTask}
              className="bg-white text-gray-700 p-2 rounded border shadow-sm hover:bg-gray-100 whitespace-nowrap text-sm"
            >
              + Add Task
            </button>
          </div>
        </header>

        <section className="task-list">
          {tasksLoading ? (
            <div className="text-center py-4">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No tasks yet. Add your first task!</div>
          ) : (
            <ul>
              {filteredTasks.map(task => (
                <li
                  key={task.id}
                  onClick={() => handleTaskClick(task.id)}
                  className="py-3 px-2 sm:px-4 border-b flex items-center justify-between hover:bg-gray-50 cursor-pointer text-base sm:text-lg gap-2"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="mr-2 flex-shrink-0"
                      onClick={(e) => handleTaskCompletion(task.id, !task.completed, e)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleTaskCompletion(task.id, !task.completed, e as unknown as React.MouseEvent);
                        }
                      }}
                      role="checkbox"
                      aria-checked={task.completed}
                      tabIndex={0}
                    >
                      {completingTaskId === task.id ? (
                        <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : task.completed ? (
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 22a10 10 0 100-20 10 10 0 000 20z" />
                        </svg>
                      )}
                    </div>
                    <span className={task.completed ? "line-through text-gray-500" : ""}>
                      {task.title}
                    </span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* Task Details - fixed position on mobile when a task is selected */}
      <aside className={`
        ${selectedTask ? 'fixed inset-0 z-30 bg-white p-4 md:static md:inset-auto' : 'hidden'}
        md:block md:w-96 md:bg-gray-50 md:shadow-md md:rounded-l-lg md:p-4 md:border-l md:border-gray-200
        max-h-screen overflow-y-auto transition-all duration-200
      `}>
        {/* Only task details or prompt, no search/filter here */}
        {selectedTask ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Task Details</h2>
              <div className="flex items-center">
                <div
                  className="cursor-pointer mr-2"
                  onClick={(e) => handleTaskCompletion(selectedTask.id, !selectedTask.completed, e)}
                >
                  {selectedTask.completed ? (
                    <div className="flex items-center text-green-500">
                      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-500">
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22a10 10 0 100-20 10 10 0 000 20z" />
                      </svg>
                      <span>Mark as completed</span>
                    </div>
                  )}
                </div>
                {/* Close button - only visible on mobile */}
                <button
                  className="md:hidden text-gray-500"
                  onClick={() => setSelectedTask(null)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={selectedTask.title}
                onChange={(e) => setSelectedTask({...selectedTask, title: e.target.value})}
                className="w-full p-2 border rounded bg-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">List</label>
              <select
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={selectedTask.list || 'Personal'}
                onChange={(e) => {
                  setSelectedTask({...selectedTask, list: e.target.value});
                }}
              >
                {allLists.map((list) => (
                  <option key={list.id} value={list.name}>{list.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Due date</label>
              <input
                type="date"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={selectedTask.due_date ? new Date(selectedTask.due_date).toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const newDate = e.target.value ? e.target.value : null;
                  console.log('Setting due date to:', newDate);
                  setSelectedTask({...selectedTask, due_date: newDate});
                }}
              />
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={handleDeleteTask}
                className="bg-white text-red-500 p-2 rounded border shadow-sm hover:bg-gray-100"
              >
                Delete Task
              </button>
              <button
                onClick={handleUpdateTask}
                className="bg-green-500 text-white p-2 rounded shadow-sm hover:bg-green-600"
              >
                Save changes
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 hidden md:block">Select a task to view details</p>
        )}
      </aside>

      {/* Calendar Popup - responsive */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-white rounded-lg shadow-lg p-2 sm:p-6 w-full max-w-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setIsCalendarOpen(false)}
              aria-label="Close calendar"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">Task Calendar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
              {Object.keys(tasksByDate).length === 0 ? (
                <div className="col-span-2 text-center text-gray-500">No tasks with due dates.</div>
              ) : (
                Object.entries(tasksByDate).sort(([a], [b]) => a.localeCompare(b)).map(([date, dateTasks]) => (
                  <div key={date} className="border rounded p-3 bg-gray-50">
                    <div className="font-semibold mb-2 text-green-700 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="4" rx="2" strokeWidth="2" stroke="currentColor"/><path strokeWidth="2" stroke="currentColor" d="M16 2v4M8 2v4M3 10h18"/></svg>
                      {date}
                    </div>
                    <ul className="space-y-1">
                      {dateTasks.map(task => (
                        <li key={task.id} className="flex items-center gap-2">
                          <span className={task.completed ? 'line-through text-gray-400' : ''}>{task.title}</span>
                          {task.completed && <span className="text-xs text-green-500">✓</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirmation dialog for deleting list */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p>Are you sure you want to delete this list?</p>
            <div className="flex justify-end mt-4">
              <button
                className="mr-2 px-4 py-2 bg-gray-200 rounded"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => {
                  handleRemoveList(selectedList!);
                  setShowDeleteConfirm(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

