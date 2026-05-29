import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    opponent: {
      type: String,
      required: [true, "El rival es obligatorio"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "La fecha es obligatoria"],
    },
    competition: {
      type: String,
      required: true,
      enum: ["Liga", "Copa del Rey", "Champions League", "Amistoso", "Supercopa"],
    },
    stadium: {
      type: String,
      required: true,
    },
    homeAway: {
      type: String,
      enum: ["local", "visitante"],
      required: true,
    },
    goalsFor: {
      type: Number,
      default: 0,
      min: 0,
    },
    goalsAgainst: {
      type: Number,
      default: 0,
      min: 0,
    },
    result: {
      type: String,
      enum: ["victoria", "derrota", "empate"],
      required: true,
    },
    scorers: [
      {
        player: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Player",
        },
        minute: {
          type: Number,
          min: 1,
          max: 120,
        },
      },
    ],
    attendance: {
      type: Number,
      default: 0,
    },
    referee: {
      type: String,
      default: "",
    },
    season: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: "matches" }
);

matchSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Match = mongoose.model("Match", matchSchema);
export default Match;
