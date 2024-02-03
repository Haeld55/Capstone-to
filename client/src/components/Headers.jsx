import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { deleteUserFailure, deleteUserSuccess, signOutUserStart } from '../redux/user/userSlice'


export default function Headers() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isOnsite = location.pathname.startsWith('/onsite');
  const isOnline = location.pathname.startsWith('/online');
  const isReport = location.pathname.startsWith('/report');
  const isInventory = location.pathname.startsWith('/inventory');
  const isSetting = location.pathname.startsWith('/setting');


  const dispatch = useDispatch();
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.meesage));
    }
  };
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          {isAdminPage  || isOnsite || isOnline || isReport || isInventory || isSetting ? (
            ''
          ) : (
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
            </div>
          )}
          <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li>
                <a>
                  {currentUser?.role === 'user' ? (
                    <Link to={'/user'}>
                      <a className="no-underline">Order</a>
                    </Link>
                  ) : currentUser?.role === 'admin' ? (
                    isAdminPage  || isOnsite || isOnline || isReport || isInventory || isSetting ? (
                      ''
                  ) : (
                    <Link to={'/admin'}>
                      <a className="no-underline">Admin</a>
                    </Link>
                  )
                  ) : null}
                </a>
              </li>
              {isAdminPage  || isOnsite || isOnline || isReport || isInventory || isSetting ? (
                  ''
              ) : (
                <Link to={'/about'}>
                  <li>
                    <a>About</a>
                  </li>
                </Link>
              )}

              {isAdminPage  || isOnsite || isOnline || isReport || isInventory || isSetting ? (
                  ''
              ) : (
                <Link to={'/service'}>
                  <li>
                    <a>Service</a>
                  </li>
                </Link>
              )}

              {isAdminPage  || isOnsite || isOnline || isReport || isInventory || isSetting ? (
                  ''
              ) : (
                <Link to={'/feedback'}> 
                  <li>
                    <a>Feedback</a>
                  </li>
                </Link>
              )}
              
          </ul>
        </div>
        <Link to={'/'}>
        <div className='ml-6 lg:ml-32'>
            <p className='font-bold text-2xl lg:text-4xl text-gray-600'>
                <span className='text-logoFirst'>Cool</span>
                <span className='text-logoSecond'>Klean </span>
            </p>
          </div>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
              {isAdminPage  || isOnsite || isOnline || isReport || isInventory || isSetting ? (
                  ''
              ) : (
                <Link to={'/about'}>
                  <li>
                    <a>About</a>
                  </li>
                </Link>
              )}

              {isAdminPage  || isOnsite || isOnline || isReport || isInventory || isSetting ? (
                  ''
              ) : (
                <Link to={'/service'}>
                  <li>
                    <a>Service</a>
                  </li>
                </Link>
              )}

              {isAdminPage  || isOnsite || isOnline || isReport || isInventory || isSetting ? (
                  ''
              ) : (
                <Link to={'/feedback'}> 
                  <li>
                    <a>Feedback</a>
                  </li>
                </Link>
              )}
              <li>
                <a>
                  {currentUser?.role === 'user' ? (
                    <Link to={'/user'}>
                      <a className="no-underline">Order</a>
                    </Link>
                  ) : currentUser?.role === 'admin' ? (
                    isAdminPage  || isOnsite || isOnline || isReport || isInventory || isSetting ? (
                      ''
                  ) : (
                    <Link to={'/admin'}>
                      <a className="no-underline">Admin</a>
                    </Link>
                  )
                    
                  ) : null}
                </a>
              </li>
          </ul>
      </div>
      <div className="navbar-end">
        {currentUser ? 
        (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component" src={currentUser.avatar} />
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li>
                <Link to={'/profile'}>
                  <a className="justify-between">
                    Profile
                  </a>
                </Link>
              </li>
              <li><a onClick={handleSignOut}>Logout</a></li>
            </ul>
          </div>
        ) : (
          <Link to={'/login'}>
            <button className="btn btn-outline flex justify-center items-center gap-3 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white border border-blue-500 hover:border-transparent rounded">Sign In</button>
          </Link>
        )}
      </div>
    </div>
  )
}
