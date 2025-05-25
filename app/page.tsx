'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Toast from '../components/Toast';

interface Task {
  id: string; // UUID
  user_id: string;
  title: string;
  list?: string;
  due_date?: string;
  tags?: string[];
  completed: boolean;
  created_at: string;
}

export default function Home() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);

  // Updated tasks state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Check authentication status on component mount
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

    // Set up auth state listener
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

  // Task management functions
  const handleTaskClick = (taskId: string) => {
    setSelectedTask(tasks.find(task => task.id === taskId) || null);
  };

  const handleNewTaskTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(event.target.value);
  };

  // Add task to Supabase
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

  // Delete task from Supabase
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

  // Toggle task completion status
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

     // Update task details
     const handleUpdateTask = async () => {
       if (selectedTask) {
         try {
           // Log the task being updated for debugging
           console.log('Updating task:', selectedTask);

           // Create an update object with only the fields we want to update
           const updateData = {
             title: selectedTask.title,
             list: selectedTask.list || 'Personal', // Ensure list has a default value
             completed: selectedTask.completed
           };

           // Only include due_date if it exists
           if (selectedTask.due_date) {
             updateData.due_date = selectedTask.due_date;
           }

           // Only include tags if they exist
           if (selectedTask.tags && selectedTask.tags.length > 0) {
             updateData.tags = selectedTask.tags;
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

  // Sign out function
  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Error signing out:', error.message);
        setToast({ message: 'Failed to sign out. Please try again.', type: 'error' });
      } else {
        // Redirect to login page after successful sign out
        router.push('/login');
      }
    } catch (err) {
      console.error('Exception during sign out:', err);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen font-sans">
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
              <span className="text-gray-500">»</span> Today <span className="text-gray-400 text-xs ml-1">{tasks.length}</span>
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
          <div
            className="py-2 cursor-pointer hover:bg-gray-100 rounded-md px-2 text-red-500"
            onClick={handleSignOut}
          >
            {isSigningOut ? 'Signing out...' : 'Sign out'}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Today <span className="text-gray-500">{tasks.length}</span></h1>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="New task title"
              value={newTaskTitle}
              onChange={handleNewTaskTitleChange}
              className="p-2 border rounded mr-2 bg-white"
            />
            <button
              onClick={handleAddTask}
              className="bg-white text-gray-700 p-2 rounded border shadow-sm hover:bg-gray-100"
            >
              + Add New Task
            </button>
          </div>
        </header>

        <section className="task-list">
          {tasksLoading ? (
            <div className="text-center py-4">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No tasks yet. Add your first task!</div>
          ) : (
            <ul>
              {tasks.map(task => (
                <li
                  key={task.id}
                  onClick={() => handleTaskClick(task.id)}
                  className="py-3 px-4 border-b flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center">
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

      {/* Task Details */}
      <aside className="w-96 bg-gray-50 shadow-md rounded-l-lg p-4 border-l border-gray-200">
        {selectedTask ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Task Details</h2>
              <div
                className="cursor-pointer"
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 22a10 10 0 100-20 10 10 0 000 20z" />
                    </svg>
                    <span>Mark as completed</span>
                  </div>
                )}
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
                  console.log('Changing list to:', e.target.value);
                  setSelectedTask({...selectedTask, list: e.target.value});
                }}
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="List 1">List 1</option>
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

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              <div className="flex gap-2 mt-1">
                {selectedTask.tags && selectedTask.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-200 rounded-full px-2 py-1 text-xs">
                    {tag}
                    <button
                      className="ml-1 text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        const newTags = [...(selectedTask.tags || [])];
                        newTags.splice(index, 1);
                        setSelectedTask({...selectedTask, tags: newTags});
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <button
                  className="bg-gray-200 rounded-full px-2 py-1 text-xs cursor-pointer"
                  onClick={() => {
                    const tag = prompt('Enter tag name:');
                    if (tag) {
                      setSelectedTask({
                        ...selectedTask,
                        tags: [...(selectedTask.tags || []), tag]
                      });
                    }
                  }}
                >
                  + Add Tag
                </button>
              </div>
            </div>

            <div className="flex justify-between">
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
          <p className="text-gray-500">Select a task to view details</p>
        )}
      </aside>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
