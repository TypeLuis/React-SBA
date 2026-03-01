import React, { useState } from 'react';
import type { RivalsMap } from '../types/types';
import { toImageUrl } from '../utilities/functions';
import '../Styles/MapDetail.scss';

type MapDetailProps = {
    map: RivalsMap
}

const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|v=)([^&?/]+)/);
    return match ? match[1] : null;
};

function MapDetail({ map }: MapDetailProps) {
    const [showVideo, setShowVideo] = useState(false);
    const videoId = getYouTubeId(String(map.video));

    // Only the large image (index 2, fallback to 0)
    const largeImage = toImageUrl(map.images[2] ?? map.images[0]);

    return (
        <div className="map-detail">

            {/* Ambient background */}
            <div className="map-detail__bg" style={{ backgroundImage: `url(${largeImage})` }} />
            <div className="map-detail__bg-overlay" />

            <div className="map-detail__content">

                {/* Header */}
                <header className="map-detail__header">
                    <div className="map-detail__location">
                        <span className="map-detail__rune">⬡</span>
                        {map.location}
                    </div>
                    <h1 className="map-detail__title">{map.name}</h1>
                    <p className="map-detail__subtitle">{map.full_name}</p>

                    <div className="map-detail__badges">
                        <span className="map-detail__badge">{map.game_mode}</span>
                        {map.is_competitive && (
                            <span className="map-detail__badge map-detail__badge--competitive">Competitive</span>
                        )}
                    </div>
                </header>

                {/* Main image viewer */}
                <div className="map-detail__gallery">
                    <div className="map-detail__main-image">
                        {showVideo && videoId ? (
                            <iframe
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                title={map.name}
                                allow="autoplay; fullscreen"
                                allowFullScreen
                            />
                        ) : (
                            <img src={largeImage} alt={map.name} />
                        )}

                        {videoId && !showVideo && (
                            <button className="map-detail__play" onClick={() => setShowVideo(true)} aria-label="Play video">
                                <span>▶</span>
                            </button>
                        )}
                        {showVideo && (
                            <button className="map-detail__play map-detail__play--close" onClick={() => setShowVideo(false)}>✕</button>
                        )}
                    </div>

                    {/* Single thumbnail — large image + video toggle */}
                    {!showVideo && (
                        <div className="map-detail__thumbs">
                            <button className="map-detail__thumb map-detail__thumb--active">
                                <img src={largeImage} alt={map.name} />
                            </button>
                            {videoId && (
                                <button className="map-detail__thumb map-detail__thumb--video" onClick={() => setShowVideo(true)}>
                                    <span>▶</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="map-detail__info">
                    <div className="map-detail__divider"><span>LORE</span></div>
                    <p className="map-detail__description">{map.description}</p>

                    {map.sub_map_name && (
                        <div className="map-detail__submap">
                            <span className="map-detail__submap-label">Sub-map</span>
                            <span className="map-detail__submap-name">{map.sub_map_name}</span>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default MapDetail;