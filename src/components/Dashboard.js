'use client' // Required for interactivity in Next.js app folder
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Dashboard() {
  const [habits, setHabits] = useState([])
  const [newHabit, setNewHabit] = useState('')

  // 1. Fetch habits safely from Supabase on page mount
  useEffect(() => {
    async function fetchMyHabits() {
      try {
        const { data, error } = await supabase
          .from('habits')
          .select('*')
        
        if (error) {
          console.error('Error loading habits:', error)
          return
        }

        const formattedHabits = (data || []).map(habit => ({
          ...habit,
          completedToday: false 
        }))
        
        setHabits(formattedHabits)
      } catch (err) {
        console.error('Catch block error:', err)
      }
    }
    fetchMyHabits()
  }, [])

            // 2. Add a new habit safely
  async function handleAddHabit(e) {
    e.preventDefault()
    if (!newHabit.trim()) return

    // Create an immediate local preview object
    const clientSideHabit = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
      name: newHabit,
      completedToday: false
    }

    // Instantly force the screen list to show it without waiting for database roundtrips
    setHabits(prevHabits => [...prevHabits, clientSideHabit])
    const currentInputText = newHabit
    setNewHabit('')

    // Safely fire off the network log sync in the background
    const { error } = await supabase
      .from('habits')
      .insert([{ name: currentInputText }])

    if (error) {
      console.error('Background Sync Error:', error)
    }
  }


    // 3. Delete a habit safely
  async function handleDeleteHabit(habitId, habitName) {
    // 1. Instantly remove it from the screen layout so the user sees it vanish
    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId))

    // 2. Fire off the delete command to Supabase using the unique habit name as a fallback check
    const { error } = await supabase
      .from('habits')
      .delete()
      .or(`id.eq.${habitId},name.eq.${habitName}`)

    if (error) {
      console.error('Database Error deleting habit:', error)
    }
  }

  // 4. Toggle completion checkmarks locally
  function toggleComplete(habitId, currentStatus) {
    setHabits(habits.map(h => 
      h.id === habitId ? { ...h, completedToday: !currentStatus } : h
    ))
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-xl mt-12 border border-gray-100">
      <h1 className="text-2xl font-black mb-6 text-gray-800 tracking-tight">🎯 My Habit Tracker</h1>
      
      {/* Input Form */}
      <form onSubmit={handleAddHabit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Enter a new habit..."
          className="border border-gray-300 p-2.5 rounded-lg flex-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
        />
        <button type="submit" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition">
          Add
        </button>
      </form>

      {/* Habits List render layout */}
      <ul className="space-y-3">
        {habits.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">No habits added yet. Let's start tracking!</p>
        ) : (
          habits.map((habit) => (
            <li key={habit.id} className="flex items-center justify-between border border-gray-200 p-4 rounded-xl bg-gray-50 shadow-sm transition hover:shadow-md">
              <div className="flex items-center gap-3">
                {/* Delete Button */}
                <button 
                  onClick={() => handleDeleteHabit(habit.id, habit.name)}

                  className="text-gray-400 hover:text-red-500 transition text-sm p-1"
                  title="Delete habit"
                >
                  🗑️
                </button>
                <span className={`font-medium ${habit.completedToday ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {habit.name}
                </span>
              </div>
              
              <button 
                type="button"
                onClick={() => toggleComplete(habit.id, habit.completedToday)}
                className={`px-4 py-1.5 text-xs font-bold rounded-full border transition duration-200 ${
                  habit.completedToday 
                    ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200' 
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {habit.completedToday ? '✓ Done' : 'Mark Done'}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
