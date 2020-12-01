<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <router-link class="navbar-brand" :to="{name: 'home'}">
      Alcancia
    </router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse"
            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
            aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'about'}">
            Nosotros
          </router-link>
        </li>
      </ul>
      <div class="form-inline my-2 my-lg-0">
        <button class="btn btn-outline-danger my-2 my-sm-0" type="button" v-if="isLogged"
                @click="disconnect">
          {{ account }}
        </button>
        <button class="btn btn-outline-success my-2 my-sm-0" type="button" v-else @click="connect">
          Conectar
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import {
  mapActions,
  mapGetters,
  mapMutations,
  mapState,
} from 'vuex';
import * as constants from '@/store/constants';

export default {
  name: 'Top',
  computed: {
    ...mapGetters({
      isLogged: constants.SESSION_IS_LOGGED,
    }),
    ...mapState({
      registeredAccount: (state) => state.Session.account,
    }),
    account() {
      return `${this.registeredAccount.substr(0, 5)}...${this.registeredAccount.substr(-5)}`;
    },
  },
  methods: {
    ...mapActions({
      connectToWeb3: constants.SESSION_CONNECT_TO_WEB3,
    }),
    ...mapMutations({
      setSessionProperty: constants.SESSION_SET_PROPERTY,
    }),
    async connect() {
      try {
        // eslint-disable-next-line no-undef
        ethereum.enable();
        this.connectToWeb3();
      } catch (e) {
        console.error(e);
      }
    },
    disconnect() {
      this.setSessionProperty({ account: null });
    },
  },
};
</script>
