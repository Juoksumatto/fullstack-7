import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TextField, Button, Toolbar, AppBar } from '@mui/material'

const Userdetail = ({ user, onLogout }) => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    const { username } = useParams();

    useEffect(() => {
        fetch(`/api/users/${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("User not found");
                }

                return response.json();
            })
            .then(data => {
                setUserData(data);
            })
            .catch(error => {
                setError(error.message);
            });
    }, [username]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <AppBar position='static'>    
                <Toolbar
                    style={{
                        display: "flex",
                        gap: "20px",
                        marginBottom: "30px",
                        padding: "15px 0",
                        borderBottom: "1px solid #ccc"
                    }}
                >
                    <Button variant="contained" component={Link} to="/blogs">Blogs</Button>
                    <Button variant="contained" component={Link} to="/users">Users</Button>

                    {user && <Button variant="contained" component={Link} to="/blogs/new">New blog</Button>}

                    {user ? (
                        <Button onClick={onLogout}>Logout</Button>
                    ) : (
                        <Button variant="Contained" component={Link} to="/">Login</Button>
                    )}
                </Toolbar>
            </AppBar>

            <h2>{userData.name}</h2>

            <h3>Added blogs</h3>

            <ul>
                {userData.blogs.map(blog => (
                    <li key={blog.id}>
                        {blog.title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Userdetail;