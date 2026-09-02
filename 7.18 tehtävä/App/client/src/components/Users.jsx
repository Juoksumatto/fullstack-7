import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import './users.css';

const Users = ({blogs, user, onLogout}) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('/api/Users')
            .then(response => response.json())
            .then(data => {
                console.log('Users data:', data);
                setUsers(Array.isArray(data) ? data : []);
            })
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    return(
        <div className="users-container">
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <Link to="/blogs">Blogs</Link>
                <Link to="/users">Users</Link>
                {user && <Link to="/blogs/new">new blog</Link>}
                {user ? (
                    <button onClick={onLogout}>Logout</button>
                ) : (
                    <Link to="/">Login</Link>
                )}
            </div>

            <h2>Users</h2>
            
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Blogs created</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u, index) => (
                        <tr key={u.username || index}>
                            <td>
                                <Link to={`/users/${u.username}`}>{u.name}
                                </Link>
                            </td>
                            <td>{u.username}</td>
                            <td>{u.blogs || 0}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Users