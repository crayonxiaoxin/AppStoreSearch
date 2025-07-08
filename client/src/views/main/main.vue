<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref, reactive, toRaw, watch } from 'vue';

import type { FormInstance, FormRules } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()

interface RuleForm {
  name: string,
  country: string,
}

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  name: '',
  country: 'HK',
});

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: 'Please input', trigger: 'blur' },
  ],
  country: [
    { required: true, message: 'Please input country/district', trigger: 'blur' },
  ],
})

const list = ref([]);
const districts = ref([]);
const options = ref([]);
const loading = ref(false);

const getDistricts = async () => {
  loading.value = true;
  const res = await axios.get('/api/country');
  districts.value = res.data;
  options.value = districts.value;
  loading.value = false;
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await search();
    } else {
      console.log('error submit!', fields)
    }
  })
}

const search = async () => {
  loading.value = true;
  const params = toRaw(ruleForm);

  const res = await axios.get('/api/itunes/search', {
    params: {
      term: params.name,
      country: params.country,
      media: 'software',
      limit: 50,
    }
  });
  // console.log(res.data);
  if (res.data.resultCount > 0) {
    list.value = res.data.results;
  }
  loading.value = false;

  // 改变 url
  router.push({
    path: '/',
    query: {
      term: params.name,
      country: params.country,
    }
  });
}

const onKeywordChange = (_) => {
  if (ruleForm.name === '') {
    list.value = [];
    options.value = districts.value;
  }
};

const filterMethod = (query) => {
  if (districts.value.length === 0) {
    return;
  }
  options.value = districts.value.filter(item => item.name.common.toLowerCase().includes(query.toLowerCase()) || item.cca2.toLowerCase().includes(query.toLowerCase()) || item.cioc.toLowerCase().includes(query.toLowerCase()));
};

onMounted(async () => {
  const route = useRoute()
  getDistricts();
  if (route.query) {
    ruleForm.name = route.query.term != null ? route.query.term as string : '';
    if (route.query.country != null) {
      ruleForm.country = route.query.country as string || '';
    }
    if (ruleForm.name != '' && ruleForm.country != '') {
      await search();
    }
  }
});
</script>

<template>
  <main v-loading="loading" class="relative">

    <a class="absolute top-0 right-0 inline-block" href="https://github.com/crayonxiaoxin/AppStoreSearch"
      target="_blank">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2">
        </path>
      </svg>
    </a>

    <div class="pb-6">
      <div class="text-2xl font-bold">
        App Search
      </div>
      <div class="!mt-3 text-sm text-gray-600">Search for apps in the app store from any country or region.</div>
    </div>

    <el-form ref="ruleFormRef" :inline="true" :label-width="0" :model="ruleForm" :rules="rules" hide-required-asterisk>
      <el-form-item label="Term" prop="name">
        <el-input v-model="ruleForm.name" clearable @change="onKeywordChange" @keyup.enter="submitForm(ruleFormRef)"
          placeholder="Keywords" />
      </el-form-item>

      <el-form-item label="Country/District" prop="country">
        <el-select v-model="ruleForm.country" placeholder="Select" filterable :filter-method="filterMethod">
          <el-option v-for="item in options" :key="item.cca2" :label="item.name.common" :value="item.cca2">
            <div>
              <img :src="item.flags.png" class="w-8 inline-block align-middle" alt="">
              <span class="inline-block align-middle pl-2">{{ item.name.common }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" round @click="submitForm(ruleFormRef)">
          Search
        </el-button>
      </el-form-item>
    </el-form>

    <hr class="text-gray-200 !my-6">


    <el-empty v-show="list.length == 0" description="No data" />
    <div class="grid grid-cols-1 gap-6 md:gap-8 lg:gap-10 md:grid-cols-2 lg:grid-cols-2">
      <div v-for="item in list" :key="item.bundleId" class="flex gap-3">
        <div class="flex-1">
          <el-image class="w-full rounded-3xl shadow-md border-solid border-gray-200 aspect-square" fit="fill"
            :src="item.artworkUrl512" />
        </div>
        <div class="flex-2">
          <div class="">
            <span class="!font-bold text-md md:text-lg align-middle">{{ item.trackName }}</span>
            <span
              class="border-1 border-solid border-gray-900 rounded-sm text-xs px-[2px] !ml-2 inline-block align-middle">
              {{ item.contentAdvisoryRating }}</span>
          </div>
          <div>
            <a :href="item.artistViewUrl" target="_blank" class="text-[#0070c9] leading-none">
              {{ item.artistName }}
            </a>
          </div>
          <div v-if="item.averageUserRating != null && item.averageUserRating > 0">
            <el-rate :model-value="Math.floor(item.averageUserRating * 10) / 10" disabled show-score size="small"
              text-color="#ff9900" score-template="{value}" />
          </div>
          <div>
            <span class="inline-block !mr-2 text-gray-500">v{{ item.version }}</span>
            <span class="inline-block text-green-800">{{ item.formattedPrice }}</span>
          </div>
          <a :href="item.trackViewUrl" target="_blank"
            class="inline-block border-1 border-solid border-[#0070c9] text-[#0070c9] rounded-sm text-sm px-3 py-[2px] !mt-1">View
            in
            AppStore</a>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
