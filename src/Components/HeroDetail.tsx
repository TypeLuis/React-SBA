import { useState } from 'react';
import type { HeroObj } from '../types/types';
import { toImageUrl } from '../utilities/functions';
import '../Styles/HeroDetail.scss';

type HeroDetailProps = {
  hero: HeroObj;
};

// Only show abilities with icons + descriptions (skip internal/unnamed ones)
const isDisplayableAbility = (a: HeroObj['abilities'][number]) =>
  a.icon && a.description && a.name && !a.name.toLowerCase().includes('melee basic');

const ROLE_COLORS: Record<string, string> = {
  Duelist: '#e74c3c',
  Vanguard: '#3498db',
  Strategist: '#2ecc71',
};

function HeroDetail({ hero }: HeroDetailProps) {
  const [activeCostume, setActiveCostume] = useState(0);
  const [activeAbility, setActiveAbility] = useState<number | null>(null);

  const displayAbilities = hero.abilities.filter(isDisplayableAbility);
  const transformation = hero.transformations?.[0];
  const roleColor = ROLE_COLORS[hero.role] ?? '#aaa';
  const difficultyStars = Number(hero.difficulty) || 1;

  return (
    <div className="hero-detail">

      {/* Scanline texture overlay */}
      <div className="hero-detail__scanlines" />

      {/* ── HEADER ── */}
      <div className="hero-detail__header">
        <div className="hero-detail__header-left">
          <div className="hero-detail__tag">
            <span>FILE</span>
            <span className="hero-detail__tag-id">#{hero.id.toString().padStart(4, '0')}</span>
          </div>
          <h1 className="hero-detail__name">{hero.name}</h1>
          <p className="hero-detail__realname">{hero.real_name}</p>

          <div className="hero-detail__meta">
            <span className="hero-detail__role" style={{ '--role-color': roleColor } as React.CSSProperties}>
              {hero.role}
            </span>
            <span className="hero-detail__attack">{hero.attack_type}</span>
          </div>

          <div className="hero-detail__difficulty">
            <span className="hero-detail__difficulty-label">DIFFICULTY</span>
            <div className="hero-detail__stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`hero-detail__star ${i < difficultyStars ? 'hero-detail__star--on' : ''}`}>◆</span>
              ))}
            </div>
          </div>

          {hero.team?.length > 0 && (
            <div className="hero-detail__teams">
              {hero.team.map((t) => (
                <span key={t} className="hero-detail__team-tag">{t}</span>
              ))}
            </div>
          )}
        </div>

        <div className="hero-detail__header-right">
          <div className="hero-detail__portrait-wrap">
            <img
              className="hero-detail__portrait"
              src={toImageUrl(hero.imageUrl)}
              alt={hero.name}
            />
            <div className="hero-detail__portrait-corner hero-detail__portrait-corner--tl" />
            <div className="hero-detail__portrait-corner hero-detail__portrait-corner--tr" />
            <div className="hero-detail__portrait-corner hero-detail__portrait-corner--bl" />
            <div className="hero-detail__portrait-corner hero-detail__portrait-corner--br" />
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      {transformation && (
        <div className="hero-detail__section">
          <h2 className="hero-detail__section-title">COMBAT STATS</h2>
          <div className="hero-detail__stats">
            <div className="hero-detail__stat">
              <span className="hero-detail__stat-label">HEALTH</span>
              <span className="hero-detail__stat-value">{transformation.health}</span>
              <div className="hero-detail__stat-bar">
                <div
                  className="hero-detail__stat-bar-fill"
                  style={{ width: `${Math.min(100, (Number(transformation.health) / 700) * 100)}%` }}
                />
              </div>
            </div>
            <div className="hero-detail__stat">
              <span className="hero-detail__stat-label">MOVE SPEED</span>
              <span className="hero-detail__stat-value">{transformation.movement_speed}</span>
              <div className="hero-detail__stat-bar">
                <div className="hero-detail__stat-bar-fill" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── BIO & LORE ── */}
      <div className="hero-detail__section">
        <h2 className="hero-detail__section-title">DOSSIER</h2>
        <p className="hero-detail__bio">{hero.bio}</p>
        {hero.lore && (
          <div className="hero-detail__lore">
            {hero.lore.split('\n').filter(Boolean).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
      </div>

      {/* ── ABILITIES ── */}
      {displayAbilities.length > 0 && (
        <div className="hero-detail__section">
          <h2 className="hero-detail__section-title">ABILITIES</h2>
          <div className="hero-detail__abilities">
            {displayAbilities.map((ability, i) => (
              <div
                key={ability.id}
                className={`hero-detail__ability ${activeAbility === i ? 'hero-detail__ability--open' : ''} hero-detail__ability--${ability.type.toLowerCase()}`}
                onClick={() => setActiveAbility(activeAbility === i ? null : i)}
              >
                <div className="hero-detail__ability-header">
                  <img
                    className="hero-detail__ability-icon"
                    src={toImageUrl(ability.icon)}
                    alt={ability.name}
                  />
                  <div className="hero-detail__ability-info">
                    <span className="hero-detail__ability-name">{ability.name}</span>
                    <span className="hero-detail__ability-type">{ability.type}</span>
                  </div>
                  <span className="hero-detail__ability-chevron">{activeAbility === i ? '▲' : '▼'}</span>
                </div>

                {activeAbility === i && (
                  <div className="hero-detail__ability-body">
                    <p className="hero-detail__ability-desc">{ability.description}</p>
                    {ability.additional_fields && (
                      <table className="hero-detail__ability-table">
                        <tbody>
                          {Object.entries(ability.additional_fields)
                            .filter(([, v]) => v && String(v).trim())
                            .map(([k, v]) => (
                              <tr key={k}>
                                <td>{k}</td>
                                <td>{String(v)}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── COSTUMES ── */}
      {hero.costumes?.length > 0 && (
        <div className="hero-detail__section">
          <h2 className="hero-detail__section-title">LOADOUT SKINS</h2>
          <div className="hero-detail__costumes">
            {hero.costumes.map((c, i) => (
              <button
                key={c.id}
                className={`hero-detail__costume ${i === activeCostume ? 'hero-detail__costume--active' : ''}`}
                onClick={() => setActiveCostume(i)}
              >
                <img src={toImageUrl(c.icon)} alt={c.name} />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default HeroDetail;