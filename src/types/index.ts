export * from "./coin";
export * from "./utxo";
export * from "./exchange";
export * from "./transaction";
export * from "./orchestrator";


export type LaunchRuneEtchingArgs = {

    rune_name: string;
    rune_logo?: LogoParams;
    rune_symbol?: string;

}

export type LogoParams = {
    content_type: string;
    content_base64: string;
}

export type LaunchArgs = {

    description?: string;
    social_info: SocialInfo;
    start_height: number;
    raising_target_sats: number;
    banner?: string;
}

export type SocialInfo = {
    twitter?: string;
    github?: string;
    telegram?: string;
    discord?: string;
    website?: string;
}