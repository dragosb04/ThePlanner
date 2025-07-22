import React, { useState, useEffect } from "react";
import BottomNav from "./BottomNav";
import Header from "./Header";
import useCurrentUser from "../Hooks/useCurrentUser";
import "./Form.css";

function Settings() {
    const user = useCurrentUser();
    const [settings, setSettings] = useState({
        username: '',
        email: '',
        profile_picture: '',
        status: '',
        role: '',
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (user) {
            setSettings({
                username: user.username || '',
                email: user.email || '',
                profile_picture: user.profile_picture || '',
                status: user.status || '',
                role: user.role || '',
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Date trimise:", settings);
            const response = await fetch("/api/users/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(settings),
            });

            if (response.ok) {
                setMessage("Setările au fost salvate cu succes.");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                setMessage("Eroare la salvarea setărilor.");
            }
        } catch (err) {
            console.error(err);
            setMessage("A apărut o eroare la conectarea cu serverul.");
        }
    };

    return (
        <>
            <Header />
            <div className="form-box">
                <form className='form-group' onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={settings.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={settings.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Link imagine profil:</label>
                        <input
                            type="text"
                            name="profile_picture"
                            value={settings.profile_picture}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Status:</label>
                        <input
                            type="text"
                            name="status"
                            value={settings.status}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Rol:</label>
                        <input
                            type="text"
                            name="role"
                            value={settings.role}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button type="submit" className="submit-button">Salvează</button>
                </form>

                {message && <p style={{ marginTop: '10px' }}>{message}</p>}
            </div>
            <BottomNav />
        </>
    );
}

export default Settings;
