import fs from "fs";
import path from "path";

/**
 * Parsea un archivo CSV con delimitador punto y coma (;)
 * Retorna un array de objetos con las claves del header
 */
export const parseCSV = (filePath) => {
  const absolutePath = path.resolve(filePath);
  const fileContent = fs.readFileSync(absolutePath, "utf-8");
  const lines = fileContent.trim().split("\n");

  if (lines.length < 2) {
    throw new Error("El archivo CSV no tiene datos suficientes");
  }

  const headers = lines[0].split(";").map((h) => h.trim());

  const data = lines.slice(1).map((line) => {
    const values = line.split(";").map((v) => v.trim());
    const obj = {};

    headers.forEach((header, index) => {
      const value = values[index] || "";

      // Intentar convertir números
      if (!isNaN(value) && value !== "") {
        obj[header] = Number(value);
      } else {
        obj[header] = value;
      }
    });

    return obj;
  });

  return data;
};
