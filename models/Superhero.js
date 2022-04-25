const { Schema, model } = require("mongoose");

const schema = new Schema({
  nickname: { type: String, required: true, unique: true },
  real_name: { type: String, default: "Unknown" },
  origin_description: { type: String, default: "Unknown" },
  superpowers: { type: String, default: "Unknown" },
  catch_phrase: { type: String, default: "Unknown" },
  filename: { type: [String] },
  contentType: { type: [String] },
  imageBase64: { type: [String] },
});

module.exports = model("Superhero", schema);
