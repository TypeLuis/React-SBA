import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Players.scss';

const Players = () => {
    const [username, setUsername] = React.useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!username.trim()) return;

        navigate(`/players/${encodeURIComponent(username.trim())}`)
    }

    return (
        <div className="player-search">
            <div className="player-search__card">
                <h1 className="player-search__title">Find a Player</h1>
                <p className="player-search__subtitle">Enter a username to view their profile</p>
                <span className="player-search__subtitle">Example: Sypeh</span>
                <form className="player-search__form" onSubmit={handleSubmit}>
                    <input
                        className="player-search__input"
                        type="text"
                        placeholder="Enter username..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="off"
                        spellCheck={false}
                    />
                    <input
                        className="player-search__submit"
                        type="submit"
                        value="Search"
                        disabled={!username.trim()}
                    />
                </form>
            </div>
        </div>
    );
};

export default Players;