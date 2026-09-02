import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

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
            <nav
                style={{
                    display: "flex",
                    gap: "20px",
                    marginBottom: "30px",
                    padding: "15px 0",
                    borderBottom: "1px solid #ccc"
                }}
            >
                <Link to="/blogs">Blogs</Link>
                <Link to="/users">Users</Link>

                {user && <Link to="/blogs/new">New blog</Link>}

                {user ? (
                    <button onClick={onLogout}>Logout</button>
                ) : (
                    <Link to="/">Login</Link>
                )}
            </nav>

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