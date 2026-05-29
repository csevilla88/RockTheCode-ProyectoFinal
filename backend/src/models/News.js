import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "El contenido es obligatorio"],
    },
    summary: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
      enum: ["fichajes", "partidos", "entrenamiento", "comunidad", "institucional"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    author: {
      type: String,
      default: "CFS Malgrat",
    },
    image: {
      type: String,
      default: "",
    },
    relatedPlayers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
    relatedMatch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
    },
  },
  { timestamps: true, collection: "news" }
);

newsSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const News = mongoose.model("News", newsSchema);
export default News;
