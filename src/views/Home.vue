<template>
  <div class="row">
    <div class="row" v-if="isLogged">
      <div class="col">
        <h1 class="text-primary">Resumen de tu cuenta</h1>
        <h2 class="text-primary">{{ balance }} ETH</h2>
        <h1 class="text-success">Resumen de tu alcancia</h1>
        <h2 class="text-success">{{ piggyBankBalance }} ETH</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor eaque et mollitia quae
          quam
          vel velit! Accusantium dignissimos ea harum, ipsam itaque magnam nesciunt quibusdam
          recusandae repudiandae tempore, temporibus voluptatibus.</p>
      </div>
      <div class="col">
        <form @submit.prevent="send">
          <div class="form-group">
            <label for="amount">Monto</label>
            <input type="number" class="form-control" id="amount" step="0.0001" min="0.0001"
                   v-model="amount" required>
          </div>
          <div class="form-group">
            <label for="message">Mensaje</label>
            <textarea class="form-control" id="message" rows="4" maxlength="140"
                      v-model="msg" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Enviar</button>
          <button type="button" class="btn btn-warning btn-block" v-if="isOwner" @click="withdraw">
            Retirar fondos
          </button>
        </form>
        <div class="alert alert-danger alert-dismissible fade show mt-3" role="alert"
             v-if="message">
          <strong>Error:</strong> {{ message }}
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="alert alert-success alert-dismissible fade show mt-3" role="alert"
             v-if="transactionHash">
          <strong>¡Transacción exitosa!</strong> Tu hash de transacción es:
          <small>{{ transactionHash }}</small>.
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    </div>
    <div class="col" v-else>
      <h1>Alcancia</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi aut consectetur corporis
        cum cumque deserunt dolores inventore iusto magni modi nam natus nisi omnis placeat quidem
        quod, similique, sit velit!</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import * as constants from '@/store/constants';

export default {
  name: 'Home',
  data() {
    return {
      amount: null,
      msg: null,
    };
  },
  computed: {
    ...mapGetters({
      isLogged: constants.SESSION_IS_LOGGED,
    }),
    ...mapState({
      balance: (state) => state.Session.balance,
      piggyBankBalance: (state) => state.PiggyBank.balance,
      isOwner: (state) => state.PiggyBank.isOwner,
      message: (state) => state.PiggyBank.message,
      transactionHash: (state) => state.PiggyBank.transactionHash,
    }),
  },
  methods: {
    ...mapActions({
      getBalance: constants.SESSION_GET_BALANCE,
      getPiggyBankBalance: constants.PIGGY_BANK_GET_BALANCE,
      getOwner: constants.PIGGY_BANK_GET_OWNER,
      withdraw: constants.PIGGY_BANK_WITHDRAW,
      deposit: constants.PIGGY_BANK_DEPOSIT,
    }),
    send() {
      this.deposit({
        amount: this.amount,
        msg: this.msg,
      });
    },
  },
  updated() {
    this.getBalance();
    this.getPiggyBankBalance();
    this.getOwner();
  },
};
</script>
