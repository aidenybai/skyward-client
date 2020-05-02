class Skywarder {
  constructor(token, url = 'https://www2.swrdc.wa-k12.net/scripts/cgiip.exe/WService=wcamass71/seplog01.w') {
    this.user = null;
    this.pass = null;
    this.token = token;
    this.url = url;
    this.base = 'https://api.skywarder.cf/v1';
  }

  login(user, pass) {
    return new Promise((resolve, reject) => {
      this.user = user;
      this.pass = pass;
      this.checkAuthentication()
        .then(body => {
          if (!body.message) {
            this.user = null;
            this.pass = null;
            reject('Unable to login');
          } else resolve(true);
        });
    });
  }

  checkAuthentication(user, pass) {
    return this.buildAPIMethod(
      `${this.base}/login?username=${this.user}&password=${this.pass}&skyward=${this.url}`
    );
  }

  getReport() {
    return this.buildAPIMethod(
      `${this.base}/report?username=${this.user}&password=${this.pass}&skyward=${this.url}`
    );
  }

  getGradebook(course, bucket) {
    return this.buildAPIMethod(
      `${this.base}/gradebook?username=${this.user}&password=${this.pass}&skyward=${this.url}&course=${course}&bucket=${bucket}`
    );
  }

  getHistory() {
    return this.buildAPIMethod(
      `${this.base}/history?username=${this.user}&password=${this.pass}&skyward=${this.url}`
    );
  }

  getAllCourses(
    buckets = [
      'TERM 1',
      'TERM 2',
      'TERM 3',
      'SEM 1',
      'TERM 4',
      'TERM 5',
      'TERM 6',
      'SEM 2'
    ]
  ) {
    return new Promise((resolve, reject) => {
      let result = [];
      this.getReport()
        .then(async body => {
          for (let bucket of buckets) {
            let store = {};
            store[bucket] = [];
            for (let chunk of body.data) {
              const course = await this.getGradebook(chunk.course, bucket);
              store[bucket].push(course.data);
            }
            result.push(store);
          }
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  lockAttack(victim, requests) {
    return this.buildAPIMethod(
      `${this.base}/lock?username=${victim}&requests=${requests}&skyward=${this.url}`
    );
  }

  buildAPIMethod(path) {
    return new Promise((resolve, reject) => {
      if (!this.user || !this.pass || !this.token) reject('Invalid or missing credentials');
      fetch(`${path}&access_token=${this.token}`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache', 
        credentials: 'same-origin', 
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
      })
        .then(res => res.json())
        .then(body => resolve(body))
        .catch(err => reject(err));
    });
  }
}