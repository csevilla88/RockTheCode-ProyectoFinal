import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { parseCSV } from "../utils/csvParser.js";
import Player from "../models/Player.js";
import Match from "../models/Match.js";
import News from "../models/News.js";
import User from "../models/User.js";

const MONGO_URI = process.env.MONGO_URI;

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB para seeding");

    // Limpiar colecciones existentes
    await Player.deleteMany({});
    await Match.deleteMany({});
    await News.deleteMany({});
    await User.deleteMany({});
    console.log("🗑️  Colecciones limpiadas");

    // =========================================
    // 1. SEED DE JUGADORES desde CSV
    // =========================================
    console.log("📄 Leyendo players.csv...");
    const playersData = parseCSV("./data/players.csv");
    console.log(`   Encontrados ${playersData.length} jugadores en el CSV`);

    const createdPlayers = await Player.insertMany(playersData);
    console.log(`✅ ${createdPlayers.length} jugadores insertados en la BBDD`);

    // Crear un mapa de nombre completo → ObjectId para relaciones
    const playerMap = {};
    createdPlayers.forEach((player) => {
      const fullName = `${player.name} ${player.lastName}`;
      playerMap[fullName] = player._id;
    });

    // =========================================
    // 2. SEED DE PARTIDOS desde CSV
    // =========================================
    console.log("📄 Leyendo matches.csv...");
    const matchesData = parseCSV("./data/matches.csv");
    console.log(`   Encontrados ${matchesData.length} partidos en el CSV`);

    const matchDocuments = matchesData.map((match) => {
      // Parsear goleadores: "Nombre Apellido:minuto-Nombre Apellido:minuto"
      const scorers = [];
      if (match.scorers && match.scorers !== "") {
        const scorerEntries = match.scorers.split("-");
        scorerEntries.forEach((entry) => {
          const [playerName, minute] = entry.split(":");
          const trimmedName = playerName.trim();
          if (playerMap[trimmedName]) {
            scorers.push({
              player: playerMap[trimmedName],
              minute: parseInt(minute),
            });
          }
        });
      }

      return {
        opponent: match.opponent,
        date: new Date(match.date),
        competition: match.competition,
        stadium: match.stadium,
        homeAway: match.homeAway,
        goalsFor: match.goalsFor,
        goalsAgainst: match.goalsAgainst,
        result: match.result,
        scorers,
        attendance: match.attendance,
        referee: match.referee,
        season: match.season,
      };
    });

    const createdMatches = await Match.insertMany(matchDocuments);
    console.log(`✅ ${createdMatches.length} partidos insertados en la BBDD`);

    // Crear mapa de oponente → primer match para relaciones con noticias
    const matchMap = {};
    createdMatches.forEach((match) => {
      if (!matchMap[match.opponent]) {
        matchMap[match.opponent] = match._id;
      }
    });

    // =========================================
    // 3. SEED DE NOTICIAS desde CSV
    // =========================================
    console.log("📄 Leyendo news.csv...");
    const newsData = parseCSV("./data/news.csv");
    console.log(`   Encontradas ${newsData.length} noticias en el CSV`);

    const newsDocuments = newsData.map((news) => {
      // Resolver jugadores relacionados
      const relatedPlayers = [];
      if (news.relatedPlayerNames && news.relatedPlayerNames !== "") {
        const playerNames = news.relatedPlayerNames.split("-");
        playerNames.forEach((name) => {
          const trimmedName = name.trim();
          if (playerMap[trimmedName]) {
            relatedPlayers.push(playerMap[trimmedName]);
          }
        });
      }

      // Resolver partido relacionado
      let relatedMatch = null;
      if (news.relatedMatchOpponent && news.relatedMatchOpponent !== "") {
        relatedMatch = matchMap[news.relatedMatchOpponent.trim()] || null;
      }

      return {
        title: news.title,
        content: news.content,
        summary: news.summary,
        category: news.category,
        date: new Date(news.date),
        author: news.author,
        relatedPlayers,
        relatedMatch,
      };
    });

    const createdNews = await News.insertMany(newsDocuments);
    console.log(`✅ ${createdNews.length} noticias insertadas en la BBDD`);

    // =========================================
    // 4. SEED DE USUARIOS (admin + user de prueba)
    // =========================================
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const hashedUserPassword = await bcrypt.hash("user123", 10);

    const users = [
      {
        username: "admin",
        email: "admin@cfsmalgrat.com",
        password: hashedPassword,
        role: "admin",
        favoritePlayers: [createdPlayers[0]._id, createdPlayers[10]._id],
      },
      {
        username: "aficionado1",
        email: "fan@cfsmalgrat.com",
        password: hashedUserPassword,
        role: "user",
        favoritePlayers: [createdPlayers[5]._id, createdPlayers[20]._id],
      },
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`✅ ${createdUsers.length} usuarios insertados en la BBDD`);

    // =========================================
    // RESUMEN
    // =========================================
    console.log("\n === SEED COMPLETADO - CFS Malgrat ===");
    console.log(`   Jugadores: ${createdPlayers.length}`);
    console.log(`   Partidos:  ${createdMatches.length}`);
    console.log(`   Noticias:  ${createdNews.length}`);
    console.log(`   Usuarios:  ${createdUsers.length}`);
    console.log("==========================================\n");

    await mongoose.disconnect();
    console.log("Desconectado de MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error en el seed:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
