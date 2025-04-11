// import { useState } from "react";
import Login from "./pages/Login";
import {Routes,Route,Navigate,Outlet,useLocation,replace} from "react-router-dom"
import DashBoard from "./pages/DashBoard";
import Trash from "./pages/Trash"
import Tasks from "./pages/Tasks"
import TaskDetails from "./pages/TaskDetails";
import User from "./pages/User"
import {Toaster} from "sonner"


function Layout(){
  const user = "";

  const location = useLocation()

  return user?(
    <div className="w-full  h-screen flex flex-col  md:flex-row">
      <div className="w-1/5 h-screen bg-white sticky top-0  hidden md:block">
        {/* <SideBar/> */}
      </div>

      {/* <MobileSideBar/> */}

      <div className=" flex-1 overflow-y-auto">
        {/* <Navbar/> */}
        <div className="p-4 2xl:px-10">
          <Outlet/>
        </div>
      </div>
    </div>
  ) : ( 
    <Navigate to = "/log-in" state={{from :location }} replace />
  )
}

function App() {

  return(
    <main className='w-full min-h-screen bg-[#f3f4f6]'>
        <Routes>
          <Route element={<Layout />}>
            <Route index path='/' element={<Navigate to='/dashboard' />} />
            <Route path='/dashboard' element={<DashBoard />} />
            <Route path='/tasks' element={<Tasks />} />
            <Route path='/completed/:status?' element={<Tasks />} />
            <Route path='/in-progress/:status?' element={<Tasks />} />
            <Route path='/todo/:status?' element={<Tasks />} />
            <Route path='/trashed' element={<Trash/>} />
            <Route path='/task/:id' element={<TaskDetails />} />
            <Route path='/team' element={<User/>} />
          </Route>

          <Route path='/log-in' element={<Login />} />
        </Routes>

        <Toaster richColors/> 
      </main>

  );
}

export default App;
