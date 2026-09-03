import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import './users.css';
import { TextField, Button, Toolbar, AppBar } from '@mui/material'

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
            <AppBar style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <Toolbar>
                    <Button variant="contained" component={Link} to="/blogs">Blogs</Button>
                    <Button variant="contained" component={Link} to="/users">Users</Button>
                    {user && <Button variant="contained" component={Link} to="/blogs/new">new blog</Button>}
                    {user ? (
                        <Button variant="contained" onClick={onLogout}>Logout</Button>
                    ) : (
                        <Button variant="contained" component={Link} to="/">Login</Button>
                    )}
                </Toolbar>
            </AppBar>

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
                                <Button variant="contained" component={Link} to={`/users/${u.username}`}>{u.name}
                                </Button>
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