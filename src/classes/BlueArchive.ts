import type { CharacterData } from "@typings/blueArchive";

export default class BlueArchive {
  constructor() {}

  public async characters(): Promise<Character[] | null> {
    const request = await fetch("https://api.dotgg.gg/bluearchive/characters");
    const response = await request.json() as CharacterData[];
    const characters = [];

    for (const character in response) 
      characters.push(new Character(response[character]));
    
    return characters;
  }
}

export class Character {
  constructor(
    public data: CharacterData
  ) {}

  public get name() {
    return this.data.name;
  }

  public get url() {
    return `https://bluearchive.gg/characters/${this.data.url}`;
  }

  public get icon() {
    return `https://images.dotgg.gg/bluearchive/characters/${this.data.imgSmall}`;
  }

  public get portrait() {
    return `https://images.dotgg.gg/bluearchive/characters/${this.data.img}`;
  }
}