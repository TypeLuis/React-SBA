import React from 'react';
import type { PlayerData, PlayerStats } from '../types/types';
import '../Styles/PlayerDetail.scss';
import { toImageUrl } from '../utilities/functions';

type PlayerDetailProps = {
  player: PlayerData;
};


function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function kda(kills: number, deaths: number, assists: number): string {
  if (deaths === 0) return 'Perfect';
  return ((kills + assists) / deaths).toFixed(2);
}

function accuracy(main_attack: PlayerStats['main_attack']): string {
  if (!main_attack.total) return '0%';
  return `${Math.round((main_attack.hits / main_attack.total) * 100)}%`;
}

function topFive(heroes: PlayerStats[]): PlayerStats[] {
  return [...heroes]
    .filter((h) => h.play_time > 0)
    .sort((a, b) => b.play_time - a.play_time)
    .slice(0, 5);
}

function PlayerDetail({ player }: PlayerDetailProps) {
  const { player: p, overall_stats, heroes_ranked, heroes_unranked,  team_mates } = player;

  const ranked = overall_stats.ranked;
  const winRate = ranked.total_matches > 0
    ? Math.round((ranked.total_wins / ranked.total_matches) * 100)
    : 0;


  const topTeammates = [...team_mates]
    .sort((a, b) => b.matches - a.matches)
    .slice(0, 5);

  const rankColor = p.rank?.color ?? '#aaa';

  const showTopFive = (heroList:PlayerStats[], label: "Quick Play" | "Ranked") => {
    const topHeroes = topFive(heroList);
    return(
        <>
         {topHeroes.length > 0 && (
            <div className="player-detail__section">
              <h2 className="player-detail__section-title">Top Heroes {label}</h2>
              <div className="player-detail__heroes">
                {topHeroes.map((h, i) => {
                  const heroWr = h.matches > 0 ? Math.round((h.wins / h.matches) * 100) : 0;
                  return (
                    <div key={h.hero_id} className="player-detail__hero">
                      <span className="player-detail__hero-rank">#{i + 1}</span>
                      <img
                        className="player-detail__hero-thumb"
                        src={toImageUrl(h.hero_thumbnail)}
                        alt={h.hero_name}
                      />
                      <div className="player-detail__hero-info">
                        <span className="player-detail__hero-name">{h.hero_name}</span>
                        <span className="player-detail__hero-time">{formatTime(h.play_time)}</span>
                      </div>
                      <div className="player-detail__hero-stats">
                        <span className="player-detail__hero-stat">
                          <span className="player-detail__hero-stat-val">{h.matches}</span>
                          <span className="player-detail__hero-stat-lbl">games</span>
                        </span>
                        <span className="player-detail__hero-stat">
                          <span className="player-detail__hero-stat-val">{kda(h.kills, h.deaths, h.assists)}</span>
                          <span className="player-detail__hero-stat-lbl">KDA</span>
                        </span>
                        <span className="player-detail__hero-stat">
                          <span className="player-detail__hero-stat-val">{accuracy(h.main_attack)}</span>
                          <span className="player-detail__hero-stat-lbl">acc</span>
                        </span>
                        <span
                          className="player-detail__hero-stat"
                          style={{ color: heroWr >= 60 ? '#39ff14' : heroWr >= 40 ? '#f0c040' : '#ff4f4d' }}
                        >
                          <span className="player-detail__hero-stat-val">{heroWr}%</span>
                          <span className="player-detail__hero-stat-lbl">WR</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
    )
  }

  return (
    <div className="player-detail">
      <div className="player-detail__glow" style={{ '--rank-color': rankColor } as React.CSSProperties} />

      <div className="player-detail__inner">

        {/* ── HEADER ── */}
        <div className="player-detail__header">
          <div className="player-detail__avatar-wrap">
            <img className="player-detail__avatar" src={toImageUrl(p.icon.player_icon)} alt={p.name} />
            <div className="player-detail__avatar-ring" style={{ '--rank-color': rankColor } as React.CSSProperties} />
          </div>

          <div className="player-detail__identity">
            <div className="player-detail__meta-row">
              <span className="player-detail__level">LVL {p.level}</span>
              {p.team && <span className="player-detail__team">{p.team.club_team_mini_name}</span>}
              <span className="player-detail__platform">{p.info.login_os}</span>
            </div>
            <h1 className="player-detail__name">{p.name}</h1>
            <div className="player-detail__rank" style={{ color: rankColor }}>
              <img className="player-detail__rank-icon" src={toImageUrl(p.rank.image)} alt={p.rank.rank} />
              <span>{p.rank.rank}</span>
            </div>
          </div>
        </div>

        {/* ── OVERALL STATS ── */}
        <div className="player-detail__section">
          <h2 className="player-detail__section-title">Overall Stats</h2>
          <div className="player-detail__stats-grid">
            <div className="player-detail__stat-card player-detail__stat-card--highlight">
              <span className="player-detail__stat-value">{winRate}%</span>
              <span className="player-detail__stat-label">Win Rate</span>
            </div>
            <div className="player-detail__stat-card">
              <span className="player-detail__stat-value">{ranked.total_matches}</span>
              <span className="player-detail__stat-label">Ranked Matches</span>
            </div>
            <div className="player-detail__stat-card">
              <span className="player-detail__stat-value">{ranked.total_wins}</span>
              <span className="player-detail__stat-label">Wins</span>
            </div>
            <div className="player-detail__stat-card">
              <span className="player-detail__stat-value">{kda(ranked.total_kills, ranked.total_deaths, ranked.total_assists)}</span>
              <span className="player-detail__stat-label">KDA</span>
            </div>
            <div className="player-detail__stat-card">
              <span className="player-detail__stat-value">{ranked.total_kills}</span>
              <span className="player-detail__stat-label">Kills</span>
            </div>
            <div className="player-detail__stat-card">
              <span className="player-detail__stat-value">{ranked.total_deaths}</span>
              <span className="player-detail__stat-label">Deaths</span>
            </div>
            <div className="player-detail__stat-card">
              <span className="player-detail__stat-value">{ranked.total_assists}</span>
              <span className="player-detail__stat-label">Assists</span>
            </div>
            <div className="player-detail__stat-card">
              <span className="player-detail__stat-value">{formatTime(ranked.total_time_played_raw)}</span>
              <span className="player-detail__stat-label">Time Played</span>
            </div>
            <div className="player-detail__stat-card">
              <span className="player-detail__stat-value">{ranked.total_mvp}</span>
              <span className="player-detail__stat-label">MVP</span>
            </div>
            <div className="player-detail__stat-card">
              <span className="player-detail__stat-value">{ranked.total_svp}</span>
              <span className="player-detail__stat-label">SVP</span>
            </div>
          </div>
        </div>

        {/* ── TOP 5 HEROES ── */}
        {showTopFive(heroes_ranked, "Ranked")}
        {showTopFive(heroes_unranked, "Quick Play")}

        {/* ── TOP TEAMMATES ── */}
        {topTeammates.length > 0 && (
          <div className="player-detail__section">
            <h2 className="player-detail__section-title">Most Played With</h2>
            <div className="player-detail__teammates">
              {topTeammates.map((t, i) => {
                const wr = Math.round((t.wins / t.matches) * 100);
                return (
                  <div key={t.player_info.player_uid} className="player-detail__teammate">
                    <span className="player-detail__teammate-rank">#{i + 1}</span>
                    <img
                      className="player-detail__teammate-avatar"
                      src={toImageUrl(t.player_info.player_icon)}
                      alt={t.player_info.nick_name}
                    />
                    <div className="player-detail__teammate-info">
                      <span className="player-detail__teammate-name">{t.player_info.nick_name}</span>
                      <span className="player-detail__teammate-matches">{t.matches} games together</span>
                    </div>
                    <div className="player-detail__teammate-wr" style={{
                      color: wr >= 60 ? '#39ff14' : wr >= 40 ? '#f0c040' : '#ff4f4d'
                    }}>
                      {wr}% WR
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default PlayerDetail;