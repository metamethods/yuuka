export interface CharacterData {
  name: string,
  url: string,
  imgSmall: string,
  img: string,
  bio: string,
  type: "striker" | "special",
  role: "DPS" | "Healer" | "Support" | "Tank" | "T.S.",
  position: "front" | "middle" | "back",
  profile: Profile,
  skills: Skill[],
  weapon: Weapon,
  skillprio: SkillPrio,
  __v: number,
}

export interface Profile {
  familyName: string,
  age: string,
  height: string,
  hobby: string,
  school: string,
  club: string,
  weaponName: string,
  weaponType: string,
  CV: string,
}

export interface Skill {
  name: string,
  type: "EX" | "Normal" | "Passive" | "Sub",
  description: string,
  parameters: string[][],
  cost: number[],
  img: string
}

export interface Weapon {
  name: string,
  img: string,
  desc: string,
  type: string,
  attack: number,
  attackAdd: number,
  hp: number,
  hpAdd: number,
  heal: number,
  healAdd: number,
}

export interface SkillPrio {
  _id: string,
  "General Skill Priority": string,
  "Early to Mid Game investments": string,
  "Recommended Investment pre UE5": string,
  "Recommended Investment UE40": string,
  Notes: string,
  "Additional Notes": string,
  name: string,
  __v: number
}