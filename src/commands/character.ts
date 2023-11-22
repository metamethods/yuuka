import { SlashCommandBuilder } from "discord.js";
import { Messages } from "@enums/messages";

import Command from "@schemas/Command";
import BlueArchive from "@classes/BlueArchive";
import EmbedBuilder from "@schemas/EmbedBuilder";

import format from "@utility/format";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("character")
    .setDescription("Gets a character from Blue Archive via name (You can get a random one if you don't specify a name)")
    .addStringOption(option => option
      .setName("name")
      .setDescription("The name of the character")
      .setRequired(false)
    ),
  handler: async ({ interaction, author }) => {
    await interaction.deferReply();

    const name = interaction.options.getString("name");
    const characters = await new BlueArchive().characters();

    if (!characters)
      return interaction.editReply(Messages.BLUE_ARCHIVE_API_ERROR);

    const character = name ? 
      characters.find(character => character.name.toLowerCase() === name.toLowerCase()) :
      characters[Math.floor(Math.random() * characters.length)];

    if (!character)
      return interaction.editReply(format(Messages.BLUE_ARCHIVE_API_CHARACTER_NOT_FOUND, { character_name: name ?? "unknown" }));

    const embed = EmbedBuilder.create(character.name, character.data.bio, "Blue")
      .setURL(character.url)
      .setThumbnail(character.icon)
      .setImage(`https://images.dotgg.gg/bluearchive/weapons/${ character.data.weapon.img }`)
      .setFooter({
        text: `Requested by ${author.tag}`,
        iconURL: author.avatarURL() ?? ""
      })
      .addFields(
        { name: "Age", value: character.data.profile.age, inline: true },
        { name: "Height", value: character.data.profile.height, inline: true },
        { name: "School", value: character.data.profile.school, inline: true },
        { name: "Hobby", value: character.data.profile.hobby, inline: true },
        { name: "Club", value: character.data.profile.club, inline: true },
        { name: "Weapon", value: character.data.weapon.name, inline: true },
        { name: "Position", value: character.data.position, inline: true },
        { name: "Role", value: character.data.role, inline: true },
        { name: "Type", value: character.data.type, inline: true },
        { name: "CV", value: character.data.profile.CV, inline: true },
      );

    await interaction.editReply({
      embeds: [embed]
    });
  }
})