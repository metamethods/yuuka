import { SlashCommandBuilder } from "discord.js";
import { Messages } from "@enums/messages";

import Command from "@schemas/Command";
import BlueArchive from "@classes/BlueArchive";
import EmbedBuilder from "@schemas/EmbedBuilder";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Searches a character from Blue Archive with a (partial) name + flags")
    .addStringOption(option => option
      .setName("name")
      .setDescription("The name of the character")
      .setRequired(false)
    )
    .addStringOption(option => option
      .setName("role")
      .setDescription("The role of the character")
      .setRequired(false)
      .setChoices(
        { name: "DPS", value: "DPS" },
        { name: "Tank", value: "Tank" },
        { name: "Healer", value: "Healer" },
        { name: "Supporter", value: "Supporter" },
        { name: "T.S.", value: "T.S." }
      )
    )
    .addStringOption(option => option
      .setName("position")
      .setDescription("The position of the character is in during battle")
      .setRequired(false)
      .setChoices(
        { name: "Front", value: "Front" },
        { name: "Middle", value: "Middle" },
        { name: "Back", value: "Back" }
      )
    ),
  handler: async ({ interaction }) => {
    await interaction.deferReply();

    const name = interaction.options.getString("name");
    const role = interaction.options.getString("role");
    const position = interaction.options.getString("position");

    const characters = await new BlueArchive().characters();

    if (!characters)
      return interaction.editReply(Messages.BLUE_ARCHIVE_API_ERROR);

    const filteredCharacters = characters.filter(character => {
      if (name && !character.name.toLowerCase().includes(name.toLowerCase()))
        return false;

      if (role && character.data.role !== role)
        return false;

      if (position && character.data.position !== position)
        return false;

      return true;
    });

    const format = filteredCharacters.map(character => `**${character.name}** - ${character.data.role} - ${character.data.position}`).slice(0, 30).join("\n");

    console.log(format);

    await interaction.editReply({
      embeds: [
        EmbedBuilder.create("Search results", `${Messages.BLUE_ARCHIVE_API_SEARCH_SUCCESS}\n\n${format}`, "Blue")
          .setThumbnail(filteredCharacters[0]?.icon ?? "https://bluearchive.gg/wp-content/uploads/BlueArchive.gg-Logo.png")
          .setFooter({ text: `Found ${filteredCharacters.length} results` })
      ]
    });
  }
})