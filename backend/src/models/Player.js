import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      trim: true,
    },
    position: {
      type: String,
      required: true,
      enum: ["Portero", "Defensa", "Centrocampista", "Delantero"],
    },
    number: {
      type: Number,
      min: 1,
      max: 99,
    },
    nationality: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
    },
    age: {
      type: Number,
      min: 16,
      max: 50,
    },
    height: {
      type: Number,
      min: 150,
      max: 210,
    },
    weight: {
      type: Number,
      min: 50,
      max: 120,
    },
    goals: {
      type: Number,
      default: 0,
    },
    assists: {
      type: Number,
      default: 0,
    },
    yellowCards: {
      type: Number,
      default: 0,
    },
    redCards: {
      type: Number,
      default: 0,
    },
    matchesPlayed: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["activo", "retirado", "cedido"],
      default: "activo",
    },
    image: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, collection: "players" }
);

/**
 * Pre-save: si hay birthDate, calcular automáticamente la edad
 */
playerSchema.pre("save", function (next) {
  if (this.birthDate) {
    const today = new Date();
    const birth = new Date(this.birthDate);
    let computedAge = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      computedAge -= 1;
    }
    this.age = computedAge;
  }
  next();
});

/**
 * Pre-update (findByIdAndUpdate, etc.) – recalcula la edad si llega birthDate
 */
playerSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() || {};
  const birthDate = update.birthDate || update.$set?.birthDate;
  if (birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let computedAge = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      computedAge -= 1;
    }
    if (update.$set) {
      update.$set.age = computedAge;
    } else {
      update.age = computedAge;
    }
    this.setUpdate(update);
  }
  next();
});

playerSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Player = mongoose.model("Player", playerSchema);
export default Player;
