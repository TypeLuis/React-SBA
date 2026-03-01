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
    id: string;          // "1015"
    name: string;        // "storm"
    real_name: string;
    imageUrl: string;

    role: string;
    attack_type: string;
    team: string[];

    difficulty: string;  // "3" (string in API)
    bio: string;
    lore: string;

    transformations: HeroTransformation[];
    costumes: HeroCostume[];
    abilities: HeroAbility[];
};