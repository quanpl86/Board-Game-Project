/** Demo-only catalog; not a database-backed Game Registry. */
export interface GameCatalogItem {
  id: string;
  name: string;
  genre: "Chiến thuật" | "Giải đố" | "STEM 3D";
  description: string;
  playersMin: number;
  playersMax: number;
  status: "planned";
}
export const sampleGames: readonly GameCatalogItem[] = [
  {id:"gomoku",name:"Cờ caro",genre:"Chiến thuật",description:"Cờ tư duy theo lượt, đang chuẩn bị Game SDK.",playersMin:2,playersMax:2,status:"planned"},
  {id:"logic-islands",name:"Logic Islands",genre:"Giải đố",description:"Thử thách tư duy logic và hợp tác.",playersMin:1,playersMax:4,status:"planned"},
  {id:"eco-city-lab",name:"Eco City Lab",genre:"STEM 3D",description:"Thiết kế thành phố xanh và cân bằng tài nguyên.",playersMin:2,playersMax:4,status:"planned"},
];
