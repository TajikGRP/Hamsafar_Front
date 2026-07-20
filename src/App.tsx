import { useState } from 'react'
import RoleSelect from './components/RoleSelect'
import PassengerFlow from './passenger/PassengerFlow'
import DriverFlow from './driver/DriverFlow'
import type { Role } from './data'
import './App.css'

/* App shell: role landing → passenger or driver flow */
function App() {
  const [role, setRole] = useState<Role | null>(null)

  return (
    <div className="app">
      {role === null ? (
        <RoleSelect onPick={setRole} />
      ) : role === 'passenger' ? (
        <PassengerFlow onHome={() => setRole(null)} />
      ) : (
        <DriverFlow onHome={() => setRole(null)} />
      )}
    </div>
  )
}

export default App
