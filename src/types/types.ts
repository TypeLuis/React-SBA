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
