<template>
  <transition name="modal">
    <div class="modal-mask" v-if="showModal">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header"> Titre par défaut de la modale </slot>
            <button class="modal-default-button" @click="$emit('close')">&times;</button>
          </div>

          <div class="modal-body">
            <slot name="body"> Contenu par défaut de la modale. </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="modal-default-button" @click="$emit('onValid')">Valider</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  showModal: Boolean
})
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-wrapper {
  z-index: 10000;
}

.modal-container {
  background: white;
  max-width: 500px;
  width: 90%;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease-in-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  margin: 20px 0;
}

.modal-footer {
  text-align: right;
}

.modal-default-button {
  cursor: pointer;
  padding: 10px 20px;
  background: #7c5cff;
  border: none;
  color: white;
  margin: 0 10px;
  border-radius: 5px;
}

.modal-default-button:hover {
  background: #5b34f5;
}

@media (max-width: 600px) {
  .modal-container {
    width: 95%;
    padding: 15px;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s;
}

.modal-enter,
.modal-leave-to {
  opacity: 0;
}
</style>
