import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Headers from './components/Headers';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import RouteAdmin from './components/RouteAdmin';
import Admin from './pages/SampleAdmin';
import Dasboard from './pages/SampleDashboard2';
import Onsite from './pages/Onsite'
import OnsiteData from './pages/OnsiteData'
import OnlineData from './pages/onlineData'
import ReportData from './pages/Reportdata'
import SettingData from './pages/SettingData'
import InventoryData from './pages/InventoryData'
import Charts from './components/Charts';
import Report from './pages/Report';
import Setting from './pages/Setting';
import Inventory from './pages/Inventory';
import Register from './pages/sampleRegister';
import Login from './pages/sampleLogin';
import Orders from './pages/sampleOrder';
import Forget from './pages/ForgetPass'
import Reset from './pages/ResetPassword'
import About from './components/About'
import Service from './components/Service';
import FeedBack from './components/FeedBack';

export default function App() {
  return <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/headers' element={<Headers />} />
          <Route path='/chart' element={<Charts />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/forget' element={<Forget />} />
          <Route path='/reset-password/:token' element={<Reset />} />
          <Route path='/about' element={<About />} />
          <Route path='/service' element={<Service />} />
          <Route path='/feedback' element={<FeedBack />} />
          
          <Route element={<PrivateRoute />}>
            <Route path='/user' element={<Orders />} />
            <Route path='/profile' element={<Profile />} />
          </Route>
          <Route element={<RouteAdmin />}>
            <Route path='/admin' element={<Admin />}>
              <Route index element={<Dasboard />} />
            </Route>
            <Route path='/online' element={<Onsite />} >
              <Route index element={<OnlineData />}/>
            </Route>
            <Route path='/report' element={<Report />} >
              <Route index element={<ReportData />}/>
            </Route>
            <Route path='/onsite' element={<Onsite />}>
              <Route index element={<OnsiteData />}/>
            </Route>
            <Route path='/setting' element={<Setting />}>
              <Route index element={<SettingData />}/>
            </Route>
            <Route path='/inventory' element={<Inventory />}>
              <Route index element={<InventoryData />}/>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
}
