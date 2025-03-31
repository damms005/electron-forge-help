<template>
  <label> Firstname <input v-model="firtsName" type="text" /> </label>
  <label> Lastname <input v-model="lastName" type="text" /> </label>
  <label>
    Avatar
    <input ref="inputBox" type="file" @input="convert" />
  </label>

  <div id="original-container">
    <img v-if="srcOriginal" :src="srcOriginal" />
  </div>

  <div id="preview-container">
    <img v-if="srcConverted" :src="srcConverted" />
  </div>

  <div v-if="users.length">
    <div v-for="user in users">{{ user.firstName }} {{ user.lastName }}</div>
  </div>
</template>

<script setup lang="ts">
import { User } from "global";
import { ref } from "vue";

const firtsName = ref("John");
const lastName = ref("Doe");
const srcOriginal = ref();
const srcConverted = ref();
const inputBox = ref();
const users = ref<User[]>([]);

function convert() {
  if (!inputBox.value?.files) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    srcOriginal.value = URL.createObjectURL(inputBox.value.files[0]);

    const thumbnailPreview = await window.app.makeThumbnail(
      event.target.result as ArrayBuffer
    );

    srcConverted.value = URL.createObjectURL(new Blob([thumbnailPreview]));
    users.value = await window.app.storeUser(firtsName.value, lastName.value);
  };

  reader.readAsArrayBuffer(inputBox.value.files[0]);
}
</script>

<style>
#original-container {
  margin: 3px;
  min-height: 150px;
  max-height: 150px;
  overflow: hidden;
  border: 1px solid red;
}

#preview-container {
  margin: 3px;
  min-height: 50px;
  max-height: 50px;
  overflow: hidden;
  border: 1px solid blue;
}
</style>
