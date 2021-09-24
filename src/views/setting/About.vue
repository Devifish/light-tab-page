<template>
  <footer class="about-warp">
    <p class="app-name">
      {{ appName }}
      <br />
      <span class="app-version">Version {{ appVersion }}</span>
    </p>

    <ul class="social">
      <li v-for="(url, name) of social">
        <a :href="url">{{ name }}</a>
      </li>
    </ul>

    <p class="copyright">
      <a href="https://github.com/Devifish/light-tab-page/blob/master/LICENSE">
        {{ t("about.license") }}
      </a>
      <br />
      Copyright © 2021 Devifish. All rights reserved.
    </p>
  </footer>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const appName = import.meta.env.npm_package_name
const appVersion = import.meta.env.npm_package_version

const social: Record<string, string> = {
  [t("about.projectHome")]: "https://github.com/Devifish/light-tab-page",
  [t("about.changelog")]: "https://github.com/Devifish/light-tab-page/blob/master/CHANGELOG.md",
  [t("about.feedback")]: "https://github.com/Devifish/light-tab-page/issues"
}
</script>

<style lang="less">
.about-warp {
  .app-name {
    font-size: 14px;
    margin: 0;
  }
  .app-version {
    font-size: 12px;
  }

  .social {
    margin: 12px 0;
  }

  .copyright {
    margin: 0;
    font-size: 12px;
    color: #888;

    a {
      color: #888;
    }
  }
}
</style>
