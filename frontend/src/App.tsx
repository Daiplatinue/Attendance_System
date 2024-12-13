import { BrowserRouter, Routes, Route } from 'react-router-dom';


import Home from './sections/Home';
import Register from './sections/Register';
import Login from './sections/Login';


import Admin from './sections/Admin';
import Teacher from './sections/Teacher';
import Parent from './sections/Parent';


import ToDoList from './sections/ToDoList';


import AllEvents from './sections/AllEvents';
import AllEventsAdmin from './sections/AllEvents-admin';
import AllEventsTeacher from './sections/AllEvents-teacher';
import AllEventsParent from './sections/AllEvents-parent';


import ViewLeaderboard from './sections/Leaderboard';
import ViewLeaderboardAdmin from './sections/Leaderboard-admin';
import ViewLeaderboardTeacher from './sections/Leaderboard-teacher';
import ViewLeaderboardParent from './sections/Leaderboard-parent';


import Announcement from './sections/Announcement';
import AnnouncementAdmin from './sections/Announcement-admin';
import AnnouncementTeacher from './sections/Announcement-teacher';
import AnnouncementParent from './sections/Announcement-parent';


import ManageAccounts from './sections/ManageAccount';
import Logs from './sections/Logs';


import Meeting from './sections/Meeting';
import MeetingParent from './sections/Meeting-Parent';


import Introduction from './sections/Introduction';

import Schedule from './sections/Schedule';
import ViewSchedule from './sections/ViewSchedule';


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>


        <Route path='/' element={<Home />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/teacher' element={<Teacher />} />
        <Route path='/parent' element={<Parent />} />


        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        

        <Route path='/todolist' element={<ToDoList />} />


        <Route path='/allevents' element={<AllEvents />} />
        <Route path='/events-admin' element={<AllEventsAdmin />} />
        <Route path='/events-teacher' element={<AllEventsTeacher />} />
        <Route path='/events-parent' element={<AllEventsParent />} />


        <Route path='/leaderboard' element={<ViewLeaderboard />} />
        <Route path='/leaderboard-admin' element={<ViewLeaderboardAdmin />} />
        <Route path='/leaderboard-teacher' element={<ViewLeaderboardTeacher />} />
        <Route path='/leaderboard-parent' element={<ViewLeaderboardParent />} />


        <Route path='/announce' element={<Announcement />} />
        <Route path='/announce-admin' element={<AnnouncementAdmin />} />
        <Route path='/announce-teacher' element={<AnnouncementTeacher />} />
        <Route path='/announce-parent' element={<AnnouncementParent />} />


        <Route path='/manageAccounts' element={<ManageAccounts />} />
        <Route path='/logs' element={<Logs />} />


        <Route path='/meeting' element={<Meeting />} />
        <Route path='/meeting-parent' element={<MeetingParent />} />


        <Route path='/introduction' element={<Introduction />} />


        <Route path='/schedule' element={<Schedule />} />
        <Route path='/viewSchedule' element={<ViewSchedule />} />


      </Routes>
    </BrowserRouter>
  );
};


export default App;