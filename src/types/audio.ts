export interface AudioRequest {
    audioUrl: string;
}

export interface AudioResponse {
    id: string;
    audioUrl: string;
    transcription: string;
    createdAt: Date;
}





