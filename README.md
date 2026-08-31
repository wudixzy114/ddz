# ddz

> **基于 NestJS 11 + Socket.IO 11 + Vue 3 的"三人斗地主"全栈项目：服务端管理房间 / 牌型 / 出牌，客户端 Vue 3 + Tailwind + GSAP 渲染牌桌。**

## 项目定位 / 背景

`ddz` 是一个**面向学习**的全栈斗地主实现，采用 pnpm workspace 拆成三个 package：客户端、服务端、共享层。`@ddz/shared` 里定义了所有协议（`SocketEvents` 枚举、`ICard` / `IGamePlayer` / `IRoom` 接口、`PokerHelper` 静态方法类），客户端与服务端都从这里 import 同一份逻辑——牌型识别、比较大小、洗牌排序这种"纯函数"在两端都能用，避免重复实现。

服务端用 **NestJS 11** + **@nestjs/websockets** + **socket.io** 实现：HTTP 入口和 WebSocket 入口共用一个进程，`GameGateway` 处理 `connection/disconnect/joinRoom/playerReady` 四种事件，`RoomManager`（in-memory Map）管理房间和发牌。客户端用 **Vue 3.5** + **Tailwind 4** + **GSAP 3**（做发牌/出牌动画）+ **socket.io-client** 跟服务端保持长连接。Concurrently 在根目录起 `shared dev`（watch 模式）+ `server start:dev` + `client dev` 三个进程。

牌型分析是项目的亮点之一：`PokerHelper.analyzeCardType` 支持单张、对子、三张、三带一/二、顺子、连对、飞机、四带二/对、炸弹、王炸，并提供 `canBeat(prev, curr)` 比较函数；当前已经覆盖大部分基础牌型，但 4+2 之外的复杂变形以及"叫地主/加倍/出牌回合"流程还没接完。

## 仓库结构

```
ddz/
├── package.json                # 根：concurrently 串联三个子包
├── pnpm-workspace.yaml         # packages/*
├── pnpm-lock.yaml
├── packages/
│   ├── client/                 # Vue 3 + Vite 前端
│   │   ├── package.json        # @ddz/client
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tsconfig.{json,app.json,node.json}
│   │   └── src/
│   │       ├── main.ts
│   │       ├── App.vue
│   │       ├── style.css
│   │       ├── assets/vue.svg
│   │       └── components/HelloWorld.vue
│   │
│   ├── server/                 # NestJS + Socket.IO 后端
│   │   ├── package.json        # @ddz/server
│   │   ├── nest-cli.json
│   │   ├── eslint.config.mjs
│   │   ├── tsconfig.{json,build.json}
│   │   ├── test/
│   │   │   ├── app.e2e-spec.ts
│   │   │   └── jest-e2e.json
│   │   └── src/
│   │       ├── main.ts
│   │       ├── app.module.ts
│   │       ├── app.controller.ts
│   │       ├── app.service.ts
│   │       └── game/
│   │           ├── game.module.ts
│   │           ├── game.gateway.ts   # WebSocket 网关
│   │           └── room.manager.ts   # 房间 + 发牌 + 玩家管理
│   │
│   └── shared/                 # 跨端协议 + 牌型工具
│       ├── package.json        # @ddz/shared
│       ├── tsconfig.json
│       ├── tsup.config.ts      # 打包为 CJS + ESM + .d.ts
│       ├── dist/               # 已构建产物
│       └── src/
│           ├── index.ts
│           ├── constants.ts
│           ├── enums.ts        # CardType / Rank / Suit / RoomState / PlayerRole / SocketEvents
│           ├── interfaces/
│           │   ├── core.ts     # ICard / IGamePlayer / IRoom / GameStartPayload
│           │   └── dto.ts      # JoinRoomDto / ExceptionPayload
│           └── utils/
│               └── poker.helper.ts  # createDeck / shuffle / sortCards / analyzeCardType / canBeat
```

## 技术栈

### 根
- pnpm workspace（`packages/*`），`concurrently ^9.2.1` 并行跑三个 dev

### Server（@ddz/server）
| 类别 | 选型 | 版本 |
| --- | --- | --- |
| 框架 | @nestjs/common、@nestjs/core、@nestjs/platform-express | 11.0.1 |
| WebSocket | @nestjs/websockets、@nestjs/platform-socket.io、socket.io | 11.1.12 / 4.8.3 |
| 校验 | class-validator、class-transformer | 0.14.3 / 0.5.1 |
| 工具 | uuid、reflect-metadata、rxjs | 13.0.0 / 0.2.2 / 7.8.1 |
| 测试 | jest、ts-jest、supertest | 30 / 29.2.5 / 7.0.0 |
| Lint | eslint、@typescript-eslint、prettier | 9.18 / 8.20 / 3.4.2 |
| TS | typescript | 5.7.3 |

