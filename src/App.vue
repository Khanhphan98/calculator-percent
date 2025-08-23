<script setup lang="ts">
import {computed, ref} from "vue";

const size = ref('1.0');
const unit = ref('%');
const disableMinus = computed(() => size.value === '0' && unit.value === '%');
const disablePlus = computed(() => size.value === '100' && unit.value === '%');

const handleSize = (value: string): string => {
  if (!value) return '0';

  // đổi dấu phẩy thành dấu chấm
  value = value.replace(/,/g, '.');

  // loại bỏ ký tự không phải số hoặc dấu chấm
  value = value.replace(/(?!^-)[^0-9.]/g, '');

  const dotIndex = value.indexOf('.');
  if (dotIndex !== -1) {
    if (dotIndex === value.length - 1) {
      // nếu dấu chấm ở cuối chuỗi xoá nó
      value = value.slice(0, value.length - 1);
    } else {
      // nếu có nhiều dấu chấm → chỉ giữ dấu chấm đầu tiên
      value = value.slice(0, dotIndex + 1) + value.slice(dotIndex + 1).replace(/\./g, '');
    }
  }

  // valid giá trị -, ., '', hoặc giá trị âm với đơn vị '%'
  if (value === '-' || value === '.' || value === '' || (parseFloat(value) < 0 && unit.value === '%')) return '0';

  // loại bỏ số 0 ở đầu chuỗi, trừ khi giá trị là '0'
  value = value.replace(/^0+(?!$)/, '');

  if (unit.value === '%' && parseFloat(value) > 100) return '100';

  return value;
}

const outfocus = (value: string) => size.value = handleSize(value);
const switchUnit = (value: string) => {
  unit.value = value;
  if (value === '%') {
    if (parseFloat(size.value) > 100) size.value = '100';
    else if (parseFloat(size.value) < 0) size.value = '0';
  }
}
const calculator = (plus: boolean) => {
  // Chuyển đổi giá trị size sang số và cộng trừ 1
  const newSize = parseFloat((parseFloat(size.value) + (plus ? + 1 : - 1)).toFixed(2));
  // Kiểm tra đơn vị là '%', và set 100 và 0 nếu vượt quá giới hạn
  if (unit.value === '%') {
    if (newSize > 100) size.value = '100';
    else if (newSize < 0) size.value = '0';
    else size.value = newSize.toString();
  } else {
    size.value = newSize.toString();
  }
}

</script>

<template>
  <div class="h-screen w-screen bg-neutral-900 flex items-center justify-center">
    <div class="w-4xl flex h-screen items-center  justify-center  bg-[#303030]">
      <!-- Unit toggle -->
      <div class="w-[280px] text-[12px]">
        <div class="bg-neutral-900 p-[15px] rounded-lg">
          <div class="flex items-center justify-between mb-[15px] text-gray-400">
            <span>Unit</span>
            <div class="flex rounded-lg w-[140px] h-[36px] bg-[#212121] p-0.5">
              <button @click="switchUnit('%')" :class="['flex-1 text-white rounded-lg  transition duration-200', unit === '%' ? 'bg-[#424242]' : '']">%</button>
              <button @click="switchUnit('px')" :class="['flex-1 text-white rounded-lg  transition duration-200', unit === 'px' ? 'bg-[#424242]' : '']">px</button>
            </div>
          </div>
          <div class="flex items-center justify-between text-gray-400">
            <span>Value</span>
            <div class="group relative flex items-center justify-between rounded-lg w-[140px] h-[36px] bg-[#212121] text-white">
              <button id="minus" @click="calculator(false)" :disabled="disableMinus"
                      :class="[disableMinus ? 'text-gray-400' : '', 'w-10 h-full text-lg rounded-l-lg hover:bg-[#424242]']">−</button>
              <input v-model="size" type="text" class="peer flex-1 h-full min-w-0 bg-transparent text-center outline-none" @focusout="outfocus(size)" />
              <button id="plus" @click="calculator(true)" :disabled="disablePlus"
                      :class="[disablePlus ? 'text-gray-400' : '', 'w-10 h-full text-lg rounded-r-lg hover:bg-[#424242]']">＋</button>

              <div v-if="disableMinus" class="hidden group-hover:block absolute bg-[#212121] text-white p-2 rounded -top-10 -left-1/4">
                Value must greater than 0
              </div>
              <div v-if="disablePlus" class="hidden group-hover:block absolute bg-[#212121] text-white p-2 rounded -top-10 -right-16">
                Value must smaller than 100
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.group:has(input:hover) {
  background-color: #424242;
  transition: 150ms;
}

.group:has(input:focus) {
  border: 1px solid #3C67FF;
  background-color: transparent;
}

.group button:hover {
  transition: 150ms;
  background-color: #424242;
}
</style>
