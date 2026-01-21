import {Module} from "@nestjs/common";
import {GameGateway} from "./game.gateway";
import {RoomManager} from "./room.manager";

@Module({
    providers: [GameGateway, RoomManager],
})

export class GameModule {
}