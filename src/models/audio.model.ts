import mongoose from "mongoose";

export interface IAudio extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    audioUrl: string;
    transcription: string;
    createdAt: Date;
}

const audioSchema = new mongoose.Schema<IAudio>({
    audioUrl: {
        type: String,
        required: true,
    },
    transcription: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Audio = mongoose.model<IAudio>("Audio", audioSchema);