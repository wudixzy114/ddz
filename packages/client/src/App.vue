<script lang="ts" setup>
import {io, Socket} from "socket.io-client";
import {onMounted, ref} from "vue";
import {type IRoom, SocketEvents} from "@ddz/shared";

const socket = ref<Socket>()
const currentRoom = ref<IRoom | null>(null);
const status = ref("Disconnected")
const errorMsg = ref('')

onMounted(() => {
  socket.value = io('http://localhost:3000', {
    query: {userId: `user_${Date.now()}`} // 模拟唯一ID
  })

  socket.value.on(SocketEvents.CONNECT, () => {
    status.value = 'Connected: ' + socket.value?.id
  })

  socket.value.on(SocketEvents.JOIN_ROOM, (data) => {
    // 如果 data.room 存在，说明是自己收到的完整快照
    // 如果 data.newPlayer 存在，说明是别人收到的通知
    if (data.room) {
      currentRoom.value = data.room
      console.log('Joined Room:', data.room)
    } else {
      console.log('Other player joined:', data.newPlayer)
      // 简单粗暴更新：实际开发中应该 merge 列表
      if (currentRoom.value) currentRoom.value.players.push(data.newPlayer)
    }
  })

  socket.value.on(SocketEvents.EXCEPTION, (err) => {
    errorMsg.value = err.message
    setTimeout(() => errorMsg.value = '', 3000) // 3秒后消失
  })
})

const joinGame = () => {
  // 发送加入事件
  socket.value?.emit(SocketEvents.JOIN_ROOM, {roomId: ''}) // 空字符串表示随机匹配
}
</script>

<template>
  <div class="p-10 min-h-screen bg-base-200 flex flex-col items-center gap-6">
    <div :class="status.includes('Connected') ? 'badge-success' : 'badge-error'" class="badge badge-lg">
      {{ status }}
    </div>

    <div v-if="errorMsg" class="alert alert-error shadow-lg w-96 animate-bounce">
      <span>{{ errorMsg }}</span>
    </div>

    <!-- 还没进房间 -->
    <div v-if="!currentRoom" class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body items-center text-center">
        <h2 class="card-title text-3xl mb-4">斗地主大厅</h2>
        <button class="btn btn-primary btn-lg btn-wide" @click="joinGame">
          快速开始
        </button>
      </div>
    </div>

    <!-- 进了房间 -->
    <div v-else class="w-full max-w-4xl">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">房间号: {{ currentRoom.id }}</h2>
        <div class="badge badge-info">{{ currentRoom.state }}</div>
      </div>

      <!-- 简单展示玩家列表 -->
      <div class="grid grid-cols-3 gap-4">
        <div v-for="player in currentRoom.players" :key="player.userId"
             :class="player.socketId === socket?.id ? 'border-primary' : 'border-transparent'"
             class="card bg-base-100 shadow-xl border-2">
          <div class="card-body items-center">
            <div class="avatar placeholder">
              <div class="bg-neutral-focus text-neutral-content rounded-full w-16">
                <span class="text-xl">{{ player.username.slice(0, 1) }}</span>
              </div>
            </div>
            <h3 class="font-bold">{{ player.username }}</h3>
            <div class="badge badge-ghost">座位: {{ player.seatIndex }}</div>
            <div v-if="player.socketId === socket?.id" class="badge badge-primary">我</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>