### Client（@ddz/client）
| 类别 | 选型 | 版本 |
| --- | --- | --- |
| 框架 | Vue | 3.5.24 |
| 状态 | Pinia | 3.0.4 |
| 工具 | @vueuse/core、gsap、socket.io-client | 14.1.0 / 3.14.2 / 4.8.3 |
| 样式 | tailwindcss、@tailwindcss/vite、daisyui | 4.1.18 / 4.1.18 / 5.5.14 |
| 构建 | Vite、@vitejs/plugin-vue、vue-tsc | 7.2.4 / 6.0.1 / 3.1.4 |
| TS | TypeScript | 5.9.3 |

### Shared（@ddz/shared）
- tsup 打包成 CJS + ESM + 双 .d.ts

## 核心模块 / 特性

- **协议共享**：`@ddz/shared` 是单一事实源。`enums.ts` 里 `SocketEvents`（`JOIN_ROOM` / `LEAVE_ROOM` / `PLAYER_READY` / `GAME_START` / `EXCEPTION` 等）、`CardType`（单/对/三/三带/飞机/炸弹/王炸/INVALID）、`Rank / Suit / RoomState / PlayerRole`。`interfaces/core.ts` 是 `ICard` / `IGamePlayer` / `IRoom` / `GameStartPayload` 等结构体。
- **`PokerHelper`**（`packages/shared/src/utils/poker.helper.ts`）：单文件 ~180 行的"斗地主规则引擎"。`createDeck` 生成 54 张（3-15 各四花色 + 大小王）；`shuffle` 用 Fisher–Yates；`sortCards` 按 rank 降序、suit 降序；`analyzeCardType` 返回 `{ type, value }`；`canBeat` 实现"同类型按 value 比、王炸通吃、炸弹单独比"的判定。
- **`RoomManager`**（`packages/server/src/game/room.manager.ts`）：内存 `Map<roomId, IRoom>` + `Map<socketId, roomId>`。`joinRoom` 自动找空房间或新建；`playerReady` 三人都 ready 后调 `startGame`，按 `PokerHelper.shuffle` 切 17/17/17/3 底牌，每位玩家拿到的 `handCards` 用 `sortCards` 排好返回。`seatIndex` 自动分配 0/1/2。
- **`GameGateway`**（`packages/server/src/game/game.gateway.ts`）：`@WebSocketGateway({ cors: { origin: '*' } })`，`handleConnection` 从 `handshake.query.token / userId` 取身份（TODO 真正校验），`@SubscribeMessage(SocketEvents.JOIN_ROOM)` 广播 `newPlayer` 给其他人并把整个 `room` 回给当前连接。
- **客户端**：当前只放了一个 `HelloWorld.vue` 占位，连接 socket.io / 房间 UI / 牌桌视图是接下来要做的活。
- **Concurrently 编排**：根目录 `pnpm dev` 一行命令拉起 `shared dev`（watch）、`server start:dev`（nest --watch）、`client dev`（Vite）。

## 已完成 / 进行中

- ✅ 三个 package 拆分 + workspace 联通
- ✅ `@ddz/shared` 协议 + 牌型识别 + tsup 产物
- ✅ 服务端 WebSocket 网关 + 房间管理 + 发牌
- ✅ 客户端基础脚手架（Vue 3 + Tailwind 4 + daisyui 5）
- ⏳ 客户端房间 UI、牌桌、出牌交互
- ⏳ 叫地主 / 加倍 / 出牌回合流程
- ⏳ token 校验、掉线重连、积分结算
- ❌ 单元测试（NestJS 默认 jest 配置已就位但未写）

## 本地开发

```bash
# 在根目录
pnpm install
pnpm dev                  # 同时起 server + client + shared watch

# 单独跑某一块
pnpm --filter @ddz/server start:dev
pnpm --filter @ddz/client dev
pnpm --filter @ddz/shared dev

# 测试
pnpm --filter @ddz/server test
pnpm --filter @ddz/server test:e2e
```

## 状态

v1.0.0（根 package），子包都是 `0.0.x`。**协议层与牌型规则已就位，能在 NestJS 内打通"加入房间 → 准备 → 发牌"的端到端流程**；客户端 UI 还在脚手架阶段。

## License

服务端 `UNLICENSED`；其他子包未声明。
