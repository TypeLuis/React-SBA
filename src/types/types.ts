// everything the Heros api endpoint brings
export type Hero = {
    id: string;
    name: string;
    real_name: string;
    role: string;
    team: string[];
    difficulty: string;
    attack_type: string;
    bio: string;
    lore: string;
    imageUrl: string;
    abilities: unknown[];
    costumes: unknown[];
    transformations: unknown[];
};

// image type needed
export type ImgInfo = {
    id: string;
    name: string;
    image: string;
};


export type RivalsMap = {
    id: number;
    name: string;
    full_name: string;
    location: string;
    description: string;
    game_mode: string;
    is_competitive: boolean;

    sub_map_id: number;
    sub_map_name: string | null;
    sub_map_thumbnail: string | null;

    images: string[];
    video: string | null;      // sometimes null
};


// HERO DETAILS / TYPE FOR A SINGLE HERO

export type HeroTransformation = {
    id: string;              // "0"
    name: string;            // "Storm"
    icon: string;            // "/heroes/transformations/..."
    health: string;          // "250" (API gives strings)
    movement_speed: string;  // "6 m/s"
};

export type HeroCostume = {
    id: string;          // "1015001"
    name: string;
    icon: string;        // "/costumes/..."
    quality: string;     // e.g. "NO_QUALITY"
    description: string; // often "0"
    appearance: string;  // often "0"
};

// API varies: sometimes abilities don’t have icon/name/description.
// additional_fields is a dictionary of random keys -> values.
export type HeroAbility = {
    id: number;
    icon?: string;
    name?: string;
    type: string;
    isCollab: boolean;
    description?: string;
    additional_fields?: Record<string, string>;
    transformation_id: string; // "0"
};

export type HeroObj = {
    id: string;         
    name: string;       
    real_name: string;
    imageUrl: string;

    role: string;
    attack_type: string;
    team: string[];

    difficulty: string;  
    bio: string;
    lore: string;

    transformations: HeroTransformation[];
    costumes: HeroCostume[];
    abilities: HeroAbility[];
};



export type PlayerStats = {
    hero_id: number;
    hero_name: string;
    hero_thumbnail: string;
  
    matches: number;
    wins: number;
    mvp: number;
    svp: number;
  
    kills: number;
    deaths: number;
    assists: number;
  
    play_time: number;      // seconds (float)
    damage: number;         // total damage dealt
    heal: number;           // total healing done
    damage_taken: number;   // total damage received
  
    main_attack: {
        total: number;
        hits: number;
    };
  };

export type PlayerData = {
    uid: number;
    name: string;
    isPrivate: boolean;
    player: {
      uid: number;
      level: string;
      name: string;
      icon: {
        player_icon_id: string;
        player_icon: string;
      };
      rank: {
        rank: string;
        image: string;
        color: string;
      };
      team: {
        club_team_id: string;
        club_team_mini_name: string;
        club_team_type: string;
      } | null;
      info: {
        completed_achievements: string;
        login_os: string;
      };
    };
    overall_stats: {
      total_matches: number;
      total_wins: number;
      ranked: {
        total_matches: number;
        total_wins: number;
        total_assists: number;
        total_deaths: number;
        total_kills: number;
        total_time_played: string;
        total_time_played_raw: number;
        total_mvp: number;
        total_svp: number;
      };
      unranked: {
        total_matches: number;
        total_wins: number;
        total_assists: number;
        total_deaths: number;
        total_kills: number;
        total_time_played: string;
        total_time_played_raw: number;
        total_mvp: number;
        total_svp: number;
      };
    };
    team_mates: {
      player_info: {
        nick_name: string;
        player_icon: string;
        player_uid: number;
      };
      matches: number;
      wins: number;
      win_rate: string;
    }[];
    heroes_ranked: PlayerStats[],
    heroes_unranked: PlayerStats[]
  };