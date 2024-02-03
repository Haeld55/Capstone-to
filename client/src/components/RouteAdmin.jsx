import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function RouteAdmin() {
    const { currentUser } = useSelector((state) => state.user);
    // If adminOnly is true and the user is not an admin, navigate to login
    if  (!currentUser || currentUser.role !== 'admin'){
      return <Navigate to="/user" />;
    }
  
    // If adminOnly is false and there is no currentUser, navigate to login
    if(!currentUser) {
      return <Navigate to="/user" />;
    }
  
    // If the user is authenticated and adminOnly is false or the user is an admin, allow access
    return <Outlet />;
}
